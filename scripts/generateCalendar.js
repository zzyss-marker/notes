const CheckInSystem = require('./checkIn');

function generateCalendar() {
    const checkInSystem = new CheckInSystem();
    const stats = checkInSystem.getStats();
    const history = checkInSystem.getHistory();
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 获取当月第一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    // 获取当月最后一天
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const calendar = [];
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 创建打卡记录查找表
    const checkInMap = {};
    history.forEach(record => {
        checkInMap[record.date] = record.status;
    });
    
    // 生成日历头部
    let header = '📅 ' + currentYear + '年' + (currentMonth + 1) + '月打卡日历\n';
    header += '┌────┬────┬────┬────┬────┬────┬────┐\n';
    header += '│ ' + weekDays.join(' │ ') + ' │\n';
    header += '├────┼────┼────┼────┼────┼────┼────┤\n';
    
    // 生成日期
    let currentWeek = [];
    
    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
        currentWeek.push('  ');
    }
    
    // 填充日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const status = checkInMap[date];
        const dayStr = status ? status : day.toString().padStart(2);
        currentWeek.push(dayStr);
        
        if (currentWeek.length === 7) {
            calendar.push(currentWeek);
            currentWeek = [];
        }
    }
    
    // 填充月末空白
    while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push('  ');
    }
    if (currentWeek.length > 0) {
        calendar.push(currentWeek);
    }
    
    // 生成日历主体
    let calendarStr = '';
    for (const week of calendar) {
        calendarStr += '│ ' + week.join(' │ ') + ' │\n';
        if (calendar.indexOf(week) < calendar.length - 1) {
            calendarStr += '├────┼────┼────┼────┼────┼────┼────┤\n';
        }
    }
    calendarStr += '└────┴────┴────┴────┴────┴────┴────┘\n';
    
    // 添加统计信息
    const statsInfo = `
📊 打卡统计
─────────────────────────
📅 总打卡天数: ${stats.totalDays}
🔥 当前连续: ${stats.currentStreak}天
🏆 最长连续: ${stats.longestStreak}天
─────────────────────────

最近打卡记录:
${history.slice(-3).reverse().map(record => 
    `${record.date} ${record.status} ${record.message}`
).join('\n')}
`;

    return header + calendarStr + statsInfo;
}

console.log(generateCalendar()); 