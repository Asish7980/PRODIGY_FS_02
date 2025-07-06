const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

dotenv.config();

const app = express(); // ✅ This must come before using app

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
  console.log('Connected to MySQL');
});
