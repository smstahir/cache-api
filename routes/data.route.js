'use strict';

import express from 'express';
const dataRouter = express.Router();

import {
    getAllKeys, createRecord, deleteAllKeys,
    deleteKey, getValue
} from '../controllers/data.controller.js';


// Route to creates/updates the data for a given key
dataRouter.route('/').post(createRecord)

// Route to get all the keys from the cache
dataRouter.route('/keys').get(getAllKeys)

// Route to delete all the keys from the cache
dataRouter.route('/keys').delete(deleteAllKeys)

// Route to get the value for a given key
dataRouter.route('/keys/:key').get(getValue)

// Route to delete one key from the cache
dataRouter.route('/keys/:key').delete(deleteKey)

export default dataRouter;