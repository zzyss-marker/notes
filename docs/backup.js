// 备份 localStorage 数据到服务器
function backupData() {
    // 获取所有相关的 localStorage 数据
    const data = {
        checkinHistory: localStorage.getItem('checkinHistory'),
        todos: localStorage.getItem('todos'),
        stats: localStorage.getItem('stats')
    };
    
    // 发送到服务器
    fetch('/api/backup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('数据备份成功');
    })
    .catch(error => {
        console.error('数据备份失败:', error);
    });
} 