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
