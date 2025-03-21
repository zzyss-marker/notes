const fs = require('fs');
const path = require('path');

// 读取打卡数据
function readCheckInData() {
    try {
        // 尝试从 docs 目录读取数据（如果存在）
        if (fs.existsSync(path.join(__dirname, '../docs/data'))) {
            const historyData = fs.readFileSync(path.join(__dirname, '../docs/data/checkin-history.json'), 'utf8');
            return JSON.parse(historyData);
        }
        
        // 如果 docs/data 不存在，则从 localStorage 备份文件读取
        if (fs.existsSync(path.join(__dirname, '../data/localStorage-backup.json'))) {
            const localStorageData = fs.readFileSync(path.join(__dirname, '../data/localStorage-backup.json'), 'utf8');
            const data = JSON.parse(localStorageData);
            return {
                history: JSON.parse(data.checkinHistory || '[]')
            };
        }
        
        // 如果都不存在，返回空数据
        return { history: [] };
    } catch (error) {
        console.error('读取打卡数据失败:', error);
        return { history: [] };
    }
}

// 生成日历
function generateCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // 获取当月第一天和最后一天
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    
    // 获取打卡历史
    const data = readCheckInData();
    const history = data.history || [];
    const checkedDates = history.map(record => record.date);
    
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
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate();
        const isChecked = checkedDates.includes(dateStr);
        
        let dayStr;
        if (isToday) {
            dayStr = '⭐';
        } else if (isChecked) {
            dayStr = '✅';
        } else {
            dayStr = day.toString().padStart(2);
        }
        
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
    calendarStr += '```\n\n';
    
    // 添加今日状态
    calendarStr += '```\n';
    calendarStr += '📊 今日状态\n';
    calendarStr += '─────────────────────────\n';
    calendarStr += `🌟 今天是${currentYear}年${currentMonth + 1}月${today.getDate()}日\n`;
    
    // 获取今日打卡记录
    const todayStr = today.toISOString().split('T')[0];
    const todayRecord = history.find(record => record.date === todayStr);
    
    if (todayRecord) {
        calendarStr += `${todayRecord.status} ${todayRecord.message}\n`;
    } else {
        calendarStr += '🌈 今天又是元气满满的一天\n';
    }
    
    calendarStr += '─────────────────────────\n';
    calendarStr += '```\n';
    
    return calendarStr;
}

// 计算统计信息
function calculateStats() {
    const data = readCheckInData();
    const history = data.history || [];
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
        longestStreak,
        totalDays: history.length
    };
}

// 生成统计信息
function generateStats() {
    const stats = calculateStats();
    
    return `**本月统计：**
- 打卡天数：${stats.monthlyDays}
- 连续打卡：${stats.currentStreak}天
- 最长连续：${stats.longestStreak}天
- 总打卡天数：${stats.totalDays}天`;
}

// 主函数
async function main() {
    try {
        // 生成日历
        const calendar = generateCalendar();
        fs.writeFileSync(path.join(__dirname, '../temp_calendar.txt'), calendar);
        
        // 生成统计信息
        const stats = generateStats();
        fs.writeFileSync(path.join(__dirname, '../temp_stats.txt'), stats);
        
        console.log('数据同步到 README 的临时文件已生成');
    } catch (error) {
        console.error('生成 README 数据失败:', error);
        process.exit(1);
    }
}

main(); 