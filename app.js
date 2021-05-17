const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
dotenv = require('dotenv').config();

const app = express();
const authRoute = require('./routes/auth');

app.use(cors());
app.use(bodyParser.json());

app.use('/auth', authRoute);

app.use((err, req, res, next) => {
    const { data, message, statusCode } = err;
    const status = statusCode || 500;
    res.status(status).send({ message, data });
})

mongoose.connect(process.env.DATABASE_URI)
.then(() => {
    let port = process.env.PORT || 8000;
    app.listen(port, () => {
            console.log(`Server is up on port ${port}`);
        })
    })
    .catch(err => {
        console.log(err);
    });