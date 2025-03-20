const https = require('https');
const cheerio = require('cheerio');
const Parser = require('rss-parser');
const parser = new Parser();

class DailyInfoFetcher {
    async fetchGithubTrending() {
        try {
            const response = await this.httpGet('https://github.com/trending');
            const $ = cheerio.load(response);
            const trends = [];
            
            $('article.Box-row').slice(0, 3).each((i, elem) => {
                const title = $(elem).find('h2 a').text().trim().replace(/\s+/g, ' ');
                const description = $(elem).find('p').text().trim();
                trends.push(`- [${title}](https://github.com/${title}) - ${description}`);
            });
            
            return trends;
        } catch (error) {
            return ['获取 GitHub 趋势失败'];
        }
    }

    async fetchCSDNArticles() {
        try {
            const feed = await parser.parseURL('https://api.dbot.pp.ua/v1/rss/csdn/ai');
            return feed.items.slice(0, 3).map(item => `- [${item.title}](${item.link})`);
        } catch (error) {
            return ['获取 CSDN 文章失败'];
        }
    }

    async fetchSecurityNews() {
        try {
            const feed = await parser.parseURL('https://api.dbot.pp.ua/v1/rss/tencent_cloud');
            return feed.items.slice(0, 3).map(item => `- [${item.title}](${item.link})`);
        } catch (error) {
            return ['获取安全资讯失败'];
        }
    }

    async fetchZhihuDaily() {
        try {
            const feed = await parser.parseURL('https://www.zhihu.com/rss');
            return feed.items.slice(0, 3).map(item => `- [${item.title}](${item.link})`);
        } catch (error) {
            return ['获取知乎每日精选失败'];
        }
    }

    async generateDailyInfo() {
        const [githubTrends, csdnArticles, securityNews, zhihuDaily] = await Promise.all([
            this.fetchGithubTrending(),
            this.fetchCSDNArticles(),
            this.fetchSecurityNews(),
            this.fetchZhihuDaily()
        ]);

        return `
## 📰 今日资讯 (${new Date().toLocaleDateString('zh-CN')})

### 🔥 GitHub 热门项目
${githubTrends.join('\n')}

### 📚 技术文章精选
${csdnArticles.join('\n')}

### 🛡️ 安全资讯
${securityNews.join('\n')}

### 🌟 知乎每日精选
${zhihuDaily.join('\n')}

### 💡 每日一句
${this.getRandomQuote()}
`;
    }

    getRandomQuote() {
        const quotes = [
            "编程是一门艺术，调试是一场修行。",
            "代码写得越急，程序跑得越慢。",
            "今天的努力是明天的铺垫。",
            "没有破解不了的程序，只有不够深入的学习。",
            "安全不是产品，而是过程。",
            "最好的防御就是深入的理解。"
        ];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }

    httpGet(url) {
        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => resolve(data));
            }).on('error', reject);
        });
    }
}

// 直接运行脚本时执行
if (require.main === module) {
    const fetcher = new DailyInfoFetcher();
    fetcher.generateDailyInfo().then(console.log);
}

module.exports = DailyInfoFetcher; 