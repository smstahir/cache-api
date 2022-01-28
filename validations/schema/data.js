'use strict';

import Joi from 'joi';

const createCacheRecordPayload = Joi.object({
  key: Joi.string().required(),
  value: Joi.string().required()
});

const getValuePayload = Joi.object({
  key: Joi.string().required()
})

export {
  createCacheRecordPayload,
  getValuePayload
}