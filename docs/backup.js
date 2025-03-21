// 备份 localStorage 数据到仓库
function backupData() {
    // 获取所有相关的 localStorage 数据
    const data = {
        checkinHistory: localStorage.getItem('checkinHistory'),
        todos: localStorage.getItem('todos'),
        stats: localStorage.getItem('stats')
    };
    
    // 创建一个下载链接，让用户手动保存数据
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage-backup.json';
    a.click();
    
    // 显示提示信息
    const backupMsg = document.createElement('div');
    backupMsg.className = 'backup-msg';
    backupMsg.innerHTML = `
        <p>请将下载的文件 <strong>localStorage-backup.json</strong> 上传到仓库的 <strong>data</strong> 目录中，以更新 README。</p>
        <p>上传方法：</p>
        <ol>
            <li>打开你的 GitHub 仓库</li>
            <li>进入 data 目录</li>
            <li>点击 "Add file" > "Upload files"</li>
            <li>上传刚才下载的 localStorage-backup.json 文件</li>
            <li>提交更改</li>
        </ol>
        <button onclick="this.parentNode.remove()">关闭</button>
    `;
    document.body.appendChild(backupMsg);
} 