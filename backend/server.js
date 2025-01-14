const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname + '/../frontend'));

mongoose.connect('mongodb://localhost:27017/newproject', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({ email: String, password: String, role: String });
const User = mongoose.model('User', userSchema);

app.post('/api/user', async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email });

    if (user) {
        if (user.password === password) {
            return res.json({ redirectTo: '/homepage.html' });
        } else {
            return res.status(401).json({ message: 'Invalid password!' });
        }
    }

    user = new User({ email, password, role: 'user' });
    await user.save();
    res.json({ message: 'Signup successful!', redirectTo: '/userpage.html' });
});

app.post('/api/admin', async (req, res) => {
    const { email, password } = req.body;

    if (email === "admin@123gmail.com" && password === "Admin123") {
        return res.json({ message: 'Admin logged in successfully!', redirectTo: '/ramakeishnaadmin.html' });
    } else if (email === "admin@456gmail.com" && password === "Admin456") {
        return res.json({ message: 'Admin logged in successfully!', redirectTo: '/hospital2admin.html' });
    } else {
        return res.status(401).json({ message: 'Invalid admin credentials!' });
    }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
