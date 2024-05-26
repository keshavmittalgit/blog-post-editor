document.addEventListener('DOMContentLoaded', (event) => {
  // Load tasks from backend
  fetch('http://localhost:3001/tasks')
    .then(response => response.json())
    .then(storedTasks => {
      storedTasks.forEach(task => addTaskToDOM(task.text, task.completed, task.id));
    });

  // Load dark mode preference
  const isDarkMode = localStorage.getItem('dark-mode') === 'true';
  toggleDarkMode(isDarkMode); // Update theme based on preference

  // Event listeners for adding tasks
  document.getElementById('add-task-btn').addEventListener('click', addTask);
  document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      addTask();
    }
  });

  // Event listener for toggling dark mode
  document.getElementById('mode-toggle-btn').addEventListener('click', toggleDarkMode);
});

function addTask() {
  const taskText = document.getElementById('new-task').value;
  if (taskText === '') return;

  const newTask = { text: taskText, completed: false };

  // Save task to backend
  fetch('http://localhost:3001/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTask)
  })
  .then(response => response.json())
  .then(task => {
    addTaskToDOM(taskText, false, task.id);
  });

  document.getElementById('new-task').value = '';
}

function addTaskToDOM(taskText, completed, id) {
  const li = document.createElement('li');
  li.textContent = taskText;
  li.dataset.id = id;
  if (completed) {
    li.classList.add('completed');
  }

  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.classList.add('delete-btn');
  deleteBtn.addEventListener('click', function () {
    li.remove();
    removeTaskFromBackend(id);
  });

  li.appendChild(deleteBtn);
  li.addEventListener('click', function () {
    li.classList.toggle('completed');
    toggleTaskCompletionInBackend(id);
  });

  document.getElementById('tasks-list').appendChild(li);
}

function removeTaskFromBackend(id) {
  fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'DELETE'
  });
}

function toggleTaskCompletionInBackend(id) {
  const li = document.querySelector(`li[data-id='${id}']`);
  const completed = li.classList.contains('completed');

  fetch(`http://localhost:3001/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text: li.textContent, completed: !completed })
  });
}

function toggleDarkMode() {
  const body = document.body;
  body.classList.toggle('dark-mode');
  const isDarkMode = body.classList.contains('dark-mode');
  localStorage.setItem('dark-mode', isDarkMode);
}
