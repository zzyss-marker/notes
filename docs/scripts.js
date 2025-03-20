function generateCalendar() {
    // Use the existing generateCalendar function logic
    const calendarStr = `...`; // Replace with actual calendar generation logic
    document.getElementById('calendar').innerHTML = calendarStr;
}

function checkIn() {
    const status = document.getElementById('status').value;
    const message = document.getElementById('message').value;
    // Implement check-in logic, possibly using localStorage or a backend API
    alert(`Checked in with status: ${status} and message: ${message}`);
}

function loadHistory() {
    // Implement history loading logic, possibly using localStorage or a backend API
    const historyStr = `...`; // Replace with actual history loading logic
    document.getElementById('history').innerHTML = historyStr;
}

function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const task = todoInput.value.trim();
    if (task) {
        let todos = JSON.parse(localStorage.getItem('todos')) || [];
        todos.push(task);
        localStorage.setItem('todos', JSON.stringify(todos));
        todoInput.value = '';
        loadTodos();
    }
}

function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    let todosStr = '';
    todos.forEach((task, index) => {
        todosStr += `<li>${task} <button onclick="removeTodo(${index})">Remove</button></li>`;
    });
    document.getElementById('todos').innerHTML = todosStr;
}

function removeTodo(index) {
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    loadTodos();
}

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    loadHistory();
    loadTodos();
}); 