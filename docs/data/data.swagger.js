'use strict';

const getAllKeys = {
    tags: ['Data'],
    description: "Returns all keys from the system ",
    operationId: 'getAllKeys',
    security: [
        {
            bearerAuth: []
        }
    ],
    responses: {
        "200": {
            description: "A list of data keys.",
            "content": {
                "application/json": {
                    schema: {
                        type: "array",
                        items: {
                            key: {
                                type: 'string',
                                description: 'data key'
                            }
                        }
                    }
                }
            }
        },
        "500":{
            description: "Internal server error",
        }
    }
}

const getValue = {
    tags: ['Data'],
    description: "Returns value against the key in the cache",
    operationId: 'getValue',
    parameters: [
        {
            name: 'key',
            in: 'path',
            description: 'data key',
            required: true,
            schema: {
                type: 'string'
            }
        }
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    responses: {
        "200": {
            description: "Return value against the key in the cache.",
            "content": {
                "application/json": {
                    schema: {
                        type: "string",
                        item: {
                            key: {
                                type: 'string',
                                description: 'data value'
                            }
                        }
                    }
                }
            }
        },
        "204": {
            description: "Return generated random value against the key saved in the cache and return.",
            "content": {
                "application/json": {
                    schema: {
                        type: "string",
                        item: {
                            key: {
                                type: 'string',
                                description: 'data value'
                            }
                        }
                    }
                }
            }
        },
        "400": {
            description: "Bad request",
        },
        "500":{
            description: "Internal server error",
        }
    }
}

const createData = {
    tags: ['Data'],
    description: "Save data against the key in the cache",
    operationId: 'getAllKeys',
    requestBody: {
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    properties: {
                        key: {
                            type: 'string',
                            description: 'data key'
                        },
                        value: {
                            type: 'string',
                            description: 'data value'
                        }
                    }
                }
            }
        }
    },
    security: [
        {
            bearerAuth: []
        }
    ],
    responses: {
        "201": {
            description: "Data record created",
        },
        "405": {
            description: "Invalid input",
        }
    }
}

const deleteKey = {
    tags: ['Data'],
    description: "Delete a key from the cache",
    operationId: 'deleteKey',
    parameters: [
        {
            name: 'key',
            in: 'path',
            description: 'data key',
            required: true,
            schema: {
                type: 'string'
            }
        }
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    responses: {
        "204": {
            description: "Data record deleted",
        },
        "500":{
            description: "Internal server error",
        }
    }
}

const deleteAllKeys = {
    tags: ['Data'],
    description: "Delete all keys from the cache",
    operationId: 'deleteAllKeys',
    security: [
        {
            bearerAuth: []
        }
    ],
    responses: {
        "204": {
            description: "All keys records deleted",
        },
        "500":{
            description: "Internal server error",
        }
    }
}

export { getAllKeys, getValue, createData, deleteKey, deleteAllKeys }