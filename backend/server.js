const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const path = require('path');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: ['https://www.thestudentid.com', 'https://thestudentid.com', 'https://student-id-admin.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// --- Configuration ---
const GOOGLE_CLIENT_ID = '329586274471-bb5c6v0g2qlpli5njldko1iu41950u8o.apps.googleusercontent.com';
const JWT_SECRET = process.env.JWT_SECRET || 'your-default-secret-for-dev'; // Use a strong secret in production
const ALLOWED_ADMIN_EMAILS = ['connect@thestudentid.com', 'asrafcena2018@gmail.com']; // ADD YOUR GOOGLE EMAIL HERE

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// --- Nodemailer Transporter Configuration ---
// Note: Use environment variables for sensitive info in production
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER, // e.g., 'your-email@gmail.com'
        pass: process.env.GMAIL_PASS  // e.g., 'your-app-password'
    }
});

// --- MongoDB Connection ---
const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
    console.error('CRITICAL ERROR: MONGO_URI is not defined in environment variables.');
} else {
    mongoose.connect(mongoURI)
        .then(() => console.log('MongoDB connected successfully.'))
        .catch(err => {
            console.error('MongoDB connection error details:');
            console.error('Error Name:', err.name);
            console.error('Error Message:', err.message);
            if (err.message.includes('authentication failed')) {
                console.error('FIX: Check your database username and password in the connection string.');
            } else if (err.message.includes('ETIMEDOUT')) {
                console.error('FIX: Ensure you have allowed access from 0.0.0.0/0 in MongoDB Atlas Network Access.');
            }
        });
}

// --- Mongoose Schema for Admin Users ---
const adminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false, select: false }, // password now optional for Google users
    authProvider: { type: String, default: 'local' } // 'local' or 'google'
});

const Admin = mongoose.model('Admin', adminSchema);

// --- Basic Route to Test Server ---
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// --- Mongoose Schema and Model for Callback Requests ---
const callbackRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String },
    referralCode: { type: String, default: 'Direct' }
}, { timestamps: true, collection: 'callback_requests' });

const CallbackRequest = mongoose.model('CallbackRequest', callbackRequestSchema);

// --- API Endpoint for Callback Form Submissions ---
app.post('/api/callback-requests', async (req, res) => {
    try {
        const { name, email, phone, message, referralCode } = req.body;

        // Basic validation
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required.' });
        }

        const newRequest = new CallbackRequest({
            name,
            email,
            phone,
            message,
            referralCode: referralCode || 'Direct'
        });

        await newRequest.save();
        res.status(201).json({ message: 'Callback request received and stored successfully.' });
    } catch (error) {
        console.error('Error saving callback request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// --- Mongoose Schema and Model for Eligibility Check Requests ---
const eligibilityCheckSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    highestQualification: { type: String, required: true },
    overallMarksGPA: { type: String, required: true },
    standardizedTestScores: { type: String },
    referralCode: { type: String, default: 'Direct' }
}, { timestamps: true });

const EligibilityCheck = mongoose.model('EligibilityCheck', eligibilityCheckSchema);

// --- API Endpoint for Eligibility Check Form Submissions ---
app.post('/api/eligibility-checks', async (req, res) => {
    try {
        const { name, email, highestQualification, overallMarksGPA, standardizedTestScores, referralCode } = req.body;

        // Basic validation
        if (!name || !email || !highestQualification || !overallMarksGPA) {
            return res.status(400).json({ message: 'Name, email, highest qualification, and overall marks/GPA are required.' });
        }

        const newEligibilityCheck = new EligibilityCheck({
            name,
            email,
            highestQualification,
            overallMarksGPA,
            standardizedTestScores,
            referralCode: referralCode || 'Direct'
        });

        await newEligibilityCheck.save();
        res.status(201).json({ message: 'Eligibility check request received and stored successfully.' });
    } catch (error) {
        console.error('Error saving eligibility check request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// --- Mongoose Schema and Model for Interaction Logs ---
const interactionLogSchema = new mongoose.Schema({
    eventType: { type: String, required: true }, // e.g., 'buttonClick', 'formSubmission'
    source: { type: String, required: true },    // e.g., 'talkToExpertButton', 'bookCounsellingButton'
    details: { type: mongoose.Schema.Types.Mixed }, // Flexible field for additional data
    timestamp: { type: Date, default: Date.now }
});

const InteractionLog = mongoose.model('InteractionLog', interactionLogSchema);

// --- Mongoose Schema and Model for Expert Requests ---
const expertRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    country: { type: String, required: true },
    referralCode: { type: String, default: 'Direct' }
}, { timestamps: true });

const ExpertRequest = mongoose.model('ExpertRequest', expertRequestSchema);

// --- Mongoose Schema and Model for Counselling Sessions ---
const counsellingSessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    sessionDate: { type: String, required: true },
    sessionSlot: { type: String, required: true },
    referralCode: { type: String, default: 'Direct' }
}, { timestamps: true });

const CounsellingSession = mongoose.model('CounsellingSession', counsellingSessionSchema);

// --- Mongoose Schema and Model for Demo Requests ---
const demoRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    testType: { type: String, required: true },
    referralCode: { type: String, default: 'Direct' }
}, { timestamps: true });

