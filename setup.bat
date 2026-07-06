@echo off
echo =====================================
echo  Welcome to Evergreen Depot Setup
echo =====================================
echo.

REM Check if Node.js is installed
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please download and install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js detected: 
node -v
echo.

REM Install backend dependencies
echo Installing backend dependencies...
call npm install

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd client
call npm install
cd ..

echo.
echo =====================================
echo  Setup Complete!
echo =====================================
echo.
echo Next steps:
echo.
echo 1. Configure MongoDB:
echo    - Install MongoDB locally OR
echo    - Use MongoDB Atlas (free): https://www.mongodb.com/atlas
echo    - Update .env file with connection string
echo.
echo 2. Configure Cloudinary for images:
echo    - Sign up at: https://cloudinary.com
echo    - Add credentials to .env file
echo.
echo 3. Run the application:
echo    - Backend only: npm run dev
echo    - Full app: npm run dev-all
echo.
echo 4. Access at:
echo    - Website: http://localhost:3000
echo    - API: http://localhost:5000
echo    - Admin: admin@evergreendepot.pk / Admin@123
echo.
echo Happy Gardening! 
echo.
pause
