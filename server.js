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

// MongoDB Schema
const companySchema = new mongoose.Schema({
    name: String,
    founded: Number,
    headquarters: String,
    sector: String,
    industry: String,
    info: String,
    revenuePerYear: [{
        year: Number,
        revenue: Number, // In billion USD
        employees: Number,
        revenueGrowth: Number, // Year-over-Year Growth in Percentage
    }]
});

const User = mongoose.model('User', userSchema);
const Company = mongoose.model('Company', companySchema);

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

// Add new company data
app.post('/api/company', async (req, res) => {
    const { name, founded, headquarters, sector, industry, info, revenuePerYear } = req.body;
    const newCompany = new Company({ name, founded, headquarters, sector, industry, info, revenuePerYear });
    const savedCompany = await newCompany.save();
    res.status(201).json(savedCompany); // Send JSON response with 201 Created status
    res.send(newCompany);
});

// API to get all users
app.get('/api/users', async (req, res) => {
    const users = await User.find();
    res.send(users);
});

// Get company data by name
app.get('/api/company', async (req, res) => {
    const name = req.query.name; // Search by company name
    const company = await Company.findOne({ name });
    res.send(company);
});


// Start server
const PORT = process.env.PORT || 5001;  // Use port from .env or default to 5000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
