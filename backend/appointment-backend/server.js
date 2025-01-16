const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // If you're using .env to store sensitive data like API keys

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Nodemailer transporter configuration for Gmail (You can replace with SendGrid or another service)
const transporter = nodemailer.createTransport({
  service: 'gmail',  // or 'sendgrid', 'outlook', etc.
  auth: {
    user: process.env.EMAIL_USER || 'your-email@example.com',  // Replace with your email
    pass: process.env.EMAIL_PASS || 'your-email-password',  // Replace with your password
  },
});

// API endpoint for sending appointment confirmation email
app.post('/api/send-appointment-confirmation', async (req, res) => {
  const { patientEmail, doctorName, patientName, appointmentDateTime } = req.body;

  // Validate input
  if (!patientEmail || !doctorName || !patientName || !appointmentDateTime) {
    return res.status(400).json({ message: 'All fields are required: patientEmail, doctorName, patientName, and appointmentDateTime.' });
  }

  // Create email message
  const mailOptions = {
    from: process.env.EMAIL_USER || 'your-email@example.com',  // Sender's email address
    to: patientEmail,  // Recipient email
    subject: 'Appointment Confirmation',
    text: `Hello ${patientName},\n\nYour appointment with Dr. ${doctorName} is confirmed for ${appointmentDateTime}.\n\nThank you,\nSri Ramakrishna Hospital`, // Appointment details in the email body
  };

  try {
    // Send email using nodemailer
    await transporter.sendMail(mailOptions);
    res.json({ message: 'Confirmation email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send confirmation email.', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
