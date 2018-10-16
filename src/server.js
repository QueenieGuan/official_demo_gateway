const express = require('express');
const request = require('request');
const graphqlHTTP = require('express-graphql');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('graphql-tools');
const log4js = require('log4js');
const bodyParser = require('body-parser');

const { schema } = require('./graphql/schema');
const { resolver } = require('./graphql/resolver');
const dbPool = require('./provider/db/dbPool').getInstance();
const { serverConfig, logConfig } = require('./config');

/* set logger config */
log4js.configure(logConfig);
const logger = log4js.getLogger('server.js');

/* set the default host and port */
const port = serverConfig.port;
const host = serverConfig.host;
if (!port || !host) {
  throw new Error('Host or Port is not set, please check.');
}

/* create database pools when server starting */
dbPool.createDBPools();

/* create http server */
const server = express();

/* build graphql schema */
const gSchema = makeExecutableSchema({ typeDefs: schema, resolvers: resolver });

/* body parse to json */
server.use(bodyParser.json());

/**
 * graphql request
 */
server.post('/', (req, res) => {
  let pipe = req.pipe(request.post(host + '/graphqlHttp', {
    json: true,
    body: {
      ...req.body,
      variables: {
        ...req.body.variables,
      }
    }
  }), { end: false });

  let responseData = '';
  pipe.on('data', (data) => {
    responseData += data;
  })

  pipe.on('end', () => {
    let response = JSON.parse(responseData);

    logger.info(`[Graphql Response Data]: ${JSON.stringify(response)}`);

    res.json(response);
  });
})

/**
 * graphql request implement
 */
server.post('/graphqlHttp', (req, res) => {
  logger.info(`[graphqlHttp req body]:${JSON.stringify(req.body)}`)
  graphqlHTTP({
    schema: gSchema,
    graphiql: false,
    formatError: (error) => {
      let formatErr = {
        message: error.message,
        locations: error.locations,
        stack: error.stack ? error.stack.split('\n') : [],
        path: error.path
      }

      logger.error(`[Graphql POST Error]: ${JSON.stringify(formatErr)}`);
      return formatErr;
    }
  })(req, res);
});

/**
 * logger all request params
 */
server.use((req, res, next) => {
  logger.info(`[Graphql Request Parameters]: ${JSON.stringify(req.body)}, path: ${req.path}`);
  next();
});

/**
 * provide ping service
 */
server.get('/ping', (req, res) => {
  logger.info('Gateway Ping Successfully!');
  res.sendStatus(200);
});

/**
 * Catch all response errors
 */
server.use((err, req, res, next) => {
  logger.error(`[Graphql Response Error]: ${err.stack}`);
  res.status(500).send({ error: err });
})

/* server listening */
server.listen(port, () => {
  logger.info(`Http Server is running at [ Port:${port} ],\
  current environment is [ ${process.env.NODE_ENV} ].`);
});

/* All uncaughtException handle */
process.on('uncaughtException', (err) => {
  logger.error(`System Uncaught exception: ${err}`);
});

