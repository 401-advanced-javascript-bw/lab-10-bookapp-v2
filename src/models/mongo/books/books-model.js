'use strict';
const schema = require('./books-schema.js');
const Model = require('../mongo-model.js');

class Books extends Model {}

module.exports = new Books(schema);
