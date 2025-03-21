function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 获取打卡历史，用于在日历上标记
    const history = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    const checkedDates = history.map(record => record.date);
    
    let calendarStr = '<h2>📅 ' + currentYear + '年' + (currentMonth + 1) + '月</h2>';
    calendarStr += '<table><tr>';
    weekDays.forEach(day => calendarStr += `<th>${day}</th>`);
    calendarStr += '</tr><tr>';
    
    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
        calendarStr += '<td></td>';
    }
    
    // 填充日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate();
        const isChecked = checkedDates.includes(dateStr);
        
        let className = '';
        if (isToday) className += 'today ';
        if (isChecked) className += 'checked ';
        
        calendarStr += `<td class="${className.trim()}">${day}${isChecked ? ' ✓' : ''}</td>`;
        
        if ((day + firstDay.getDay()) % 7 === 0) {
            calendarStr += '</tr><tr>';
        }
    }
    
    // 填充月末空白
    const lastDayOfWeek = new Date(currentYear, currentMonth, lastDay.getDate()).getDay();
    if (lastDayOfWeek < 6) {
        for (let i = lastDayOfWeek + 1; i <= 6; i++) {
            calendarStr += '<td></td>';
        }
    }
    
    calendarStr += '</tr></table>';
    
    // 添加统计信息
    const stats = getStats();
    calendarStr += `<div class="stats">
        <p>📊 本月打卡: ${stats.monthlyDays}天</p>
        <p>🔥 连续打卡: ${stats.currentStreak}天</p>
        <p>🏆 最长连续: ${stats.longestStreak}天</p>
    </div>`;
    
    document.getElementById('calendar').innerHTML = calendarStr;
}

function checkIn() {
    const status = document.getElementById('status').value || '✅';
    const message = document.getElementById('message').value || '今日打卡';
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // 检查今天是否已经打卡
    const history = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    const todayRecord = history.find(record => record.date === today);
    
    if (todayRecord) {
        if (!confirm('今天已经打卡，是否覆盖？')) {
            return;
        }
        // 移除今天的记录
        const index = history.findIndex(record => record.date === today);
        history.splice(index, 1);
    }
    
    const record = {
        date: today,
        status,
        message,
        timestamp: now.toISOString()
    };
    
    history.push(record);
    localStorage.setItem('checkinHistory', JSON.stringify(history));
    
    // 更新统计信息
    updateStats(history);
    
    alert(`已打卡: ${status} - ${message}`);
    document.getElementById('status').value = '';
    document.getElementById('message').value = '';
    
    // 刷新界面
    loadHistory();
    generateCalendar();
    
    // 备份数据
    backupData();
}

function loadHistory() {
    const history = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    
    // 按日期排序，最新的在前面
    history.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let historyStr = '<h2>📝 打卡记录</h2>';
    
    if (history.length === 0) {
        historyStr += '<p>暂无打卡记录</p>';
    } else {
        historyStr += '<ul class="history-list">';
        history.forEach(record => {
            const date = new Date(record.date);
            const formattedDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
            historyStr += `<li>
                <span class="date">${formattedDate}</span>
                <span class="status">${record.status}</span>
                <span class="message">${record.message}</span>
            </li>`;
        });
        historyStr += '</ul>';
    }
    
    document.getElementById('history').innerHTML = historyStr;
}

// 待办事项功能
function loadTodos() {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    const todoList = document.getElementById('todos');
    
    todoList.innerHTML = '';
    
    if (todos.length === 0) {
        todoList.innerHTML = '<li class="empty">暂无待办事项</li>';
        return;
    }
    
    todos.forEach((todo, index) => {
        const li = document.createElement('li');
        li.className = todo.completed ? 'completed' : '';
        
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${index})">
            <span>${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${index})">删除</button>
        `;
        
        todoList.appendChild(li);
    });
}

// 添加待办事项
function addTodo() {
    const todoInput = document.getElementById('todo-input');
    const text = todoInput.value.trim();
    
    if (!text) {
        alert('请输入待办事项内容');
        return;
    }
    
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.push({
        text,
        completed: false,
        createdAt: new Date().toISOString()
    });
    
    localStorage.setItem('todos', JSON.stringify(todos));
    todoInput.value = '';
    
    loadTodos();
    
    // 备份数据
    backupData();
}

// 切换待办事项状态
function toggleTodo(index) {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos[index].completed = !todos[index].completed;
    localStorage.setItem('todos', JSON.stringify(todos));
    
    loadTodos();
    
    // 备份数据
    backupData();
}

// 删除待办事项
function deleteTodo(index) {
    if (!confirm('确定要删除这个待办事项吗？')) {
        return;
    }
    
    const todos = JSON.parse(localStorage.getItem('todos')) || [];
    todos.splice(index, 1);
    localStorage.setItem('todos', JSON.stringify(todos));
    
    loadTodos();
    
    // 备份数据
    backupData();
}

// 获取统计信息
function getStats() {
    const history = JSON.parse(localStorage.getItem('checkinHistory')) || [];
    const now = new Date();
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    // 计算本月打卡天数
    const monthlyDays = history.filter(record => record.date.startsWith(currentMonth)).length;
    
    // 计算连续打卡天数
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    
    // 按日期排序
    const sortedHistory = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    // 计算最长连续天数
    for (let i = 0; i < sortedHistory.length; i++) {
        const currentDate = new Date(sortedHistory[i].date);
        
        if (i === 0) {
            tempStreak = 1;
        } else {
            const prevDate = new Date(sortedHistory[i-1].date);
            const diffDays = Math.round((currentDate - prevDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
                tempStreak++;
            } else {
                tempStreak = 1;
            }
        }
        
        longestStreak = Math.max(longestStreak, tempStreak);
    }
    
    // 计算当前连续天数
    const today = now.toISOString().split('T')[0];
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    const todayChecked = history.some(record => record.date === today);
    const yesterdayChecked = history.some(record => record.date === yesterdayStr);
    
    if (todayChecked) {
        currentStreak = 1;
        let checkDate = yesterday;
        
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const checked = history.some(record => record.date === dateStr);
            
            if (checked) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    } else if (yesterdayChecked) {
        currentStreak = 1;
        let checkDate = new Date(yesterday);
        checkDate.setDate(checkDate.getDate() - 1);
        
        while (true) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const checked = history.some(record => record.date === dateStr);
            
            if (checked) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                break;
            }
        }
    }
    
    return {
        monthlyDays,
        currentStreak,
        longestStreak
    };
}

// 更新统计信息
function updateStats(history) {
    const stats = getStats();
    localStorage.setItem('stats', JSON.stringify(stats));
}

document.addEventListener('DOMContentLoaded', () => {
    generateCalendar();
    loadHistory();
    loadTodos();
    
    // 添加导出按钮
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '导出数据并更新 README';
    exportBtn.className = 'export-btn';
    exportBtn.onclick = backupData;
    
    // 添加到页面
    const checkinForm = document.getElementById('checkin-form');
    checkinForm.appendChild(exportBtn);
}); 