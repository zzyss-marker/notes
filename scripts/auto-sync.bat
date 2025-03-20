@echo off
:loop
echo 🔄 正在同步...
git pull origin main

echo ⏰ 最后更新: %date% %time%

timeout /t 300
goto loop 