@echo off
cls
echo ========================================
echo      KIEM TRA SERVER STATUS
echo ========================================
echo.

REM Kiem tra port 8000
netstat -ano | findstr :8000 | findstr LISTENING >nul
if %errorlevel%==0 (
    echo [OK] Server dang chay!
    echo.
    
    REM Hien thi thong tin tu file
    if exist server-info.txt (
        type server-info.txt
    ) else (
        REM Lay IP neu chua co file
        for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4" ^| findstr /v "169.254"') do (
            set IP=%%a
            goto :show
        )
        :show
        set IP=%IP: =%
        echo IP hien tai: %IP%
        echo Link: http://%IP%:8000/login.html
    )
) else (
    echo [CHUA CHAY] Server chua khoi dong!
    echo.
    echo Ban co muon khoi dong khong? (Y/N)
    choice /c YN /n
    if errorlevel 2 goto :end
    if errorlevel 1 (
        echo.
        echo Dang khoi dong server...
        start "" "C:\BLOCKCHAIN\auto-start-server.vbs"
        timeout /t 5 /nobreak >nul
        echo.
        echo Kiem tra lai...
        netstat -ano | findstr :8000 | findstr LISTENING >nul
        if %errorlevel%==0 (
            echo [OK] Server da khoi dong thanh cong!
            if exist server-info.txt type server-info.txt
        ) else (
            echo [LOI] Khong the khoi dong server!
            echo Hay thu chay thu cong: RUN-WEB.bat
        )
    )
)

:end
echo.
echo ========================================
pause
