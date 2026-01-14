@echo off
REM Auto-start server khi mo may tinh

cd /d C:\BLOCKCHAIN\contracts\Frontend

REM Doi 10 giay de may tinh khoi dong xong va ket noi mang
timeout /t 10 /nobreak >nul

REM Lay IP
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "169.254"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP: =%

REM Kill process cu neu co
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :8000 ^| findstr LISTENING') do (
    taskkill /PID %%p /F >nul 2>&1
)

REM Chay server (khong mo cua so moi)
start /B npx http-server -p 8000 >nul 2>&1

REM Doi server khoi dong
timeout /t 3 /nobreak >nul

REM Tao file thong bao IP
echo ================================ > server-info.txt
echo   WEB SERVER AUTO-STARTED >> server-info.txt
echo ================================ >> server-info.txt
echo. >> server-info.txt
echo IP hien tai: %IP% >> server-info.txt
echo. >> server-info.txt
echo [LOCAL] >> server-info.txt
echo http://localhost:8000/login.html >> server-info.txt
echo. >> server-info.txt
echo [DIEN THOAI - Cung Wifi] >> server-info.txt
echo http://%IP%:8000/login.html >> server-info.txt
echo. >> server-info.txt
echo Server started at: %date% %time% >> server-info.txt
echo ================================ >> server-info.txt

REM Mo file thong bao (optional)
REM notepad server-info.txt

exit
