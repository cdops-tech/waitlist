# 📋 Valid Values Reference Guide

Quick reference for all validated fields in the DevOps Compass waitlist form.

---

## 🔢 Numeric Fields

### yearsOfExperience
- **Type**: Number (converted from string if needed)
- **Validation**: Must be ≥ 0
- **Examples**: `0`, `3`, `5.5`, `10`, `"7"` (auto-converted)

---

## 📝 Enum Fields

### employmentStatus ✅ Required
```javascript
[
  'Employed',
  'Looking',
  'Freelancing'
]
```

### experienceLevel ✅ Required
```javascript
[
  'Junior (0-2 years)',
  'Mid-level (3-5 years)',
  'Senior (6-8 years)',
  'Lead/Principal (9+ years)',
  'Engineering Manager',
  'Director/VP'
]
```

### roleFocus ✅ Required
```javascript
[
  'DevOps Engineer',
  'Cloud Engineer',
  'SRE',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Security Engineer'
]
```

### location ✅ Required
```javascript
[
  'Metro Manila',
  'Cebu',
  'Davao',
  'Remote - Philippines',
  'Remote - International',
  'Other'
]
```

### currentSalaryRange ✅ Required
```javascript
[
  'Below 50,000',
  '50,000 - 80,000',
  '80,000 - 120,000',
  '120,000 - 160,000',
  '160,000 - 200,000',
  '200,000 - 250,000',
  '250,000 - 300,000',
  'Above 300,000'
]
```

### desiredSalaryRange ⚪ Optional
```javascript
[
  'Below 50,000',
  '50,000 - 80,000',
  '80,000 - 120,000',
  '120,000 - 160,000',
  '160,000 - 200,000',
  '200,000 - 250,000',
  '250,000 - 300,000',
  'Above 300,000'
]
```

---

## 🛠️ Array Fields (Skill Categories)

### cloudPlatforms ⚪ Optional
```javascript
[
  'AWS',
  'Google Cloud Platform (GCP)',
  'Microsoft Azure',
  'Alibaba Cloud',
  'DigitalOcean',
  'Oracle Cloud',
  'IBM Cloud'
]
```
- **Max Items**: 20
- **Min Items**: 0 (but at least 1 total skill required across all categories)

### devopsTools ⚪ Optional
```javascript
[
  'Docker',
  'Kubernetes',
  'Terraform',
  'Ansible',
  'Jenkins',
  'GitLab CI',
  'GitHub Actions',
  'CircleCI',
  'ArgoCD',
  'Helm',
  'Vagrant',
  'Puppet',
  'Chef'
]
```
- **Max Items**: 20

### programmingLanguages ⚪ Optional
```javascript
[
  'Python',
  'JavaScript',
  'Go',
  'Java',
  'Ruby',
  'Bash/Shell',
  'PowerShell',
  'TypeScript',
  'C#',
  'PHP',
  'Rust'
]
```
- **Max Items**: 20

### monitoringTools ⚪ Optional
```javascript
[
  'Prometheus',
  'Grafana',
  'Datadog',
  'New Relic',
  'ELK Stack',
  'Splunk',
  'Nagios',
  'Zabbix',
  'CloudWatch',
  'PagerDuty'
]
```
- **Max Items**: 20

### databases ⚪ Optional
```javascript
[
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'Elasticsearch',
  'DynamoDB',
  'Cassandra',
  'Microsoft SQL Server',
  'Oracle Database',
  'MariaDB'
]
```
- **Max Items**: 20

**⚠️ Important**: At least ONE skill must be selected across all categories

---

## 📧 String Fields

