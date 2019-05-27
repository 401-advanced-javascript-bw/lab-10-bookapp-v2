'use strict';

const mongoose = require('mongoose');

require('mongoose-schema-jsonschema')(mongoose);

const books = mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true },
  image_url: { type: String },
  description: { type: String }
});

module.exports = mongoose.model('books', books);
