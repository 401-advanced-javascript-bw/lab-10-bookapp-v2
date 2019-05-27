'use strict';

require('dotenv').config();
const mongoose = require('mongoose');
const pg = require('pg');

const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true
};

let client;
if (process.env.DATABASE === 'mongo') {
  mongoose.connect(process.env.MONGODB_URI, mongooseOptions);
  console.log('MONGODB');
} else if (process.env.DATABASE === 'SQL') {
  client = new pg.Client(process.env.DATABASE_URL);
  client.connect(err =>
    err ? console.log(`Error: ${err}`) : console.log(`SQL database`)
  );
  client.on('error', err => console.error(err));
}

require('./src/app.js').start(process.env.PORT);
