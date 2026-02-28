require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const db = require('./db');

app.use(cors());

const bodyparser = require('body-parser');
app.use(bodyparser.json());
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRouter = require('./routes/candidateRoutes');
app.use('/user', userRoutes);
app.use('/candidate', candidateRouter);

// Serve React frontend static files
app.use(express.static(path.join(__dirname, '..', 'frontend', 'dist')));

// SPA fallback — serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
