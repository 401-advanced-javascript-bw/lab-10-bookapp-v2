'use strict';

const mongoose = require('mongoose');
require('mongoose-schema-jsonschema')(mongoose);

const bookshelves = mongoose.Schema(
  {
    bookshelf: { type: String, require: true }
  },
  { toObject: { virtuals: true }, toJSON: { virtuals: true } }
);

bookshelves.virtual('books', {
  ref: 'books',
  localField: 'bookshelf',
  foreignField: 'bookshelf',
  justOne: false
});

bookshelves.pre('find', function() {
  try {
    this.populate('books');
  } catch (e) {
    console.log('Find Error', e);
  }
});

module.exports = mongoose.model('bookshelves', bookshelves);