### email ✅ Required
- **Format**: Valid email address (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- **Transformed**: Lowercase, trimmed
- **Duplicate Check**: Yes (must be unique)
- **Examples**: 
  - ✅ `user@example.com`
  - ✅ `john.doe@company.co.ph`
  - ❌ `invalid-email`
  - ❌ `@example.com`

### preferredName ⚪ Optional
- **Max Length**: 100 characters
- **Transformed**: Trimmed, or null if empty
- **Examples**:
  - ✅ `Juan`
  - ✅ `Maria Santos`
  - ✅ `null` (optional)
  - ❌ `"A".repeat(101)` (too long)

### linkedinProfile ⚪ Optional
- **Max Length**: 200 characters
- **Format**: Must match `/^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/`
- **Transformed**: Trimmed, or null if empty
- **Examples**:
  - ✅ `https://linkedin.com/in/username`
  - ✅ `https://www.linkedin.com/in/user-name`
  - ✅ `https://linkedin.com/in/username/`
  - ✅ `null` (optional)
  - ❌ `linkedin.com/in/username` (missing protocol)
  - ❌ `https://facebook.com/profile` (wrong domain)
  - ❌ `https://linkedin.com/company/name` (not /in/ path)

---

## 📋 Complete Example - Valid Submission

```json
{
  "email": "juan.delacruz@example.com",
  "preferredName": "Juan",
  "linkedinProfile": "https://linkedin.com/in/juandelacruz",
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
}
```

---

## ❌ Common Validation Errors

### Error: "Invalid experience level"
**Problem**: Frontend sent value not in whitelist  
**Solution**: Use exact values from `VALID_EXPERIENCE_LEVELS` array  
**Example Fix**: `"Mid level"` → `"Mid-level (3-5 years)"`

### Error: "Invalid cloud platforms: INVALID_CLOUD"
**Problem**: Array contains value not in whitelist  
**Solution**: Use exact values from `VALID_CLOUD_PLATFORMS` array  
**Example Fix**: `"Amazon AWS"` → `"AWS"`

### Error: "Preferred name is too long"
**Problem**: String exceeds 100 characters  
**Solution**: Limit input to 100 chars on frontend  

### Error: "Invalid LinkedIn URL format"
**Problem**: URL doesn't match pattern  
**Solution**: Must be `https://linkedin.com/in/username` format  
**Example Fix**: 
- `"linkedin.com/in/user"` → `"https://linkedin.com/in/user"`
- `"linkedin.com/company/name"` → (Not supported, must be profile URL)

### Error: "At least one skill must be selected"
**Problem**: All skill arrays are empty  
**Solution**: Select at least one item from any skill category  

### Error: "Years of experience must be a valid positive number"
**Problem**: Invalid number or negative value  
**Solution**: Send positive number or numeric string  
**Example Fix**: `"-1"` → `"0"`, `"abc"` → `"5"`

---

## 🔧 Testing Individual Fields

Use these curl commands to test specific validations:

```bash
# Test invalid enum
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "yearsOfExperience": 5,
    "employmentStatus": "INVALID",
    "cloudPlatforms": ["AWS"],
    "experienceLevel": "Mid-level (3-5 years)",
    "roleFocus": "DevOps Engineer",
    "location": "Metro Manila",
    "currentSalaryRange": "120,000 - 160,000"
  }'

# Test invalid array value
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test2@example.com",
    "yearsOfExperience": 5,
    "employmentStatus": "Employed",
    "cloudPlatforms": ["FAKE_CLOUD"],
    "experienceLevel": "Mid-level (3-5 years)",
    "roleFocus": "DevOps Engineer",
    "location": "Metro Manila",
    "currentSalaryRange": "120,000 - 160,000"
  }'

# Test string length
curl -X POST http://localhost:5000/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test3@example.com",
    "preferredName": "'$(printf 'A%.0s' {1..101})'",
    "yearsOfExperience": 5,
    "employmentStatus": "Employed",
    "cloudPlatforms": ["AWS"],
    "experienceLevel": "Mid-level (3-5 years)",
    "roleFocus": "DevOps Engineer",
    "location": "Metro Manila",
    "currentSalaryRange": "120,000 - 160,000"
  }'
```

---

## 📊 Validation Rules Summary

| Field | Type | Required | Validation | Max Length | Whitelist |
|-------|------|----------|------------|------------|-----------|
| email | String | ✅ | Regex + Unique | - | - |
| preferredName | String | ⚪ | Length | 100 | - |
| linkedinProfile | String | ⚪ | URL Pattern + Length | 200 | - |
| yearsOfExperience | Number | ✅ | ≥ 0 | - | - |
| employmentStatus | String | ✅ | Enum | - | ✅ 3 values |
| cloudPlatforms | Array | ⚪ | Content + Length | 20 items | ✅ 7 values |
| devopsTools | Array | ⚪ | Content + Length | 20 items | ✅ 13 values |
| programmingLanguages | Array | ⚪ | Content + Length | 20 items | ✅ 11 values |
| monitoringTools | Array | ⚪ | Content + Length | 20 items | ✅ 10 values |
| databases | Array | ⚪ | Content + Length | 20 items | ✅ 10 values |
| experienceLevel | String | ✅ | Enum | - | ✅ 6 values |
| roleFocus | String | ✅ | Enum | - | ✅ 6 values |
| location | String | ✅ | Enum | - | ✅ 6 values |
| currentSalaryRange | String | ✅ | Enum | - | ✅ 8 values |
| desiredSalaryRange | String | ⚪ | Enum | - | ✅ 8 values |

**Legend**: ✅ Required | ⚪ Optional

---

## 🎯 Frontend Integration Checklist

When building/updating the frontend form:

- [ ] Match all enum values exactly (case-sensitive)
- [ ] Enforce 100-char limit on preferredName input
- [ ] Validate LinkedIn URL format client-side
- [ ] Limit arrays to 20 items each
- [ ] Require at least one skill selection
- [ ] Convert yearsOfExperience to number before sending
- [ ] Display server validation errors clearly
- [ ] Prevent duplicate submissions (disable button after submit)
- [ ] Handle 409 (duplicate email) error gracefully
- [ ] Handle 429 (rate limit) error with retry message

---

**Last Updated**: October 3, 2025  
**Version**: 1.0  
**Maintained By**: DevOps Compass Team
