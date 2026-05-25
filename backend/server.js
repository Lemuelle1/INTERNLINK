const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// All API routes
app.use('/api', routes);

// Health check
app.get('/', (req, res) => res.json({ message: 'InternLink API running 🚀' }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
