'use strict';

import config from '../configurations/config.js';
import { deleteAllKeys, deleteKey, getAllKeys, createData, getValue } from './data/data.swagger.js';

const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'cache-rest-api Document',
        description: 'your description here',
        contact: {
            name: 'Shah Tahir',
            email: 'smstahir@gmail.com'
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    servers: [
        {
            url: `http://localhost:${config.port}`,
            description: 'Local server'
        }
    ],
    tags: [
        {
            name: 'Data',
            description: 'Data operations'
        }],
    paths: {
        '/v1/data': {
            post: createData
        },
        '/v1/data/keys': {
            get: getAllKeys,
            delete: deleteAllKeys
        },
        '/v1/data/keys/{key}': {
            get: getValue,
            delete: deleteKey,
        },
    }
}

export { swaggerDocument }