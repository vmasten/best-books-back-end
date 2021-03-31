'use strict';

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  name: {type: String},
  description: {type: String},
  status: {type: String}
});

const User = new mongoose.Schema({
  email: {type: String, required: true},
  books: [BookSchema]
});

const UserSchema = mongoose.model('Auth0User', User);

module.exports = UserSchema;