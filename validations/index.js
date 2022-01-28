'use strict';

const validate = (
    payload,
    schema,
    throwError = true
) => {
    const { error } = schema.validate(payload);
    if (error && throwError) {
        throw error;
    }
    return error;
};
export default validate
