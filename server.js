require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./db');

const bodyparser = require('body-parser');
app.use(bodyparser.json());
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const candidateRouter = require('./routes/candidateRoutes');
app.use('/user', userRoutes);
app.use('/candidate', candidateRouter);

app.listen(PORT, () => {
    console.log('listening on port 3000');
});
