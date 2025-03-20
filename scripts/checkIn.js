const fs = require('fs');
const path = require('path');

class CheckInSystem {
    constructor() {
        this.historyPath = path.join(__dirname, '../data/checkin-history.json');
        this.data = this.loadHistory();
    }

    loadHistory() {
        try {
            return JSON.parse(fs.readFileSync(this.historyPath, 'utf8'));
        } catch (error) {
            return {
                history: [],
                stats: {
                    totalDays: 0,
                    currentStreak: 0,
                    longestStreak: 0,
                    lastCheckIn: null
                },
                monthlyStats: {}
            };
        }
    }

    saveHistory() {
        fs.writeFileSync(this.historyPath, JSON.stringify(this.data, null, 2));
    }

    checkIn(status = '✅', message = '') {
        const now = new Date();
        const today = now.toISOString().split('T')[0];
        const month = now.toISOString().slice(0, 7); // YYYY-MM

        // 添加打卡记录
        const record = {
            date: today,
            status,
            message,
            timestamp: now.toISOString()
        };

        // 更新历史记录
        this.data.history.push(record);

        // 更新月度统计
        if (!this.data.monthlyStats[month]) {
            this.data.monthlyStats[month] = {
                totalDays: 0,
                completedTasks: 0,
                studyHours: 0
            };
        }

        // 更新连续打卡统计
        const lastDate = this.data.stats.lastCheckIn ? 
            new Date(this.data.stats.lastCheckIn) : null;
        
        if (lastDate) {
            const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) {
                this.data.stats.currentStreak++;
            } else {
                this.data.stats.currentStreak = 1;
            }
        } else {
            this.data.stats.currentStreak = 1;
        }

        // 更新最长连续打卡记录
        this.data.stats.longestStreak = Math.max(
            this.data.stats.longestStreak,
            this.data.stats.currentStreak
        );

        // 更新总统计
        this.data.stats.totalDays++;
        this.data.stats.lastCheckIn = today;
        this.data.monthlyStats[month].totalDays++;

        this.saveHistory();
        return this.getStats();
    }

    getStats(month = null) {
        if (month) {
            return this.data.monthlyStats[month] || {
                totalDays: 0,
                completedTasks: 0,
                studyHours: 0
            };
        }
        return this.data.stats;
    }

    // 获取历史记录
    getHistory(startDate = null, endDate = null) {
        let history = this.data.history;
        if (startDate) {
            history = history.filter(record => record.date >= startDate);
        }
        if (endDate) {
            history = history.filter(record => record.date <= endDate);
        }
        return history;
    }
}

// 命令行接口
if (require.main === module) {
    const status = process.argv[2] || '✅';
    const message = process.argv[3] || '';
    
    const checkInSystem = new CheckInSystem();
    const stats = checkInSystem.checkIn(status, message);
    
    console.log('打卡成功！');
    console.log('当前统计：');
    console.log(`- 总打卡天数: ${stats.totalDays}`);
    console.log(`- 当前连续天数: ${stats.currentStreak}`);
    console.log(`- 最长连续天数: ${stats.longestStreak}`);
}

module.exports = CheckInSystem; 