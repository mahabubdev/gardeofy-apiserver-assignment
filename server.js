const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config(); // parsed .env file

// express init
const app = express();

// all core middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('*', cors());    // CORS enabled for APIs
app.use(require('./routes'));   // App routers

// database connection
mongoose.connect(
    `${process.env.DB_URL}`, 
    {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true
    }
)
.then(() => console.log(`Database (mongoDB) is connected`))
.catch((err) => console.log(err))



// HTTP server
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server is running at ${port}`))