## Cache REST API
The assignment was to develop a REST API that exposes methods to interact with a cache mongodb database.

# Environment vars
This project uses the following environment variables:

| Name                          | Description                         | Default Value                                  |
| ----------------------------- | ------------------------------------| -----------------------------------------------|
|PORT           			        	| PORT on which server will be live	  | 3000										                       |
|MONGODB_URL           			    | Database URL                		    | mongodb://localhost:27017/cache     				   |
|TOTAL_CACHE_LIMIT           	  | the maximum amount of cached items	| 10                    											   |
|TTL_MILLISECOND           		  | Time To Live the cache key					| 100000										                     |
 ----------------------------------------------------------------------------------------------------------------------

# Pre-requisites
- Install [Node.js](https://nodejs.org/en/)  v16.13.0
- Mongodb
- Mongodb should be up and running
- install project packages by running npm i in CLI

# Getting started
- npm i
- npm run dev (to run the project in development mode)
- npm run start (to start the project)
- npm run test (to run unit test cases)
### Structure of the Project (Inspired from my current company's boilerplate)
I have divided the project into the following folders/structure:
* Configurations
	* This folder contains everything related to configuration of the whole application
* Controllers
	* This folder contains all the business logics and the interaction between routes and database queries 
* Database
	* This folder contains database connection logic
* Docs
  * This folder contains documentation logic, documented in Swagger
* Log
  * This folder contains messages logging logic
* Middlewares
  * This folder contains error handling logic through out the app
* Models
	* Contains the database models/schema
* Routes
	* Controls the routing logic
* Tests
  * The folder contains all the test units
* Utils
  * The folder contains some helping functions
* Validations
  * The folder contains validation related logics and implementations
  
### API documentation
* After running the application, you can go to the link i.e. localhost:{port}/v1/api-docs