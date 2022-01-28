'use strict';

import {
    describe, it, before, after
} from 'mocha';

import Data from '../../models/data.model.js';
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../../index.js';

chai.expect()
chai.should()

chai.use(chaiHttp);

describe('Cache API routes', async () => {
    before(async () => {
        try {
            await Data.deleteMany();
        } catch (err) {
            throw new Error(err);
        }
    });

    after(async () => {
        try {
            await Data.deleteMany();
        } catch (err) {
            throw new Error(err);
        }
    });

    describe('/v1/data/keys route', async () => {
        it('should return an empty array of keys', async () => {
            try {
                const response = await chai.request(app).get('/v1/data/keys');
                response.body.should.be.eql({ "success": true, "data": [] })
                response.status.should.be.eql(200);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should delete all the keys in the cache', async () => {
            try {
                const response = await chai.request(app).delete('/v1/data/keys');
                response.status.should.be.eql(204);
            } catch (err) {
                throw new Error(err);
            }
        });
        chai.should();

        it('should return a 400 route not found error', async () => {
            try {
                const response = await chai.request(app).put('/v1/data/keys');
                response.text.should.be.eql('Route not found');
                response.status.should.be.eql(400);
            } catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('/v1/data route', async () => {
        it('should create a record in the cache', async () => {
            try {
                const dummyObject = {
                    key: 'Key-1',
                    value: 'Value-1'
                };
                const response = await chai.request(app).post('/v1/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                expect(response.body.data).equal("Value-1");
                response.should.have.status(201);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should update the value if the key already exists', async () => {
            try {
                const dummyObject = {
                    key: 'Key-1',
                    value: 'Value-1-updated'
                };
                const response = await chai.request(app).post('/v1/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                response.should.have.status(204);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should throw a 400 error if required fields are not provided', async () => {
            try {
                const dummyObject = {
                    key: 'Value-1'
                };
                const response = await chai.request(app).post('/v1/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                expect(response.body.message).equal("\"value\" is required");
                response.should.have.status(400);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should throw a 400 error if the data type is not string type', async () => {
            try {
                const dummyObject = {
                    key: 123,
                    value: {
                        data: 'abc'
                    }
                };
                const response = await chai.request(app).post('/v1/data')
                    .set('content-type', 'application/json')
                    .send(dummyObject);
                expect(response.body.message).equal("\"key\" must be a string");
                response.should.have.status(400);
            } catch (err) {
                throw new Error(err);
            }
        });
    });

    describe('/v1/data/keys/:key route', async () => {
        it('should return a random string if the key does not exist', async () => {
            try {
                const response = await chai.request(app).get('/v1/data/keys/key-1');
                response.should.have.status(201);
                response.body.success.should.be.true;
                response.body.data.should.be.a('string');
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should return a value if the key exist', async () => {
            try {
                // Key-1 in the previous test
                const response = await chai.request(app).get('/v1/data/keys/AB-1');
                expect(response.body.success).equal(true);
                response.status.should.be.eql(201);
            } catch (err) {
                throw new Error(err);
            }
        });

        it('should return a 400 route not found error', async () => {
            try {
                const response = await chai.request(app).put('/v1/data/keys/1');
                response.text.should.be.eql('Route not found');
                response.status.should.be.eql(400);
            } catch (err) {
                throw new Error(err);
            }
        });
    });
});