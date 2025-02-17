const express = require('express');
const { connectDB } = require('./src/config/db');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require("path");
const swaggerDocs = require("./src/config/swaggerConfig");

const app = express();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use("/assets", express.static(path.join(__dirname, "/src/assets")));

app.use('/api/movies', require('./src/routes/movies'));
app.use('/api/users', require('./src/routes/users'));
app.use('/api/permissions', require('./src/routes/admin'));

swaggerDocs(app);

const PORT = 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));