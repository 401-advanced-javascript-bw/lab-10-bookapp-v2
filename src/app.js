'use strict';

// Application Dependencies
const express = require('express');
// const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const router = require('./api/v1.js');
const notFound = require('../src/middleware/404.js');
const handleError = require('../src/middleware/500.js');

// Application Setup
const app = express();
app.set('view engine', 'ejs');

// Application Middleware
// app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));

app.use(router);
app.use(notFound);
app.use(handleError);

app.use(
  methodOverride((request, response) => {
    if (
      request.body &&
      typeof request.body === 'object' &&
      '_method' in request.body
    ) {
      // look in urlencoded POST bodies and delete it
      let method = request.body._method;
      delete request.body._method;
      return method;
    }
  })
);

let start = (port = process.env.PORT) => {
  app.listen(port, () => {
    console.log(`Server Up on ${port}`);
  });
};

module.exports = {
  start
};
