'use strict';

import mongoose from 'mongoose';
import http from 'http-status';
import config from '../configurations/config.js';
import logger from '../log/logger.js';
import ApiError from '../utils/apiError.js';

const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode || error instanceof mongoose.Error ? http.BAD_REQUEST : http.INTERNAL_SERVER_ERROR;
        const message = error.message || http.httpStatus[statusCode];
        error = new ApiError(statusCode, message, false, err.stack);
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config.env === 'production' && !err.isOperational) {
        statusCode = http.INTERNAL_SERVER_ERROR;
        message = http.httpStatus[http.INTERNAL_SERVER_ERROR];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(config.env === 'development' && { stack: err.stack }),
    };

    if (config.env === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

export {
    errorConverter,
    errorHandler,
};