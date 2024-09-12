// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // Load environment variables from .env file

// Initialize Express app
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Define Mongoose Schema and Model
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },

});

const User = mongoose.model('User', userSchema);

// API to create user data
app.post('/api/users', async (req, res) => {
    try {
        const { name, phone, address } = req.body;
        const user = new User({ name, phone, address });
        const savedUser = await user.save();
        res.status(201).json(savedUser); // Send JSON response with 201 Created status
    } catch (error) {
        res.status(400).json({ message: 'Error saving user', error });
    }
});

app.post('/api/users', async (req, res) => {
    try {
        // Check if request body is empty
        if (!req.body) {
            return res.status(400).send({ message: 'Request body is empty' });
        }

        // Destructure request body
        const { name, phone, address } = req.body;

        // Validate request body
        if (!name || !phone || !address) {
            return res.status(400).send({ message: 'Please fill in all fields' });
        }

        // Create new user
        const user = new User({ name, phone, address });

        // Save user to database
        await user.save();

        // Send response
        res.status(201).send({ message: 'User created successfully', data: { ...user.toObject({ virtuals: false }), _id: user.id } });
    } catch (error) {
        // Send error response
        res.status(500).send({ message: 'Error creating user', error: error.message });
    }
});


// API to get all users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});


// Start server
const PORT = process.env.PORT || 5001;  // Use port from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
