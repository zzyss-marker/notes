const fs = require('fs');
const path = require('path');

const status = process.argv[2] || '✅'; // 默认为完成
const message = process.argv[3] || ''; // 可选的打卡信息

// 更新打卡状态
// ... 实现打卡逻辑 ...

console.log(`打卡成功！状态：${status} ${message}`); 