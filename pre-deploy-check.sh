#!/bin/bash

# DevOps Compass Waitlist - Pre-Deployment Check Script
# Run this before deploying to production

echo "🔍 Running pre-deployment checks..."
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# Check 1: Dependencies installed
echo "📦 Checking dependencies..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Dependencies not installed. Run: npm install${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check 2: Environment variables
echo "🔐 Checking environment variables..."
if [ -f ".env" ]; then
    if grep -q "FIREBASE_PROJECT_ID=" .env && grep -q "FIREBASE_PRIVATE_KEY=" .env; then
        echo -e "${GREEN}✅ Environment variables configured${NC}"
    else
        echo -e "${RED}❌ Firebase credentials incomplete in .env${NC}"
        ERRORS=$((ERRORS+1))
    fi
else
    echo -e "${RED}❌ .env file not found${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check 3: Build test
echo "🏗️  Testing production build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build successful${NC}"
    rm -rf dist
else
    echo -e "${RED}❌ Build failed${NC}"
    ERRORS=$((ERRORS+1))
fi

# Check 4: Server starts
echo "🚀 Checking if server starts..."
timeout 5 npm run dev:backend > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Server starts successfully${NC}"
    kill $SERVER_PID 2>/dev/null
else
    echo -e "${YELLOW}⚠️  Could not verify server startup (may already be running)${NC}"
    WARNINGS=$((WARNINGS+1))
    kill $SERVER_PID 2>/dev/null
fi

# Check 5: Git status
echo "📝 Checking git status..."
if [ -d ".git" ]; then
    if git diff-index --quiet HEAD --; then
        echo -e "${GREEN}✅ No uncommitted changes${NC}"
    else
        echo -e "${YELLOW}⚠️  You have uncommitted changes${NC}"
        WARNINGS=$((WARNINGS+1))
    fi
else
    echo -e "${YELLOW}⚠️  Not a git repository${NC}"
    WARNINGS=$((WARNINGS+1))
fi

# Check 6: Required files
echo "📄 Checking required files..."
REQUIRED_FILES=("package.json" "vite.config.js" "tailwind.config.js" "server/index.js" "src/App.jsx")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        echo -e "${RED}❌ Missing required file: $file${NC}"
        ERRORS=$((ERRORS+1))
    fi
done
echo -e "${GREEN}✅ All required files present${NC}"

# Summary
echo ""
echo "================================"
echo "📊 Pre-Deployment Check Summary"
echo "================================"
if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Ready to deploy.${NC}"
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  $WARNINGS warning(s) found. Review before deploying.${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) and $WARNINGS warning(s) found.${NC}"
    echo -e "${RED}Fix errors before deploying.${NC}"
    exit 1
fi
