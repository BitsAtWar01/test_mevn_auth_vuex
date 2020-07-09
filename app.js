const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const passport = require('passport');

//Initialize the app
const app = express();

//Middlewares
//Form Data Middleware
app.use(bodyParser.urlencoded({
    extended: false
}));
//Json Body Middleware
app.use(bodyParser.json());
//CORS Middleware
app.use(cors());
//Serving Up the Static Directory
app.use(express.static(path.join(__dirname, 'public')));

//Use Passport Middleware
app.use(passport.initialize());
//Bring in the strategy
require('./config/passport')(passport);

//Bring in the Database Config and connect with the database
const db = require('./config/keys').mongoURI;
mongoose.connect(db, { 
    useNewUrlParser: true,
    useUnifiedTopology: true 
}).then(() => {
    console.log(`Database connected successfully ${db}`)
}).catch(err => {
    console.log(`Unable to connect to the database ${err}`)
});

//Users Route
const users = require('./routes/api/users');

app.use('/api/users', users);

//Handling other requests to the SPA
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})