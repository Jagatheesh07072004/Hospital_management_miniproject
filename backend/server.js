const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");  // Added CORS for cross-origin requests
const app = express();
const PORT = 3001;

// Middleware
app.use(express.json());
app.use(express.static(__dirname + "/../frontend"));
app.use(cors());  // Allow cross-origin requests

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/newproject", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User Schema and Model
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

// Medicine Schema and Model
const medicineSchema = new mongoose.Schema({
  name: String,
  quantity: Number,
  price: Number,
  expiryDate: String,
  supplierEmail: String,
});
const Medicine = mongoose.model("Medicine", medicineSchema);

// Populate Database with Sample Medicines if Empty
async function populateSampleData() {
  const existingData = await Medicine.find();
  if (existingData.length === 0) {
    await Medicine.insertMany([
      {
        name: "Paracetamol",
        quantity: 50,
        price: 20,
        expiryDate: "2025-12-31",
        supplierEmail: "supplier1@example.com",
      },
      {
        name: "Aspirin",
        quantity: 30,
        price: 15,
        expiryDate: "2025-06-30",
        supplierEmail: "supplier2@example.com",
      },
      {
        name: "Ibuprofen",
        quantity: 40,
        price: 25,
        expiryDate: "2025-09-15",
        supplierEmail: "supplier3@example.com",
      },
      {
        name: "Amoxicillin",
        quantity: 60,
        price: 50,
        expiryDate: "2024-11-20",
        supplierEmail: "supplier4@example.com",
      },
      {
        name: "Ciprofloxacin",
        quantity: 20,
        price: 60,
        expiryDate: "2025-05-10",
        supplierEmail: "supplier5@example.com",
      },
      {
        name: "Metformin",
        quantity: 15,
        price: 30,
        expiryDate: "2025-10-05",
        supplierEmail: "supplier6@example.com",
      },
      {
        name: "Omeprazole",
        quantity: 80,
        price: 40,
        expiryDate: "2026-01-01",
        supplierEmail: "supplier7@example.com",
      },
      {
        name: "Losartan",
        quantity: 25,
        price: 35,
        expiryDate: "2025-07-07",
        supplierEmail: "supplier8@example.com",
      },
      {
        name: "Clarithromycin",
        quantity: 18,
        price: 45,
        expiryDate: "2024-12-10",
        supplierEmail: "supplier9@example.com",
      },
      {
        name: "Azithromycin",
        quantity: 12,
        price: 55,
        expiryDate: "2025-02-20",
        supplierEmail: "supplier10@example.com",
      },
    ]);
    console.log("Sample medicines added to the database.");
  }
}
populateSampleData();

// User Login/Signup API
app.post("/api/user", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });

  if (user) {
    if (user.password === password) {
      return res.json({ redirectTo: "/homepage.html" });
    } else {
      return res.status(401).json({ message: "Invalid password!" });
    }
  }

  user = new User({ email, password, role: "user" });
  await user.save();
  res.json({ message: "Signup successful!", redirectTo: "/userpage.html" });
});

// Update Medicine Quantity API
app.put("/api/medicines/:id", async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const medicine = await Medicine.findById(id);
    if (!medicine)
      return res.status(404).json({ message: "Medicine not found" });

    medicine.quantity = quantity;
    await medicine.save();

    res.status(200).json({ message: "Medicine quantity updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating medicine" });
  }
});

// Admin Login API
app.post("/api/admin", async (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@123gmail.com" && password === "Admin123") {
    return res.json({
      message: "Admin logged in successfully!",
      redirectTo: "/ramakeishnaadmin.html",
    });
  } else if (email === "admin@456gmail.com" && password === "Admin456") {
    return res.json({
      message: "Admin logged in successfully!",
      redirectTo: "/hospital2admin.html",
    });
  } else {
    return res.status(401).json({ message: "Invalid admin credentials!" });
  }
});

// Fetch Medicines with Pagination
app.get("/api/medicines", async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Current page (default: 1)
  const limit = 10; // Number of medicines per page
  const skip = (page - 1) * limit;

  const total = await Medicine.countDocuments(); // Total number of medicines
  const medicines = await Medicine.find().skip(skip).limit(limit);

  res.json({
    medicines,
    currentPage: page,
    totalPages: Math.ceil(total / limit),
  });
});

// Update Inventory API
app.post("/api/update-inventory", async (req, res) => {
  const updates = req.body;

  for (const item of updates) {
    await Medicine.findByIdAndUpdate(item.id, {
      $inc: { quantity: -item.quantity },
    });
  }
  res.sendStatus(200);
});

// Notify Low Stock API
app.post("/api/notify", async (req, res) => {
  const { medicineName } = req.body;
  const medicine = await Medicine.findOne({ name: medicineName });

  if (medicine && medicine.supplierEmail) {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "krishnakumar.2201115@srec.ac.in", // Replace with your email
        pass: "Nitheesh23&", // Replace with your email password or app password
      },
    });

    const mailOptions = {
      from: "krishnakumar.2201115@srec.ac.in", // Replace with your email
      to: medicine.supplierEmail, // Send to the supplier's email dynamically
      subject: "Low Stock Alert",
      text: `The stock for ${medicineName} is below 10. Please restock.`,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: "Notification sent successfully." });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).json({ message: "Failed to send notification." });
    }
  } else {
    res.status(404).json({ message: "Medicine or supplier email not found." });
  }
});

app.post("/api/sendConfirmationEmail", async (req, res) => {
  const { doctorName, patientName, patientEmail, appointmentDateTime } = req.body;

  // Create a transporter using your email provider
  const transporter = nodemailer.createTransport({
    service: "gmail",  // You can use any email service provider
    auth: {
      user: "krishnakumar.2201115@srec.ac.in", // Your email here
      pass: "Nitheesh23&", // Your email password or app password
    },
  });

  const mailOptions = {
    from: "krishnakumar.2201115@srec.ac.in", // Your email
    to: patientEmail, // Recipient's email (patient's email)
    subject: "Appointment Confirmation",
    text: `Dear ${patientName},\n\nYour appointment with Dr. ${doctorName} is confirmed for ${appointmentDateTime}.\n\nThank you for using our service.\n\nBest regards,\nSri Ramakrishna Hospital`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Confirmation email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send confirmation email." });
  }
});


// Start Server
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
