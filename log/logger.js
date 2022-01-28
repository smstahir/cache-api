'use strict';

import { format as _format, createLogger, transports as _transports } from 'winston';
import config from '../configurations/config.js';

const enumerateErrorFormat = _format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = createLogger({
  level: config.env === 'development' ? 'debug' : 'info',
  format: _format.combine(
    enumerateErrorFormat(),
    config.env === 'development' ? _format.colorize() : _format.uncolorize(),
    _format.splat(),
    _format.printf(({ level, message }) => `${level}: ${message}`)
  ),
  transports: [
    new _transports.Console({
      stderrLevels: ['error'],
    }),
  ],
  silent: config.env === 'test',
});

export default logger;