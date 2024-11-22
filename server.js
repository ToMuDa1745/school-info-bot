const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email service (e.g., Gmail)
    auth: {
        user: 'your-email@gmail.com', // Your email
        pass: 'your-email-password' // Your email password or an app password
    }
});

// Email sending endpoint
app.post('/send-email', (req, res) => {
    const { teacherName, userMessage } = req.body;

    const mailOptions = {
        from: 'your-email@gmail.com', // Your email
        to: `${teacherName}@school.com`, // Replace with actual logic to determine teacher's email
        subject: 'Message from Student',
        text: userMessage
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Message sent: ' + info.response);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
