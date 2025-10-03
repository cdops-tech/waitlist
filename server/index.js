import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware

// 1. Helmet - Security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// 2. CORS - Restrict to allowed origins
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST'],
  credentials: true,
}));

// 3. JSON payload size limit
app.use(express.json({ limit: '10kb' }));

// 4. Rate limiting for API endpoints
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'development' ? 100 : 5, // Higher limit for testing in dev
  message: { 
    error: 'Too many requests from this IP, please try again after 15 minutes.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res) => {
    console.log(`⚠️  Rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({
      error: 'Too many requests from this IP, please try again after 15 minutes.',
      retryAfter: '15 minutes'
    });
  },
});

// 5. General rate limiter for other endpoints
const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // Limit each IP to 20 requests per minute
  message: { error: 'Too many requests, please slow down.' },
});

// Initialize Firebase Admin SDK
let db;
try {
  // Process private key: remove quotes and convert \n to actual newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/^"|"$/g, '')
    : undefined;

  // Build service account from individual env variables
  const serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: privateKey,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
  };

  if (serviceAccount.project_id && serviceAccount.private_key && serviceAccount.client_email) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    db = admin.firestore();
    console.log('✅ Firebase initialized successfully');
    console.log('📁 Project ID:', serviceAccount.project_id);
  } else {
    console.warn('⚠️  Firebase credentials incomplete. Please check your .env file');
    console.warn('⚠️  Server will run but submissions will not be saved to Firestore.');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase:', error.message);
  console.warn('⚠️  Server will run but submissions will not be saved to Firestore.');
}

// Validation constants - Define allowed values for all enum fields
const VALID_EMPLOYMENT_STATUSES = ['Employed', 'Looking', 'Freelancing'];

const VALID_EXPERIENCE_LEVELS = [
  'Junior (0-2 years)',
  'Mid-level (3-5 years)',
  'Senior (6-8 years)',
  'Lead/Principal (9+ years)',
  'Engineering Manager',
  'Director/VP'
];

const VALID_ROLE_FOCUSES = [
  'DevOps Engineer',
  'Cloud Engineer',
  'SRE',
  'Platform Engineer',
  'Infrastructure Engineer',
  'Security Engineer'
];

const VALID_LOCATIONS = [
  'Metro Manila',
  'Cebu',
  'Davao',
  'Remote - Philippines',
  'Remote - International',
  'Other'
];

const VALID_SALARY_RANGES = [
  'Below 50,000',
  '50,000 - 80,000',
  '80,000 - 120,000',
  '120,000 - 160,000',
  '160,000 - 200,000',
  '200,000 - 250,000',
  '250,000 - 300,000',
  'Above 300,000'
];

const VALID_CLOUD_PLATFORMS = [
  'AWS',
  'Google Cloud Platform (GCP)',
  'Microsoft Azure',
  'Alibaba Cloud',
  'DigitalOcean',
  'Oracle Cloud',
  'IBM Cloud'
];

const VALID_DEVOPS_TOOLS = [
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
];

const VALID_PROGRAMMING_LANGUAGES = [
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
];

const VALID_MONITORING_TOOLS = [
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
];

const VALID_DATABASES = [
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
];

// Helper function to validate arrays
const validateArray = (arr, validValues, fieldName, maxLength = 50) => {
  if (!arr || arr.length === 0) return null; // Optional arrays can be empty
  
  if (!Array.isArray(arr)) {
    return `${fieldName} must be an array`;
  }
  
  if (arr.length > maxLength) {
    return `${fieldName} has too many items (maximum ${maxLength})`;
  }
  
  for (const item of arr) {
    if (typeof item !== 'string') {
      return `${fieldName} must contain only strings`;
    }
    if (item.trim().length === 0) {
      return `${fieldName} contains empty values`;
    }
    if (!validValues.includes(item)) {
      return `Invalid ${fieldName}: ${item}`;
    }
  }
  
  return null;
};

// Validation middleware
const validateWaitlistData = (req, res, next) => {
  const { 
    email, preferredName, linkedinProfile, yearsOfExperience, employmentStatus,
    cloudPlatforms, devopsTools, programmingLanguages, monitoringTools, databases,
    experienceLevel, roleFocus, location, currentSalaryRange, desiredSalaryRange
  } = req.body;

  // 1. Validate email
  if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  // 2. Validate string length limits
  if (preferredName && preferredName.length > 100) {
    return res.status(400).json({ error: 'Preferred name is too long (maximum 100 characters)' });
  }

  if (linkedinProfile && linkedinProfile.length > 200) {
    return res.status(400).json({ error: 'LinkedIn URL is too long (maximum 200 characters)' });
  }

  // 3. Validate LinkedIn URL format (if provided)
  if (linkedinProfile && linkedinProfile.trim()) {
    const linkedinRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/;
    if (!linkedinRegex.test(linkedinProfile.trim())) {
      return res.status(400).json({ 
        error: 'Invalid LinkedIn URL format. Must be like: https://linkedin.com/in/yourprofile' 
      });
    }
  }

  // 4. Validate years of experience (accept both number and string, convert to number)
  if (yearsOfExperience === undefined || yearsOfExperience === null || yearsOfExperience === '') {
    return res.status(400).json({ error: 'Years of experience is required' });
  }
  const yearsNum = typeof yearsOfExperience === 'number' ? yearsOfExperience : parseFloat(yearsOfExperience);
  if (isNaN(yearsNum) || yearsNum < 0) {
    return res.status(400).json({ error: 'Years of experience must be a valid positive number' });
  }
  // Store the parsed number back in req.body for consistent type
  req.body.yearsOfExperience = yearsNum;

  // 5. Validate employment status (enum)
  if (!employmentStatus || !VALID_EMPLOYMENT_STATUSES.includes(employmentStatus)) {
    return res.status(400).json({ 
      error: `Invalid employment status. Must be one of: ${VALID_EMPLOYMENT_STATUSES.join(', ')}` 
    });
  }

  // 6. Validate skill arrays
  let arrayError = validateArray(cloudPlatforms, VALID_CLOUD_PLATFORMS, 'cloud platforms', 20);
  if (arrayError) return res.status(400).json({ error: arrayError });

  arrayError = validateArray(devopsTools, VALID_DEVOPS_TOOLS, 'DevOps tools', 20);
  if (arrayError) return res.status(400).json({ error: arrayError });

  arrayError = validateArray(programmingLanguages, VALID_PROGRAMMING_LANGUAGES, 'programming languages', 20);
  if (arrayError) return res.status(400).json({ error: arrayError });

  arrayError = validateArray(monitoringTools, VALID_MONITORING_TOOLS, 'monitoring tools', 20);
  if (arrayError) return res.status(400).json({ error: arrayError });

  arrayError = validateArray(databases, VALID_DATABASES, 'databases', 20);
  if (arrayError) return res.status(400).json({ error: arrayError });

  // 7. Check if at least one skill category has selections
  const totalSkills = (cloudPlatforms?.length || 0) + (devopsTools?.length || 0) + 
                     (programmingLanguages?.length || 0) + (monitoringTools?.length || 0) + 
                     (databases?.length || 0);
  if (totalSkills === 0) {
    return res.status(400).json({ error: 'At least one skill must be selected' });
  }

  // 8. Validate experience level (enum)
  if (!experienceLevel || !VALID_EXPERIENCE_LEVELS.includes(experienceLevel)) {
    return res.status(400).json({ 
      error: `Invalid experience level. Must be one of: ${VALID_EXPERIENCE_LEVELS.join(', ')}` 
    });
  }

  // 9. Validate role focus (enum)
  if (!roleFocus || !VALID_ROLE_FOCUSES.includes(roleFocus)) {
    return res.status(400).json({ 
      error: `Invalid role focus. Must be one of: ${VALID_ROLE_FOCUSES.join(', ')}` 
    });
  }

  // 10. Validate location (enum)
  if (!location || !VALID_LOCATIONS.includes(location)) {
    return res.status(400).json({ 
      error: `Invalid location. Must be one of: ${VALID_LOCATIONS.join(', ')}` 
    });
  }

  // 11. Validate current salary range (enum)
  if (!currentSalaryRange || !VALID_SALARY_RANGES.includes(currentSalaryRange)) {
    return res.status(400).json({ 
      error: `Invalid current salary range. Must be one of: ${VALID_SALARY_RANGES.join(', ')}` 
    });
  }

  // 12. Validate desired salary range (enum, optional)
  if (desiredSalaryRange && !VALID_SALARY_RANGES.includes(desiredSalaryRange)) {
    return res.status(400).json({ 
      error: `Invalid desired salary range. Must be one of: ${VALID_SALARY_RANGES.join(', ')}` 
    });
  }

  next();
};

// Health check endpoint
app.get('/api/health', generalLimiter, (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    firebase: db ? 'connected' : 'not configured'
  });
});

// Root health check for Render (no rate limiting for deployment health checks)
app.get('/', (req, res) => {
  res.json({ 
    status: 'ok',
    service: 'DevOps Compass Waitlist API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Waitlist submission endpoint with rate limiting
app.post('/api/waitlist', apiLimiter, validateWaitlistData, async (req, res) => {
  try {
    const { 
      email, preferredName, linkedinProfile, yearsOfExperience, employmentStatus,
      cloudPlatforms, devopsTools, programmingLanguages, monitoringTools, databases,
      experienceLevel, roleFocus, location, currentSalaryRange, desiredSalaryRange
    } = req.body;

    // Check for duplicate email
    if (db) {
      const emailLower = email.toLowerCase().trim();
      const existingSubmissions = await db.collection('waitlist_submissions')
        .where('email', '==', emailLower)
        .limit(1)
        .get();
      
      if (!existingSubmissions.empty) {
        console.log(`⚠️  Duplicate email attempt: ${emailLower}`);
        return res.status(409).json({ 
          error: 'This email has already been registered on the waitlist.',
          message: 'If you need to update your information, please contact us.'
        });
      }
    }

    const submissionData = {
      // Personal Information
      email: email.toLowerCase().trim(),
      preferredName: preferredName?.trim() || null,
      linkedinProfile: linkedinProfile?.trim() || null,
      yearsOfExperience: yearsOfExperience,
      employmentStatus,
      
      // Technical Skills
      cloudPlatforms: cloudPlatforms || [],
      devopsTools: devopsTools || [],
      programmingLanguages: programmingLanguages || [],
      monitoringTools: monitoringTools || [],
      databases: databases || [],
      
      // Experience & Role
      experienceLevel,
      roleFocus,
      
      // Location & Compensation
      location,
      currentSalaryRange,
      desiredSalaryRange: desiredSalaryRange || null,
      
      // Metadata
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      submittedAt: new Date().toISOString()
    };

    // Save to Firestore
    if (db) {
      const docRef = await db.collection('waitlist_submissions').add(submissionData);
      console.log('✅ Submission saved with ID:', docRef.id);
      console.log('📊 Data:', { email: submissionData.email, role: submissionData.roleFocus, location: submissionData.location });
      
      res.status(201).json({ 
        success: true, 
        message: 'Successfully joined the waitlist',
        id: docRef.id
      });
    } else {
      // Fallback: log to console if Firebase is not configured
      console.log('📝 Waitlist submission (Firebase not configured):', submissionData);
      
      res.status(201).json({ 
        success: true, 
        message: 'Successfully joined the waitlist (dev mode - not saved to database)',
        data: submissionData
      });
    }

  } catch (error) {
    console.error('❌ Error saving submission:', error);
    res.status(500).json({ 
      error: 'Failed to process submission. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get waitlist stats (optional - for admin dashboard)
app.get('/api/waitlist/stats', generalLimiter, async (req, res) => {
  try {
    if (!db) {
      return res.status(503).json({ error: 'Database not configured' });
    }

    const snapshot = await db.collection('waitlist_submissions').get();
    const submissions = snapshot.docs.map(doc => doc.data());

    const stats = {
      total: submissions.length,
      byRole: {},
      byLocation: {},
      byExperienceLevel: {},
      bySalaryRange: {},
      topSkills: {
        cloudPlatforms: {},
        devopsTools: {},
        programmingLanguages: {}
      },
      employmentStatus: {}
    };

    submissions.forEach(sub => {
      // Role distribution
      stats.byRole[sub.roleFocus] = (stats.byRole[sub.roleFocus] || 0) + 1;
      
      // Location distribution
      stats.byLocation[sub.location] = (stats.byLocation[sub.location] || 0) + 1;
      
      // Experience level distribution
      stats.byExperienceLevel[sub.experienceLevel] = (stats.byExperienceLevel[sub.experienceLevel] || 0) + 1;
      
      // Salary range distribution
      stats.bySalaryRange[sub.currentSalaryRange] = (stats.bySalaryRange[sub.currentSalaryRange] || 0) + 1;
      
      // Employment status
      stats.employmentStatus[sub.employmentStatus] = (stats.employmentStatus[sub.employmentStatus] || 0) + 1;
      
      // Top skills
      sub.cloudPlatforms?.forEach(skill => {
        stats.topSkills.cloudPlatforms[skill] = (stats.topSkills.cloudPlatforms[skill] || 0) + 1;
      });
      sub.devopsTools?.forEach(skill => {
        stats.topSkills.devopsTools[skill] = (stats.topSkills.devopsTools[skill] || 0) + 1;
      });
      sub.programmingLanguages?.forEach(skill => {
        stats.topSkills.programmingLanguages[skill] = (stats.topSkills.programmingLanguages[skill] || 0) + 1;
      });
    });

    res.json(stats);
  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 API endpoint: http://localhost:${PORT}/api/waitlist`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
