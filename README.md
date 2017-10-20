# Plenuum Backend by hipteam

## `Rules of development`

- No commits without tests!
- Do not push directly to master!
- Please use "feature", "task" or "bugfix" branches. For example: "feature/my_awesome_new_feature"
- Keep the API document up-to-date
- If you're done, create a pull/merge request (PR) and assign it to an other developer

## Getting Started
These instructions will get you a copy of the project up and running on your 
local machine for development and testing purposes.

### Prerequisites
This is a NodeJS project so in order to run in on your machine you will need to
install NodeJS. For this please check out [this website](https://docs.npmjs.com/getting-started/installing-node):

### Installing
In your root directory simply call
```
npm install
```

### Environment types
We have different environment types to run different configurations.

- Development (dev): 	For local development
- Test (test): 			For CI to run automated tests
- Staging (staging): 	Runs on an actual server, identical to the production server, only for end-to-end testing with clients
- Production (prod): 	Uses production database, 3rd party services, etc.


## Running the application

```
npm run start-dev
```

`WARNING: You never ever run any other environment on your machine!`

## Testing

For testing we are using [Mocha](https://mochajs.org/) test runner. You can find all the test files in "src/test".

### Running the tests

#### Run it using npm command

This way you can run all the tests in your terminal. Also this will generate a coverage report, which can be found in the "coverage" folder.

```
npm test
```

#### Run it using Webstorm

Webstorm supports Mocha out of the box. To use it you need to add a new Run configuration to your project.

Make sure you added an environment variable: 
```
NODE_ENV=dev
```

User interface must be:
```
tdd
```

Set the "Extra Mocha options" to this
```
--compilers ts-node/register --require source-map-support/register --recursive
```

## Deployment
### `TBD`

## Versioning
We use [SemVer](http://semver.org/) for versioning. For the versions available, 
see the [tags on this repository](https://gitlab.com/hipteam/project/plenuum/plenuum-backend-v2/tags). 

## Documents

### API

We are using apidoc for API document generation. This generated document can be under "docs/api".
It is essential to keep this document up-to-date so it is **mandatory** to be updated after evey change.

To generate this docuement run the following

```
npm run generate-api-docs
```

#### Mandatory
- HTTP Method + URL endpoint + Title
- API version (see Versioning)
- API Name
- API Group
- Header paramaters (if has any)
- Body parameters (if has any)
- URL parameters (if has any)

#### Optional
- Success example
- Error example

### Extra

You can find extra documentation inside the "docs" folder.

- groups: There's a "mock_groups_diagram.xml" draw.io document, which describes the current state of our mock groups.
Whenever you change the "groups.json", please make sure you update this document as well.


## Installation for client developers
As a client (frontend, mobile app, etc.) developer you might not want to install all of the necessary components
on your local machine just to be able to test. For you there's a faster and easier way to run the backend and all it's
dependencies.

### Requirements
In order to use this installation method you need to have Docker preinstalled on you machine.
If you don't have it yet please go to the [Docker website](https://docs.docker.com/engine/installation/) and install it.
Make sure you install the latest and Stable version.

### Usage
First of all check Docker. Open a terminal window and type:
```
docker version
```
Your version should be 17.09.0-ce or newer. Then check docker-compose:
```
docker-compose -v
```
This one should be 1.16.1 or newer.

If you have both of them installed then navigate to your work directory. Check if you can see a "docker-compose.yml" file.
Use the 
```
docker-compose up -d
``` 
command to start the backend.
Your local backend should be up and running in a few seconds at ```localhost:5000```
To stop your local server simply type: 
```
docker-compose down
```

If you want to connect to your local database then you'll need a client application like [Robo 3T](https://robomongo.org/)
Your local MongoDB is accessable at ```localhost:27017``` no authorization needed.