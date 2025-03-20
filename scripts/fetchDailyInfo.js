const https = require('https');
const cheerio = require('cheerio');

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

    async fetchJuejinPosts() {
        try {
            const response = await this.httpGet('https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed');
            const articles = JSON.parse(response).data.slice(0, 3);
            return articles.map(article => 
                `- [${article.article_info.title}](https://juejin.cn/post/${article.article_info.article_id})`
            );
        } catch (error) {
            return ['获取掘金文章失败'];
        }
    }

    async fetchSecurityNews() {
        try {
            const response = await this.httpGet('https://www.freebuf.com/');
            const $ = cheerio.load(response);
            const news = [];
            
            $('.article-item').slice(0, 3).each((i, elem) => {
                const title = $(elem).find('.title').text().trim();
                const link = $(elem).find('a').attr('href');
                news.push(`- [${title}](${link})`);
            });
            
            return news;
        } catch (error) {
            return ['获取安全资讯失败'];
        }
    }

    async generateDailyInfo() {
        const [githubTrends, juejinPosts, securityNews] = await Promise.all([
            this.fetchGithubTrending(),
            this.fetchJuejinPosts(),
            this.fetchSecurityNews()
        ]);

        return `
## 📰 今日资讯 (${new Date().toLocaleDateString('zh-CN')})

### 🔥 GitHub 热门项目
${githubTrends.join('\n')}

### 📚 技术文章精选
${juejinPosts.join('\n')}

### 🛡️ 安全资讯
${securityNews.join('\n')}

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