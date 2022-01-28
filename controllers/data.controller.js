'use strict';

import { Chance } from 'chance'
import Data from '../models/data.model.js';
import config from '../configurations/config.js';
import logger from '../log/logger.js';
import validate from '../validations/index.js';
import { getValuePayload, createCacheRecordPayload } from '../validations/schema/data.js';

// Constants
const maxCacheLimit = config.maxCacheLimit;
const TTL = parseInt(config.timeToLive);

var chance = new Chance();

// A route that returns a list of all the keys in an array
const getAllKeys = async (req, res, next) => {
    try {
        const records = await Data.find({}).select('key -_id').lean();
        const keys = records.map((record) => record.key); 
        return res.status(200).send({ success: true, data: keys });
    } catch (err) {
        logger.error('Error in getting all keys: ', err);
        next(err);
    }
}

// A route to create a record in the cache database - 'key' and 'value' are required parameters
const createRecord = async (req, res, next) => {
    try {
        validate(req.body, createCacheRecordPayload)
        const result = await createCacheRecord(req.body);
        const { status, data, error } = result;
        if (status === 400) {
            return res.status(status).send({ success: false, error: error });
        }
        return res.status(status).send({ success: true, data: data });
    } catch (err) {
        logger.error('Error in creating cache record: ', err);
        if (err.name === 'ValidationError') {
            err.statusCode = 400;
            next(err);
        }
        next(err);
    }
}

// Route to delete all the keys from the cache
const deleteAllKeys = async (req, res, next) => {
    try {
        await Data.deleteMany({});
        return res.status(204).end();
    } catch (err) {
        logger.error('Error in deleting all keys: ', err);
        next(err);
    }
}

// Route to delete one key from the cache
const deleteKey = async (req, res, next) => {
    try {
        const key = req.params.key;
        await Data.deleteOne({ key: key });
        return res.status(204).end();
    } catch (err) {
        logger.error('Error in deleting one key: ', err);
        next(err);
    }
}

// Return cached data for a given key
const getValue = async (req, res, next) => {
    try {
        validate(req.params, getValuePayload)
        const key = req.params.key;
        const data = await Data.findOne({ key: key, ttl: { $gt: Date.now() } });
        if (!data) {
            logger.info('Cache miss');
            const value = chance.word({ length: 10, capitalize: true }); //generating a random value
            const dataObject = {
                key,
                value
            };
            const result = await createCacheRecord(dataObject);
            const { status, data, error } = result;
            if (status === 204) {
                return res.status(204).send({ success: true, data: data });
            }
            if (status === 400) {
                return res.status(status).send({ success: false, error: error });
            }
            return res.status(status).send({ success: true, data: data });
        }
        logger.info('Cache hit');
        await Data.findOneAndUpdate({ key: key }, { $set: { ttl: Date.now() + TTL } }, { new: true, useFindAndModify: false });
        return res.status(200).send({ success: true, data: data });
    } catch (err) {
        logger.error('Error in getting value: ', err);
        if (err.name === 'ValidationError') {
            err.statusCode = 400;
            next(err);
        }
        next(err);
    }
}


// this function is used to update the least used record in the cache database whenever maxCacheLimit is reached
const updateLeastUsedEntry = async (data) => {
    try {
        const count = await Data.countDocuments({});
        logger.info(`Record count:  ${count}`);
        if(count < maxCacheLimit) return;

        const leastUsedRecord = await Data.findOne({}, {}, { sort: { 'updatedAt': 1 } });
        logger.info(`Least used record:  ${leastUsedRecord}`);
        const updatedCacheRecord = await Data.findOneAndUpdate({ key: leastUsedRecord.key }, { $set: { key: data.key, value: data.value, ttl: data.ttl } }, { new: true, useFindAndModify: false });
        return { status: 201, data: updatedCacheRecord.value };
    } catch (err) {
        logger.error('Error in deleting least used record: ', err);
        throw new Error(err);
    }
}

// function to create a record in the cache if the key is not present in the cache then it will create a new record
// else it will update the existing record value and ttl
const createCacheRecord = async (payloadObject) => {
    try {
        const { key, value } = payloadObject;
        validate(payloadObject, createCacheRecordPayload)

        //find data in the cache if any
        const data = await Data.findOne({ key });
        if (!data) {
            const ttl = Date.now() + TTL;
            const dataObject = {
                key,
                value,
                ttl
            }
            const updatedValue = await updateLeastUsedEntry(dataObject);
            if (updatedValue) {
                return { status: updatedValue.status, data: updatedValue.data };
            }
            const createdCacheRecord = await Data.create({ key, value, ttl });
            return { status: 201, data: createdCacheRecord.value };
        } else {
            const updatedCacheRecord = await Data.findOneAndUpdate({ key: key }, { $set: { value: value, ttl: Date.now() + TTL } }, { new: true, useFindAndModify: false });
            return { status: 204, data: {
                key:updatedCacheRecord.key,
                value:updatedCacheRecord.value
            } };
        }
    } catch (err) {
        logger.error('Error in creating cache record: ', err);
        throw new Error(err);
    }
}

export {
    getAllKeys, createRecord,
    deleteAllKeys, deleteKey, getValue
};