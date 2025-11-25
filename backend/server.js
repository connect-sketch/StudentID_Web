const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path'); // Added path module

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// IMPORTANT: Replace the placeholder connection string with your actual MongoDB connection string.
// You can get this from MongoDB Atlas (cloud) or your local MongoDB instance.
const mongoURI = 'mongodb+srv://connect_db_user:mjv9tCQVjcCbi6uI@studentidrequests.cgjbrk8.mongodb.net/?appName=StudentIDRequests';

mongoose.connect(mongoURI)
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- Basic Route to Test Server ---
app.get('/', (req, res) => {
    res.send('Backend server is running!');
});

// --- Mongoose Schema and Model for Callback Requests ---
const callbackRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String }
}, { timestamps: true });

const CallbackRequest = mongoose.model('CallbackRequest', callbackRequestSchema);

// --- API Endpoint for Callback Form Submissions ---
app.post('/api/callback-requests', async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Basic validation
        if (!name || !email || !phone) {
            return res.status(400).json({ message: 'Name, email, and phone are required.' });
        }

        const newRequest = new CallbackRequest({
            name,
            email,
            phone,
            message
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
    standardizedTestScores: { type: String }
}, { timestamps: true });

const EligibilityCheck = mongoose.model('EligibilityCheck', eligibilityCheckSchema);

// --- API Endpoint for Eligibility Check Form Submissions ---
app.post('/api/eligibility-checks', async (req, res) => {
    try {
        const { name, email, highestQualification, overallMarksGPA, standardizedTestScores } = req.body;

        // Basic validation
        if (!name || !email || !highestQualification || !overallMarksGPA) {
            return res.status(400).json({ message: 'Name, email, highest qualification, and overall marks/GPA are required.' });
        }

        const newEligibilityCheck = new EligibilityCheck({
            name,
            email,
            highestQualification,
            overallMarksGPA,
            standardizedTestScores
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
    country: { type: String, required: true }
}, { timestamps: true });

const ExpertRequest = mongoose.model('ExpertRequest', expertRequestSchema);

// --- Mongoose Schema and Model for Counselling Sessions ---
const counsellingSessionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    sessionDate: { type: String, required: true },
    sessionSlot: { type: String, required: true }
}, { timestamps: true });

const CounsellingSession = mongoose.model('CounsellingSession', counsellingSessionSchema);

// --- Mongoose Schema and Model for Demo Requests ---
const demoRequestSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    testType: { type: String, required: true }
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
        const { name, email, phone, country } = req.body;
        if (!name || !email || !phone || !country) {
            return res.status(400).json({ message: 'Name, email, phone, and country are required.' });
        }
        const newExpertRequest = new ExpertRequest({ name, email, phone, country });
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
        const { name, email, phone, sessionDate, sessionSlot } = req.body;
        if (!name || !email || !phone || !sessionDate || !sessionSlot) {
            return res.status(400).json({ message: 'All fields are required.' });
        }
        const newCounsellingSession = new CounsellingSession({ name, email, phone, sessionDate, sessionSlot });
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
        const { name, email, phone, testType } = req.body;
        if (!name || !email || !phone || !testType) {
            return res.status(400).json({ message: 'Name, email, phone, and test type are required.' });
        }
        const newDemoRequest = new DemoRequest({ name, email, phone, testType });
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


// --- Admin Dashboard Authentication Middleware ---
const ADMIN_PASSWORD = 'adminpassword'; // IMPORTANT: Use environment variables in production!

const authenticateAdmin = (req, res, next) => {
    const password = req.headers['x-admin-password'] || req.query.password;
    if (password === ADMIN_PASSWORD) {
        next();
    } else {
        res.status(401).send('Unauthorized');
    }
};

// --- Admin Password Verification Endpoint ---
app.post('/api/admin/verify-password', (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
        res.status(200).send('Authentication successful');
    } else {
        res.status(401).send('Invalid password');
    }
});

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
