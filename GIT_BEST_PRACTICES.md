# 🔒 Git & Security Best Practices

## ⚠️ CRITICAL: Never Commit Sensitive Files!

### 🚨 Files That Should NEVER Be Committed:

1. **`.env`** - Contains all your secrets!
   - Firebase credentials
   - API keys
   - Database passwords
   - Production URLs

2. **`firebase-adminsdk-*.json`** - Firebase service account keys
3. **`serviceAccountKey.json`** - Any service account files
4. **`node_modules/`** - Dependencies (too large, can be reinstalled)

---

## ✅ What's Protected by .gitignore

Your `.gitignore` file currently protects:

```
✅ .env (all variations)
✅ node_modules/
✅ dist/ and build/ folders
✅ Firebase credential files
✅ Log files
✅ Editor config files (.vscode/, .idea/)
✅ OS files (.DS_Store, Thumbs.db)
✅ Test coverage reports
✅ Cache directories
```

---

## 🔍 How to Verify Files Are Ignored

### Check if a file is ignored:
```bash
git check-ignore -v .env
# Output: .gitignore:13:.env    .env
# ✅ This means .env IS ignored
```

### See all ignored files:
```bash
git status --ignored
```

### Check what would be committed:
```bash
git status
# Should NOT see .env or node_modules/
```

---

## ⚠️ What If You Already Committed Sensitive Files?

### If .env was accidentally committed:

**1. Remove from git tracking (keeps local file)**:
```bash
git rm --cached .env
git commit -m "Remove .env from tracking"
git push
```

**2. Remove from entire git history** (if sensitive data exposed):
```bash
# WARNING: This rewrites history!
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all
```

**3. CRITICAL: Rotate all credentials immediately!**
- Generate new Firebase service account
- Update all API keys
- Change all passwords
- Update .env with new credentials

---

## 📋 Before Every Commit Checklist

- [ ] Run `git status` - Check what's being committed
- [ ] Verify `.env` is NOT in the list
- [ ] Verify `node_modules/` is NOT in the list
- [ ] Check for any `*-firebase-adminsdk-*.json` files
- [ ] Review changed files are intentional
- [ ] No API keys or passwords in code

---

## 🔐 Safe Commit Workflow

### 1. Check Status
```bash
git status
```

### 2. Review Changes
```bash
git diff
```

### 3. Add Files (be specific!)
```bash
# ✅ Good - Add specific files
git add src/components/WaitlistForm.jsx
git add server/index.js

# ❌ Avoid - Adds everything (risky!)
git add .
git add -A
```

### 4. Commit with Clear Message
```bash
git commit -m "Add frontend validation for input fields"
```

### 5. Push to Remote
```bash
git push origin main
```

---

## 📊 Current Repository Status

### Files Staged for Commit:
```bash
git status --short
```

Look for:
- `A` = New file added
- `M` = Modified file
- `D` = Deleted file
- `??` = Untracked file

### Verify Ignored Files Are Working:
```bash
# This should show .env is ignored
git check-ignore -v .env

# This should show nothing (no output = not ignored!)
git check-ignore -v src/App.jsx
```

---

## 🛡️ Additional Security Measures

### 1. GitHub Secret Scanning
- GitHub automatically scans for exposed secrets
- You'll get alerts if credentials are detected
- Act immediately if you receive an alert!

### 2. Pre-commit Hooks (Optional)
Install a pre-commit hook to check for secrets:

```bash
# Install git-secrets
brew install git-secrets  # macOS
# or
sudo apt-get install git-secrets  # Linux

# Add patterns to block
git secrets --add '.env'
git secrets --add 'serviceAccountKey.json'
git secrets --add --allowed 'EXAMPLE'
git secrets --add --allowed 'your-.*-here'

# Install hook
git secrets --install
```

### 3. Environment Variable Best Practices
```javascript
// ✅ Good - Use environment variables
const apiKey = process.env.API_KEY;

// ❌ Bad - Hardcoded secrets
const apiKey = "AIzaSyD1234567890abcdefg";

// ❌ Bad - Secrets in comments
// API Key: AIzaSyD1234567890abcdefg
```

---

## 📝 .env.example vs .env

### `.env.example` (✅ CAN be committed)
```bash
# Example environment variables
NODE_ENV=development
PORT=5000
FIREBASE_PROJECT_ID=your-project-id-here
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Here\n-----END PRIVATE KEY-----"
# ... etc
```

### `.env` (❌ NEVER commit)
```bash
# Actual environment variables with REAL values
NODE_ENV=production
PORT=5000
FIREBASE_PROJECT_ID=devops-compass-f087f
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nActualRealKeyHere123\n-----END PRIVATE KEY-----"
# ... actual sensitive data
```

---

## 🚀 Deployment: Environment Variables

### Never use .env in production!

Instead, use your hosting platform's environment variable system:

**Heroku**:
```bash
heroku config:set NODE_ENV=production
heroku config:set FIREBASE_PROJECT_ID=your-id
```

**Vercel**:
- Dashboard → Project → Settings → Environment Variables

**Railway**:
- Dashboard → Project → Variables

**Netlify**:
- Site Settings → Build & Deploy → Environment Variables

---

## 🔄 Repository Hygiene

### Keep Your Repo Clean:

```bash
# Remove untracked files (be careful!)
git clean -fd

# See what would be removed (dry run)
git clean -fdn

# Remove ignored files from repo
git rm -r --cached node_modules/
git commit -m "Remove node_modules from tracking"
```

### Check Repository Size:
```bash
du -sh .git
# Should be < 100MB for this project
```

---

## ✅ Current Protection Status

Your repository is currently protected with:

- ✅ **`.gitignore`** - Comprehensive ignore rules
- ✅ **`.gitattributes`** - Consistent line endings
- ✅ **`.env.example`** - Template for environment variables
- ✅ **Documentation** - This guide!

---

## 🆘 Emergency: Secrets Were Exposed

If you accidentally push secrets to GitHub:

### Immediate Actions:

1. **Rotate ALL credentials immediately**
   - New Firebase service account
   - New API keys
   - New database passwords

2. **Remove from Git History**
   ```bash
   git filter-branch --force --index-filter \
     "git rm --cached --ignore-unmatch .env" \
     --prune-empty --tag-name-filter cat -- --all
   git push --force
   ```

3. **Contact Support**
   - If repository is public, contact GitHub support
   - Report the exposure
   - Request cache purge

4. **Monitor for Abuse**
   - Check Firebase usage
   - Check API usage
   - Review access logs

5. **Document the Incident**
   - What was exposed
   - When it was exposed
   - Actions taken
   - Preventive measures added

---

## 📚 Additional Resources

- [GitHub: Removing sensitive data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)
- [Git documentation: gitignore](https://git-scm.com/docs/gitignore)
- [Firebase: Best practices for service accounts](https://firebase.google.com/docs/admin/setup#initialize_the_sdk_in_non-google_environments)

---

## ✨ Summary

**Protected** ✅:
- Environment variables (.env)
- Firebase credentials
- Dependencies (node_modules)
- Build outputs (dist/, build/)
- Logs and cache

**Safe to Commit** ✅:
- Source code (*.js, *.jsx)
- Configuration templates (.env.example)
- Documentation (*.md)
- Public assets (images, CSS)
- Package files (package.json)

**Never Commit** ❌:
- Real credentials (.env)
- Service account keys
- API keys in code
- Passwords

---

**Remember**: When in doubt, don't commit it! Better safe than sorry. 🔒
