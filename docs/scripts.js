function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    let calendarStr = '<table><tr>';
    weekDays.forEach(day => calendarStr += `<th>${day}</th>`);
    calendarStr += '</tr><tr>';
    
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarStr += '<td></td>';
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = day === today.getDate();
        calendarStr += `<td${isToday ? ' class="today"' : ''}>${day}</td>`;
        
        if ((day + firstDay.getDay()) % 7 === 0) {
            calendarStr += '</tr><tr>';
        }
    }
    
    calendarStr += '</tr></table>';
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