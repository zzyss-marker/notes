function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 生成日历头部
    let calendarStr = '```\n'; // 开始代码块
    calendarStr += '📅 ' + currentYear + '年' + (currentMonth + 1) + '月\n';
    calendarStr += '┌────┬────┬────┬────┬────┬────┬────┐\n';
    calendarStr += '│ ' + weekDays.join(' │ ') + ' │\n';
    calendarStr += '├────┼────┼────┼────┼────┼────┼────┤\n';
    
    // 生成日期
    let currentWeek = [];
    
    // 填充月初空白
    for (let i = 0; i < firstDay.getDay(); i++) {
        currentWeek.push('  ');
    }
    
    // 填充日期
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const isToday = day === today.getDate();
        const dayStr = isToday ? '⭐' : day.toString().padStart(2);
        currentWeek.push(dayStr);
        
        if (currentWeek.length === 7) {
            calendarStr += '│ ' + currentWeek.join(' │ ') + ' │\n';
            if (day < lastDay.getDate()) {
                calendarStr += '├────┼────┼────┼────┼────┼────┼────┤\n';
            }
            currentWeek = [];
        }
    }
    
    // 填充月末空白
    while (currentWeek.length < 7 && currentWeek.length > 0) {
        currentWeek.push('  ');
    }
    if (currentWeek.length > 0) {
        calendarStr += '│ ' + currentWeek.join(' │ ') + ' │\n';
    }
    
    calendarStr += '└────┴────┴────┴────┴────┴────┴────┘\n';
    calendarStr += '```\n\n'; // 结束代码块
    
    // 添加状态信息
    calendarStr += '```\n'; // 开始新代码块
    calendarStr += '📊 今日状态\n';
    calendarStr += '─────────────────────────\n';
    calendarStr += `🌟 今天是${currentYear}年${currentMonth + 1}月${today.getDate()}日\n`;
    calendarStr += '🌈 今天又是元气满满的一天\n';
    calendarStr += '─────────────────────────\n';
    calendarStr += '```\n';

    return calendarStr;
}

console.log(generateCalendar()); 