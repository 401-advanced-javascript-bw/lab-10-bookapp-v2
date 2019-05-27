'use strict';

require('dotenv').config();

// Application Dependencies
const express = require('express');
// const pg = require('pg');
const methodOverride = require('method-override');
const cors = require('cors');
const morgan = require('morgan');

// Application Setup
const app = express();

// Application Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cors());
app.use(morgan('dev'));

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
  app,
  start
};
