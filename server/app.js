'use strict';

/* import modules */
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const api = require('./routes');
const path = require('path');
const rootPath = path.normalize(`${__dirname}/..`);
require('dotenv').config();

const app = express();

/* configure middleware */
app.set('appPath', path.join(rootPath, 'client'));
app.set('adminPath', path.join(rootPath, 'admin'));
app.use(express.static('./client'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

/* setup routing */
app.use('/api', api);
app.get('*', (req, res) => {
  console.log("clientroute")
  res.sendFile(path.resolve(`${app.get('appPath')}/index.html`));
});


/* export app */
module.exports = app;
