#!/bin/bash

echo "🌿 Welcome to Evergreen Depot Market Setup 🌿"
echo "==========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed!${NC}"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}✓ Node.js detected: $(node -v)${NC}"

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo -e "${YELLOW}⚠ MongoDB not detected locally${NC}"
    echo "You can use MongoDB Atlas (cloud) instead"
    echo "Sign up at: https://www.mongodb.com/atlas"
    echo ""
fi

# Install backend dependencies
echo -e "${YELLOW}Installing backend dependencies...${NC}"
npm install

# Install frontend dependencies
echo -e "${YELLOW}Installing frontend dependencies...${NC}"
cd client
npm install
cd ..

echo ""
echo -e "${GREEN}✅ Dependencies installed successfully!${NC}"
echo ""

# Setup environment variables
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cp .env.example .env 2>/dev/null || cat > .env << 'EOL'
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/evergreen-depot

# JWT Secret
JWT_SECRET=change_this_secret_key_$(openssl rand -hex 32)

# Server Port
PORT=5000

# Environment
NODE_ENV=development

# Cloudinary Configuration (for image storage)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Credentials (first admin)
ADMIN_EMAIL=admin@evergreendepot.pk
ADMIN_PASSWORD=Admin@123

# Currency
CURRENCY=PKR
CURRENCY_SYMBOL=Rs.
EOL
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${GREEN}✓ .env file already exists${NC}"
fi

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 Setup Complete! 🎉${NC}"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "1. Configure your database:"
echo "   - Edit .env file with your MongoDB connection string"
echo "   - For cloud database: https://www.mongodb.com/atlas"
echo ""
echo "2. Configure Cloudinary (for images):"
echo "   - Sign up at: https://cloudinary.com"
echo "   - Add credentials to .env file"
echo ""
echo "3. Run the application:"
echo -e "   ${GREEN}npm run dev${NC} (backend only)"
echo -e "   ${GREEN}npm run dev-all${NC} (backend + frontend)"
echo ""
echo "4. Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:5000"
echo "   - Admin: admin@evergreendepot.pk / Admin@123"
echo ""
echo -e "${YELLOW}📖 Full documentation in README.md${NC}"
echo ""
echo "Happy Gardening! 🌱"
