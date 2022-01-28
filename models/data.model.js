'use strict';

import mongoose from 'mongoose';

const cacheSchema = mongoose.Schema(
  {
    key: {
      type: String,
      required: true
    },
    value: {
        type: String,
        required: true
    },
    ttl: {
        type: Date,
        required: true
    }
  },
  {
    versionKey: false,
    timestamps: true
  }
);

cacheSchema.index({key: 1}, {unique: true});
const Data = mongoose.model('Cache', cacheSchema);

export default Data;