'use strict';

const schema = require('./bookshelves-schema.js');
const Model = require('../mongo-model.js');

class Bookshelves extends Model {}

module.exports = new Bookshelves(schema);
