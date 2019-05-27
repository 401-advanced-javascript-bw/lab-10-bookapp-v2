'use strict';

const mongoose = require('mongoose');

const bookshelves = mongoose.Schema({
  bookshelf: { type: String, require: true }
});

module.exports = mongoose.model('bookshelves', bookshelves);
