const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // If you're using .env to store sensitive data like API keys

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// API endpoint for sending appointment confirmation email
app.post('/api/send-appointment-confirmation', async (req, res) => {
  const { patientEmail, doctorName, patientName, appointmentDateTime } = req.body;

  // Validate input
  if (!patientEmail || !doctorName || !patientName || !appointmentDateTime) {
    return res.status(400).json({ message: 'All fields are required: patientEmail, doctorName, patientName, and appointmentDateTime.' });
  }

  // For now, we're not sending any emails. You can implement other actions here.
  res.json({ message: 'Appointment details received successfully!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
