// This function runs when the document content is fully loaded.
document.addEventListener('DOMContentLoaded', (event) => {
    // Load tasks from local storage
    const storedTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    storedTasks.forEach(task => addTaskToDOM(task.text, task.completed));
  
    // Event listeners for adding tasks
    document.getElementById('add-task-btn').addEventListener('click', addTask);
    document.getElementById('new-task').addEventListener('keypress', function (e) {
      if (e.key === 'Enter') {
        addTask();
      }
    });
  });
  
  // Function to add a new task
  function addTask() {
    const taskText = document.getElementById('new-task').value;
    if (taskText === '') return;
  
    addTaskToDOM(taskText, false);
    saveTaskToLocalStorage(taskText, false);
    document.getElementById('new-task').value = '';
  }
  
  // Function to add a task to the DOM
  function addTaskToDOM(taskText, completed) {
    const li = document.createElement('li');
    li.textContent = taskText;
    if (completed) {
      li.classList.add('completed');
    }
  
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
      li.remove();
      removeTaskFromLocalStorage(taskText);
    });
  
    li.appendChild(deleteBtn);
    li.addEventListener('click', function () {
      li.classList.toggle('completed');
      toggleTaskCompletionInLocalStorage(taskText);
    });
  
    document.getElementById('tasks-list').appendChild(li);
  }
  
  // Function to save a task to local storage
  function saveTaskToLocalStorage(taskText, completed) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed: completed });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Function to remove a task from local storage
  function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText);
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
  
  // Function to toggle task completion in local storage
  function toggleTaskCompletionInLocalStorage(taskText) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const taskIndex = tasks.findIndex(task => task.text === taskText);
    if (taskIndex !== -1) {
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }
  