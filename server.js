'use strict';

const express = require('express');
require('dotenv').config();
const cors = require('cors');

const mongoose = require('mongoose');
const User = require('./models/Schema')

mongoose.connect(process.env.MONGO_SERVER, {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();
app.use(express.json());
app.use(cors());

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('db on and connected');
});

const vince = new User({
  email: 'vinnie1023@gmail.com',
  books: [{name: 'Jurassic Park', description: 'dinos take over', status: 'read'}, 
          {name: 'Watchmen', description: 'superheroes are real and terrible', status: 'read'},
          {name: 'The Midnight Library', description: 'what if all your regrets were catalogued', status: 'currently reading'}]
});
vince.save();

app.get('/', (req, res) => res.send("heyo"));
app.get('/books', getBooks);
app.post('/books', createBook)

async function getBooks(request, response) {
  const email = request.query.email;
  await User.find({email: email}, function (err, items) {
    if (err) return console.error(err);
    response.status(200).send(items[0].books);
  })
}

async function createBook(request, response) {
  const { email, name, description, status } = request.body;
  const newBook = {name: name, description: description, status: status}
  
  User.findOne({ email }, (err, item) => {
    if(err) return console.error(err);
    item.books.push(newBook);
    item.save();
    response.status(200).send(item.books);
  })
}

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`server up on ${PORT}`));


