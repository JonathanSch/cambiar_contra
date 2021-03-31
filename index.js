require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(require('cors')());

app.set('view engine', 'ejs');

app.use('/website',express.static('public'));

app.use('/user',require('./routes'))

const {connect} = require('./database')
connect();

app.listen(port,err=>err?console.log(err):console.log('Server started'))