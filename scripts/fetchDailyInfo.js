const https = require('https');
const cheerio = require('cheerio');

// 简单的测试函数
async function testFetch() {
    try {
        console.log('开始测试抓取...');
        
        // 测试 HTTP 请求
        const response = await new Promise((resolve, reject) => {
            https.get('https://github.com/trending', (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
        
        console.log('成功获取 GitHub 页面，长度:', response.length);
        
        // 测试 cheerio
        const $ = cheerio.load(response);
        const title = $('title').text();
        console.log('页面标题:', title);
        
        return '测试成功!';
    } catch (error) {
        console.error('测试失败:', error);
        return '测试失败: ' + error.message;
    }
}

// 直接运行脚本时执行
if (require.main === module) {
    console.log('开始运行测试...');
    testFetch().then(console.log);
}

module.exports = { testFetch }; 