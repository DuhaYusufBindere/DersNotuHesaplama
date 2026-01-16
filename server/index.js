const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { sequelize } = require('./models');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Basic Route
app.get('/', (req, res) => {
    res.json({ message: 'University Grade Calculator API' });
});

// Import Routes
const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

// Sync Database and Start Server
sequelize.sync({ alter: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
