'use strict';

import mongoose from 'mongoose';

import config from '../configurations/config.js';
mongoose.Promise = global.Promise;

const connection = mongoose.connect(config.mongodbUrl, { useNewUrlParser: true, useUnifiedTopology: true });

export default connection;