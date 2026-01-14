@echo off
echo ========================================
echo   Khoi dong He thong Bau cu Blockchain
echo ========================================
echo.

REM Khoi dong Hardhat Node (Blockchain)
echo [1/3] Khoi dong Hardhat Node...
start "Hardhat Node" cmd /k "cd /d %~dp0 && npx hardhat node"
timeout /t 5

REM Khoi dong Backend
echo [2/3] Khoi dong Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0\backend && npm start"
timeout /t 3

REM Khoi dong Frontend
echo [3/3] Khoi dong Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0\Frontend && npx http-server -p 8000 -a 0.0.0.0"
timeout /t 2

echo.
echo ========================================
echo   TAT CA CAC SERVICE DA DUOC KHOI DONG
echo ========================================
echo.
echo - Blockchain: http://127.0.0.1:8545
echo - Backend:    http://localhost:5000
echo - Frontend:   http://localhost:8000
echo - Frontend (Network): http://172.21.2.180:8000
echo.
echo Tat ca dich vu da khoi dong thanh cong!
echo Ban co the dong cua so nay.
