# DevOps Compass - Waitlist Landing Page

A production-ready pre-launch landing page for **DevOps Compass**, an anonymous career and salary platform for Cloud & DevOps professionals in the Philippines.

![DevOps Compass](https://img.shields.io/badge/Status-Pre--Launch-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb?logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFA611?logo=firebase)

## 🎯 Purpose

This landing page serves two critical goals:

1. **Build a waitlist** of interested Cloud & DevOps professionals
2. **Seed the database** with anonymous salary and skill data from early adopters

## ✨ Features

- **Modern Dark Theme** - Professional design appealing to developer audience
- **Responsive Design** - Mobile-first approach, works on all devices
- **Give-to-Get Form** - Collects role, experience, salary, skills, and email
- **Privacy-First** - Clear disclaimer about data anonymity
- **Social Sharing** - Post-submission sharing on LinkedIn, Facebook, and X
- **Real-time Validation** - Client-side form validation with helpful error messages
- **Firebase Integration** - Secure data storage in Firestore
- **Production Ready** - Error handling, loading states, and optimized performance

## 🛠️ Tech Stack

### Frontend
- **React 18.3** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Firebase Admin SDK** - Firestore database integration

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase project** with Firestore enabled

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd /Users/simarsingh/Documents/cdops/waitlist
npm install
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in production mode"
   - Select your preferred region
4. Generate service account credentials:
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key"
   - Download the JSON file

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your Firebase credentials:

```env
FIREBASE_SERVICE_ACCOUNT='{"type":"service_account","project_id":"your-project-id",...}'
PORT=5000
NODE_ENV=development
```

**Important:** Copy the entire contents of your Firebase service account JSON as a single-line string.

### 4. Run the Application

Start both frontend and backend concurrently:

```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

Or run them separately:

```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## 📁 Project Structure

```
waitlist/
├── src/                      # Frontend source
│   ├── components/
│   │   ├── Hero.jsx         # Hero section
│   │   ├── WaitlistForm.jsx # Main form component
│   │   └── ThankYou.jsx     # Post-submission component
│   ├── App.jsx              # Root component
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
├── server/
│   └── index.js             # Express API server
├── public/                  # Static assets
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
└── .env.example             # Environment template
```

## 🔌 API Endpoints

### POST `/api/waitlist`

Submit a new waitlist entry.

**Request Body:**
```json
{
  "role": "DevOps Engineer",
  "experience": 5,
  "salary": 180000,
  "skills": ["aws", "kubernetes", "terraform"],
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully joined the waitlist",
  "id": "firestore-doc-id"
}
```

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-03T12:00:00.000Z",
  "firebase": "connected"
}
```

### GET `/api/waitlist/stats`

Get aggregated waitlist statistics (optional, for admin use).

**Response:**
```json
{
  "total": 150,
  "byRole": {
    "DevOps Engineer": 50,
    "Cloud Engineer": 40,
    "SRE": 30,
    "Cloud Architect": 20,
    "Platform Engineer": 10
  },
  "avgExperience": 4.5,
  "avgSalary": 125000
}
```

## 🗄️ Firestore Schema

Collection: `waitlist_submissions`

Document structure:
```javascript
{
  role: "SRE",
  experience: 5,
  salary: 180000,
  skills: ["aws", "kubernetes", "prometheus"],
  email: "user@example.com",
  createdAt: Timestamp,
  submittedAt: "2025-10-03T12:00:00.000Z"
}
```

## 🎨 Customization

### Colors

Edit `tailwind.config.js` to customize the color scheme:

```javascript
colors: {
  dark: {
    bg: '#0a0a0b',        // Background
    card: '#1a1a1d',      // Card background
    border: '#2a2a2f',    // Borders
    text: '#e5e5e7',      // Primary text
    textMuted: '#9ca3af' // Secondary text
  },
  accent: {
    primary: '#3b82f6',      // Blue
    primaryHover: '#2563eb',
    secondary: '#10b981'     // Green
  }
}
```

### Form Fields

To modify form fields, edit `src/components/WaitlistForm.jsx`:

- Add/remove roles in the `roles` array
- Add new form fields in the JSX
- Update validation in `validateForm()`
- Update API schema in `server/index.js`

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the frontend:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting provider

### Backend (Railway/Render/Heroku)

1. Set environment variables in your hosting provider
2. Deploy the entire project
3. Set start command: `npm run start:backend`

### Environment Variables for Production

Set these in your hosting provider:

```env
FIREBASE_SERVICE_ACCOUNT=<your-firebase-json>
PORT=5000
NODE_ENV=production
```

## 🔒 Security Considerations

- Never commit `.env` file or Firebase credentials
- Use environment variables for all sensitive data
- Enable CORS only for your production domain
- Add rate limiting for API endpoints (recommended)
- Consider adding CAPTCHA for form submissions

## 📊 Monitoring

Monitor your waitlist growth:

1. Check Firebase Console for real-time submissions
2. Use `/api/waitlist/stats` endpoint for analytics
3. Set up Firebase Analytics (optional)

## 🐛 Troubleshooting

### Firebase Connection Issues

**Error:** "Firebase service account not found"

**Solution:** Ensure `.env` file exists and `FIREBASE_SERVICE_ACCOUNT` is properly formatted as a single-line JSON string.

### Port Already in Use

**Error:** "Port 3000/5000 already in use"

**Solution:** Change ports in `vite.config.js` or `.env` file, or kill the process using the port.

### Build Errors

**Solution:** Delete `node_modules` and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📝 License

This project is proprietary software for DevOps Compass.

## 🤝 Support

For questions or issues:
- Email: hello@devopscompass.ph
- Create an issue in the repository

## 🎉 Acknowledgments

Built for the DevOps community in the Philippines with ❤️

---

**Ready to launch?** Follow the setup steps above and start collecting your waitlist! 🚀
