const fs = require('fs');
const path = require('path');

function generateCheckinStats() {
    const historyPath = path.join(__dirname, '../data/checkin-history.json');
    const data = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
    const stats = data.stats;

    return `
- 总打卡天数: ${stats.totalDays}
- 当前连续天数: ${stats.currentStreak}
- 最长连续天数: ${stats.longestStreak}
`;
}

if (require.main === module) {
    console.log(generateCheckinStats());
}

module.exports = generateCheckinStats; 