const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { application, json } = require('express');
const { register, login, changePassword } = require('./controllers/auth');
const post = require('./routes/post')
const dotenv = require('dotenv');
const auth = require('./routes/auth');

// Load env vars
dotenv.config({
  path: './config/config.env',
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

mongoose.connect(
  'mongodb://localhost:27017/blogappDB',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log('DB connected');
    /*   app.post('/registration', register);
    app.post('/login', login); */
    app.use('/auth', auth);
    app.use('/post',post);
    app.listen(5000);
  }
);
