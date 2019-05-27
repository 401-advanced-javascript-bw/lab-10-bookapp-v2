'use strict';
// module.exports = (req, res, next) => {
//   let modelName = req.params.model.replace(/[^a-z0-9-_]/gi, '');
//   req.model = require(`../models/${modelName}/${modelName}-model.js`);
//   next();
// };

/**
 * Model Finder Middleware
 * @module middleware/model-finder
 */
module.exports = (req, res, next) => {
  console.log('hit model finder');
  const db = process.env.DATABASE === 'SQL' ? 'sql' : 'mongo';
  req.model = require(`../models/${db}/books/books-model.js`);
  next();
};
