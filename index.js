const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes')
const fileRoutes = require('./routes/fileRoutes')
const userRoutes = require('./routes/userRoutes')

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: "cloud-storage"
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
})

// routes
app.use('/auth', authRoutes);
app.use('/', fileRoutes);
app.use('/', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});
