document.getElementById('add-task-btn').addEventListener('click', addTask);
document.getElementById('new-task').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

function addTask() {
    const taskText = document.getElementById('new-task').value;
    if (taskText === '') return;

    const li = document.createElement('li');
    li.textContent = taskText;

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Delete';
    deleteBtn.classList.add('delete-btn');
    deleteBtn.addEventListener('click', function () {
        li.remove();
    });

    li.appendChild(deleteBtn);
    document.getElementById('tasks-list').appendChild(li);

    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    document.getElementById('new-task').value = '';
}