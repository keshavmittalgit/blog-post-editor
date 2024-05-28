document.addEventListener('DOMContentLoaded', function() {
    const editor = document.getElementById('editor');
    const saveButton = document.getElementById('saveButton');
    const clearButton = document.getElementById('clearButton');
    const fontSizeSelect = document.getElementById('fontSize');
    const alignLeftButton = document.getElementById('alignLeftButton');
    const alignCenterButton = document.getElementById('alignCenterButton');
    const alignRightButton = document.getElementById('alignRightButton');
    const alignJustifyButton = document.getElementById('alignJustifyButton');
    let currentResizingImage = null;
    let startX, startY, startWidth, startHeight, aspectRatio;

    // Load saved content from local storage
    const savedContent = localStorage.getItem('editorContent');
    if (savedContent) {
        editor.innerHTML = savedContent;
    }

    // Save content to local storage
    saveButton.addEventListener('click', function() {
        localStorage.setItem('editorContent', editor.innerHTML);
        alert('Content saved!');
    });

    // Clear content from local storage
    clearButton.addEventListener('click', function() {
        localStorage.removeItem('editorContent');
        editor.innerHTML = '';
        alert('Content cleared!');
    });

    editor.addEventListener('keydown', function(event) {
        // Check if Ctrl (or Cmd for Mac) is pressed
        if ((event.ctrlKey || event.metaKey) && !event.shiftKey) {
            switch (event.key) {
                case 'b': // Ctrl + B for bold
                    event.preventDefault();
                    document.execCommand('bold', false, null);
                    break;
                case 'i': // Ctrl + I for italic
                    event.preventDefault();
                    document.execCommand('italic', false, null);
                    break;
                case 'u': // Ctrl + U for underline
                    event.preventDefault();
                    document.execCommand('underline', false, null);
                    break;
                case 'z': // Ctrl + Z to undo
                    event.preventDefault();
                    document.execCommand('undo', false, null);
                    break;
                case 'y': // Ctrl + Y to redo
                    event.preventDefault();
                    document.execCommand('redo', false, null);
                    break;
                case 'k': // Ctrl + K to create a link
                    event.preventDefault();
                    let url = prompt("Enter the URL");
                    document.execCommand('createLink', false, url);
                    break;
                case 'p': // Ctrl + P to insert an image
                    event.preventDefault();
                    let imgUrl = prompt("Enter the image URL");
                    document.execCommand('insertImage', false, imgUrl);
                    break;
                case 'ArrowUp': // Ctrl + ArrowUp to increase font size
                    event.preventDefault();
                    changeFontSize(1);
                    break;
                case 'ArrowDown': // Ctrl + ArrowDown to decrease font size
                    event.preventDefault();
                    changeFontSize(-1);
                    break;
                default:
                    break;
            }
        }
    });

    // Handle font size change
    fontSizeSelect.addEventListener('input', function() {
        document.execCommand('fontSize', false, fontSizeSelect.value);
        updateFontSize();
    });

    fontSizeSelect.addEventListener('change', function() {
        document.execCommand('fontSize', false, fontSizeSelect.value);
        updateFontSize();
    });

    // Update the font size of the current selection and ensure typing continues in that size
    function updateFontSize() {
        const selectedText = window.getSelection();
        if (!selectedText.isCollapsed) {
            const range = selectedText.getRangeAt(0);
            const span = document.createElement('span');
            span.style.fontSize = getFontSizeValue(fontSizeSelect.value);
            range.surroundContents(span);
        }
    }

    // Convert the font size value to a CSS font-size string
    function getFontSizeValue(fontSize) {
        switch (fontSize) {
            case '1':
                return '8pt';
            case '2':
                return '10pt';
            case '3':
                return '12pt';
            case '4':
                return '14pt';
            case '5':
                return '18pt';
            case '6':
                return '24pt';
            case '7':
                return '36pt';
            default:
                return '12pt';
        }
    }

    // Function to change font size with keyboard
    function changeFontSize(direction) {
        const currentSize = parseInt(window.getSelection().focusNode.parentNode.size || 3);
        let newSize = currentSize + direction;
        if (newSize < 1) newSize = 1;
        if (newSize > 7) newSize = 7;
        document.execCommand('fontSize', false, newSize);
        fontSizeSelect.value = newSize;
    }

    // Text alignment buttons
    alignLeftButton.addEventListener('click', function() {
        document.execCommand('justifyLeft', false, null);
    });

    alignCenterButton.addEventListener('click', function() {
        document.execCommand('justifyCenter', false, null);
    });

    alignRightButton.addEventListener('click', function() {
        document.execCommand('justifyRight', false, null);
    });

    alignJustifyButton.addEventListener('click', function() {
        document.execCommand('justifyFull', false, null);
    });

    // Drag and drop functionality
    editor.addEventListener('dragover', function(event) {
        event.preventDefault();
        editor.classList.add('dragover');
    });

    editor.addEventListener('dragleave', function(event) {
        event.preventDefault();
        editor.classList.remove('dragover');
    });

    editor.addEventListener('drop', function(event) {
        event.preventDefault();
        editor.classList.remove('dragover');

        const files = event.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.classList.add('resizable');
                    editor.appendChild(img);
                    makeImageResizable(img);
                };
                reader.readAsDataURL(file);
            }
        }
    });

    // Function to make images resizable
    function makeImageResizable(img) {
        img.addEventListener('mousedown', function(event) {
            if (event.target.tagName.toLowerCase() === 'img') {
                const rect = img.getBoundingClientRect();
                startX = event.clientX;
                startY = event.clientY;
                startWidth = rect.width;
                startHeight = rect.height;
                aspectRatio = startWidth / startHeight;
                currentResizingImage = img;
                document.documentElement.addEventListener('mousemove', resizeImage, false);
                document.documentElement.addEventListener('mouseup', stopResizeImage, false);
            }
        });
    }

    function resizeImage(event) {
        if (currentResizingImage) {
            const width = startWidth + (event.clientX - startX);
            const height = width / aspectRatio;
            currentResizingImage.style.width = width + 'px';
            currentResizingImage.style.height = height + 'px';
        }
    }

    function stopResizeImage(event) {
        document.documentElement.removeEventListener('mousemove', resizeImage, false);
        document.documentElement.removeEventListener('mouseup', stopResizeImage, false);
        currentResizingImage = null;
    }

    // Apply resizable functionality to existing images (if any) on load
    const existingImages = editor.querySelectorAll('img.resizable');
    existingImages.forEach(img => {
        makeImageResizable(img);
    });
});
