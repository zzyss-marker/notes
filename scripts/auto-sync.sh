#!/bin/bash

while true; do
    echo "🔄 正在同步..."
    git pull origin main
    
    # 打印最后更新时间
    echo "⏰ 最后更新: $(date '+%Y-%m-%d %H:%M:%S')"
    
    # 等待5分钟
    sleep 300
done 