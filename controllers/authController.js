const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppUser } = require('../model/userModel');


async function signUp(req, res) {
    try {
        let { email, password, role } = req.body;
        email = email.toLowerCase();
        const existingUser = await AppUser.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new AppUser({
            email,
            password: hashedPassword,
            role,
        });

        // Save the user to the database
        await newUser.save();

        const token = jwt.sign({ email: newUser.email, userId: newUser._id, role: newUser.role }, process.env.JWT_SECRET, { expiresIn: '24h' });

        res.status(201).json({ message: 'User created successfully', user: newUser, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await AppUser.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ error: 'Wrong Email/Password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ email: user.email, userId: user._id, role: user.role }, process.env.JWT_SECRET);

        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { signUp, login };