const DemoRequest = mongoose.model('DemoRequest', demoRequestSchema);




// --- API Endpoint for Interaction Logs ---
app.post('/api/interactions', async (req, res) => {
    try {
        const { eventType, source, details } = req.body;

        // Basic validation
        if (!eventType || !source) {
            return res.status(400).json({ message: 'eventType and source are required.' });
        }

        const newInteraction = new InteractionLog({
            eventType,
            source,
            details
        });

        await newInteraction.save();
        res.status(201).json({ message: 'Interaction logged successfully.' });
    } catch (error) {
        console.error('Error saving interaction log:', error);
        res.status(500).json({ message: 'An error occurred while logging the interaction.' });
    }
});

// --- API Endpoint for Expert Requests ---
app.post('/api/expert-requests', async (req, res) => {
    try {
        const { name, email, phone, country, referralCode } = req.body;
        if (!name || !email || !phone || !country) {
            return res.status(400).json({ message: 'Name, email, phone, and country are required.' });
        }
        const newExpertRequest = new ExpertRequest({ 
            name, 
            email, 
            phone, 
            country,
            referralCode: referralCode || 'Direct'
        });
        await newExpertRequest.save();
        res.status(201).json({ message: 'Expert request received successfully.' });
    } catch (error) {
        console.error('Error saving expert request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// --- API Endpoint for Counselling Sessions ---
app.post('/api/counselling-sessions', async (req, res) => {
    try {
        const { name, email, phone, sessionDate, sessionSlot, referralCode } = req.body;
        if (!name || !email || !phone || !sessionDate || !sessionSlot) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newCounsellingSession = new CounsellingSession({ 
            name, 
            email, 
            phone, 
            sessionDate, 
            sessionSlot,
            referralCode: referralCode || 'Direct'
        });
        await newCounsellingSession.save();
        res.status(201).json({ message: 'Counselling session booked successfully.' });
    } catch (error) {
        console.error('Error booking counselling session:', error);
        res.status(500).json({ message: 'An error occurred while booking your session.' });
    }
});

// --- API Endpoint for Demo Requests ---
app.post('/api/demo-requests', async (req, res) => {
    try {
        const { name, email, phone, testType, referralCode } = req.body;
        if (!name || !email || !phone || !testType) {
            return res.status(400).json({ message: 'Name, email, phone, and test type are required.' });
        }
        const newDemoRequest = new DemoRequest({ 
            name, 
            email, 
            phone, 
            testType,
            referralCode: referralCode || 'Direct'
        });
        await newDemoRequest.save();
        res.status(201).json({ message: 'Demo request received successfully.' });
    } catch (error) {
        console.error('Error saving demo request:', error);
        res.status(500).json({ message: 'An error occurred while processing your request.' });
    }
});

// --- API Endpoint for Contact Form Email ---
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        if (!name || !email || !phone || !message) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        const mailOptions = {
            from: 'YOUR_GMAIL_ADDRESS', // Sender address
            to: 'connect@thestudentid.com', // Recipient address
            subject: `New Contact from ${name} (${email})`,
            html: `
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Message:</strong> ${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
    } catch (error) {
        console.error('Error sending contact email:', error);
        res.status(500).json({ message: 'Failed to send message.' });
    }
});

// --- Influencer Stats Endpoint (Public but Masked) ---
app.get('/api/influencer/:refCode', async (req, res) => {
    try {
        const { refCode } = req.params;

        // Helper function to mask name: "John Doe" -> "J***e"
        const maskName = (name) => {
            if (!name) return "Unknown";
            const parts = name.trim().split(' ');
            if (parts.length === 1) {
                return name[0] + "***" + name[name.length - 1];
            }
            const firstPart = parts[0];
            const lastPart = parts[parts.length - 1];
            return firstPart[0] + "***" + lastPart[lastPart.length - 1];
        };

        // Fetch data from all relevant collections
        const [callbacks, eligibility, experts] = await Promise.all([
            CallbackRequest.find({ referralCode: refCode }).select('name createdAt'),
            EligibilityCheck.find({ referralCode: refCode }).select('name createdAt'),
            ExpertRequest.find({ referralCode: refCode }).select('name createdAt')
        ]);

        // Combine and format
        const combinedList = [
            ...callbacks.map(item => ({ name: maskName(item.name), type: 'Callback', date: item.createdAt })),
            ...eligibility.map(item => ({ name: maskName(item.name), type: 'Eligibility', date: item.createdAt })),
            ...experts.map(item => ({ name: maskName(item.name), type: 'Expert', date: item.createdAt }))
        ].sort((a, b) => b.date - a.date);

        res.json({
            total: combinedList.length,
            breakdown: {
                callbacks: callbacks.length,
                eligibility: eligibility.length,
                experts: experts.length
            },
            list: combinedList
        });

    } catch (error) {
        console.error('Influencer stats error:', error);
        res.status(500).json({ message: 'Error fetching performance data.' });
    }
});

// --- Admin Google Login Endpoint ---
app.post('/api/admin/google-login', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            console.error('Login Error: No idToken provided in request body');
            return res.status(400).send('No ID Token provided.');
        }

        console.log('Attempting to verify Google Token...');
        
        const ticket = await client.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID
        }).catch(err => {
            console.error('Google Token Verification Failed:', err.message);
            throw err;
        });

        const payload = ticket.getPayload();
        const email = payload['email'];
        console.log(`Login attempt for email: ${email}`);

        if (!ALLOWED_ADMIN_EMAILS.includes(email)) {
            console.warn(`Access Denied: ${email} is not in the allowed list.`);
            return res.status(403).send('Access denied: You are not an authorized admin.');
        }

        // Check if admin exists in DB
        let admin = await Admin.findOne({ email });
        if (!admin) {
            console.log(`Creating new Google admin record for: ${email}`);
            admin = new Admin({ email, authProvider: 'google' });
            await admin.save();
        }

        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
        console.log('Login Successful, JWT generated.');
        res.status(200).json({ token });

    } catch (error) {
        console.error('FULL LOGIN ERROR:', error);
        res.status(500).send(`Authentication Error: ${error.message}`);
    }
});

// --- Admin Login Endpoint (Old Email/Password) ---
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email }).select('+password');

        if (!admin) {
            return res.status(401).send('Invalid email or password.');
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(401).send('Invalid email or password.');
        }

        // Generate JWT
        const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });

        res.status(200).json({ token });

    } catch (error) {
        res.status(500).send('An error occurred during login.');
    }
});

// --- Admin Authentication Middleware ---
const authenticateAdmin = (req, res, next) => {
    // Check for token in Authorization header
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.split(' ')[1]) || req.query.token;

    if (!token) {
        return res.status(401).send('Unauthorized: No token provided.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        return res.status(401).send('Unauthorized: Invalid token.');
    }
};

// --- Admin Dashboard GET Endpoints (Protected) ---
app.get('/api/admin/callback-requests', authenticateAdmin, async (req, res) => {
    try {
        const requests = await CallbackRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching callback requests:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});


app.get('/api/admin/eligibility-checks', authenticateAdmin, async (req, res) => {
    try {
        const checks = await EligibilityCheck.find().sort({ createdAt: -1 });
        res.json(checks);
    } catch (error) {
        console.error('Error fetching eligibility checks:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

app.get('/api/admin/interactions', authenticateAdmin, async (req, res) => {
    try {
        const interactions = await InteractionLog.find().sort({ createdAt: -1 });
        res.json(interactions);
    } catch (error) {
        console.error('Error fetching interaction logs:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

app.get('/api/admin/expert-requests', authenticateAdmin, async (req, res) => {
    try {
        const requests = await ExpertRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching expert requests:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

app.get('/api/admin/counselling-sessions', authenticateAdmin, async (req, res) => {
    try {
        const sessions = await CounsellingSession.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        console.error('Error fetching counselling sessions:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

app.get('/api/admin/demo-requests', authenticateAdmin, async (req, res) => {
    try {
        const requests = await DemoRequest.find().sort({ createdAt: -1 });
        res.json(requests);
    } catch (error) {
        console.error('Error fetching demo requests:', error);
        res.status(500).json({ message: 'Error fetching data.' });
    }
});

// --- Serve Static Admin Dashboard Files ---
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// --- Start the Server ---
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(`Admin dashboard available at http://localhost:${port}/admin`);
});
