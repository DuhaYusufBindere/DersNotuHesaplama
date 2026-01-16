@echo off
echo Universite Not Hesaplayici Baslatiliyor...
echo Lutfen bekleyin...

:: Check if Node is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js bulunamadi! Lutfen Node.js yukleyin.
    pause
    exit
)

:: Install Server Deps
if not exist "server\node_modules" (
    echo Server kutuphaneleri yukleniyor...
    cd server
    call npm install
    cd ..
)

:: Install Client Deps
if not exist "client\node_modules" (
    echo Client kutuphaneleri yukleniyor...
    cd client
    call npm install
    cd ..
)

:: Build Frontend
if not exist "client\dist" (
    echo Uygulama derleniyor (bu islem bir kez yapilir)...
    cd client
    call npm run build
    cd ..
)

:: Start Server
echo Uygulama hazir. Tarayiciniz acilacak...
start http://localhost:3000
cd server
node index.js
pause
