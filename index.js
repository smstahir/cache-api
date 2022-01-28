import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import swaggerUI from 'swagger-ui-express';
import config from './configurations/config.js';
import logger from './log/logger.js';
import connection from './database/connection.js';
import DataRouter from './routes/data.route.js';
import { swaggerDocument } from './docs/swagger.js';
import { errorConverter, errorHandler } from './middlewares/error.js';

const PORT = config.port;
const app = express();

app.use(bodyParser.json());
app.use(helmet());

app.use('/v1/data', DataRouter);

app.use('/v1/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

// ambiguous routes or routes not found handler
app.use((req, res) => {
    return res.status(400).send('Route not found');
});

// universal error handler for API failures
app.use(errorHandler);
app.use(errorConverter);

var server
connection
    .then(() => {
        logger.info('Mongodb connected');
        server = app.listen(PORT, () => logger.info(`The web server is up and running at PORT ${PORT}`));
    })
    .catch(err => {
        console.log('Mongodb connection error: ', err.message);
    });

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

// used to check for unexpected errors throughout the application
process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});

export default app;