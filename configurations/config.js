'use strict';

import dotenv from 'dotenv';
dotenv.config();

const config = {
    env: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 8000,
    mongodbUrl: process.env.MONGODB_URL || 'mongodb://localhost:27017/cache',
    maxCacheLimit: process.env.TOTAL_CACHE_LIMIT || 10,
    timeToLive: process.env.TTL_MILLISECOND || '600000' // 1 minute
};

export default config;