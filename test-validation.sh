#!/bin/bash

# Validation Testing Script
# Tests all the new validation rules implemented

API_URL="http://localhost:5000/api/waitlist"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Starting Comprehensive Validation Tests${NC}"
echo "=========================================="
echo ""

# Counter for results
PASSED=0
FAILED=0

# Helper function to test API
test_api() {
  local test_name=$1
  local expected_status=$2
  local data=$3
  
  echo -e "${YELLOW}Testing: ${test_name}${NC}"
  
  response=$(curl -s -w "\n%{http_code}" -X POST "$API_URL" \
    -H "Content-Type: application/json" \
    -d "$data")
  
  http_code=$(echo "$response" | tail -n1)
  body=$(echo "$response" | head -n-1)
  
  if [ "$http_code" -eq "$expected_status" ]; then
    echo -e "${GREEN}✅ PASS${NC} - Status: $http_code"
    PASSED=$((PASSED + 1))
  else
    echo -e "${RED}❌ FAIL${NC} - Expected: $expected_status, Got: $http_code"
    FAILED=$((FAILED + 1))
  fi
  
  echo "Response: $body"
  echo ""
  sleep 0.5 # Small delay between requests
}

echo -e "${YELLOW}=== TEST 1: Invalid Experience Level (Enum) ===${NC}"
test_api "Invalid Experience Level" 400 '{
  "email": "test1@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "INVALID_LEVEL",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 2: Invalid Role Focus (Enum) ===${NC}"
test_api "Invalid Role Focus" 400 '{
  "email": "test2@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "INVALID_ROLE",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 3: Invalid Location (Enum) ===${NC}"
test_api "Invalid Location" 400 '{
  "email": "test3@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "INVALID_LOCATION",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 4: Invalid Salary Range (Enum) ===${NC}"
test_api "Invalid Salary Range" 400 '{
  "email": "test4@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "INVALID_RANGE"
}'

echo -e "${YELLOW}=== TEST 5: Invalid Cloud Platform in Array ===${NC}"
test_api "Invalid Cloud Platform" 400 '{
  "email": "test5@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["INVALID_CLOUD", "AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 6: Invalid DevOps Tool in Array ===${NC}"
test_api "Invalid DevOps Tool" 400 '{
  "email": "test6@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "devopsTools": ["INVALID_TOOL"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 7: Too Long Preferred Name ===${NC}"
test_api "String Length Limit" 400 '{
  "email": "test7@example.com",
  "preferredName": "'"$(printf 'A%.0s' {1..101})"'",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 8: Invalid LinkedIn URL Format ===${NC}"
test_api "Invalid LinkedIn URL" 400 '{
  "email": "test8@example.com",
  "linkedinProfile": "not-a-linkedin-url",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 9: Invalid LinkedIn URL (Wrong Domain) ===${NC}"
test_api "Wrong LinkedIn Domain" 400 '{
  "email": "test9@example.com",
  "linkedinProfile": "https://facebook.com/profile",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo -e "${YELLOW}=== TEST 10: Years of Experience as String (Should Convert) ===${NC}"
test_api "String to Number Conversion" 201 '{
  "email": "test-conversion-'$(date +%s)'@example.com",
  "yearsOfExperience": "7",
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS"],
  "experienceLevel": "Senior (6-8 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "160,000 - 200,000"
}'

echo -e "${YELLOW}=== TEST 11: Valid Submission with All Fields ===${NC}"
test_api "Complete Valid Submission" 201 '{
  "email": "test-valid-'$(date +%s)'@example.com",
  "preferredName": "Test User",
  "linkedinProfile": "https://linkedin.com/in/testuser",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["AWS", "Google Cloud Platform (GCP)"],
  "devopsTools": ["Docker", "Kubernetes", "Terraform"],
  "programmingLanguages": ["Python", "Go"],
  "monitoringTools": ["Prometheus", "Grafana"],
  "databases": ["PostgreSQL", "Redis"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000",
  "desiredSalaryRange": "160,000 - 200,000"
}'

echo -e "${YELLOW}=== TEST 12: Valid LinkedIn URL with www ===${NC}"
test_api "LinkedIn URL with www" 201 '{
  "email": "test-linkedin-www-'$(date +%s)'@example.com",
  "linkedinProfile": "https://www.linkedin.com/in/testuser",
  "yearsOfExperience": 3,
  "employmentStatus": "Looking",
  "cloudPlatforms": ["Microsoft Azure"],
  "experienceLevel": "Junior (0-2 years)",
  "roleFocus": "Cloud Engineer",
  "location": "Cebu",
  "currentSalaryRange": "80,000 - 120,000"
}'

echo -e "${YELLOW}=== TEST 13: Array with Empty String (Should Fail) ===${NC}"
test_api "Empty String in Array" 400 '{
  "email": "test-empty-string@example.com",
  "yearsOfExperience": 5,
  "employmentStatus": "Employed",
  "cloudPlatforms": ["", "AWS"],
  "experienceLevel": "Mid-level (3-5 years)",
  "roleFocus": "DevOps Engineer",
  "location": "Metro Manila",
  "currentSalaryRange": "120,000 - 160,000"
}'

echo ""
echo "=========================================="
echo -e "${YELLOW}📊 Test Summary${NC}"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✅ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
  exit 1
fi
