const path = require('path');
const fs = require('fs');

const CURRENT_PATH = path.join(__dirname, './');
const FLAG = 'SCHEMA';

// read schema.js files
const readDirSync = (dir) => {
  return fs.readdirSync(dir)
    .reduce((files, file) => {
      if (fs.statSync(path.join(dir, file)).isDirectory()) {
        return files.concat(readDirSync(path.join(dir, file)));
      } else {
        if (file.toUpperCase().indexOf(FLAG) > -1 && dir !== CURRENT_PATH) {
          return files.concat(path.join(dir, file))
        } else {
          return files;
        }
      }
    },
    []);
}

// combineSchemas
const combineSchemas = () => {
  var queries = [];
  var mutations = [];
  var definitions = [];

  readDirSync(CURRENT_PATH).forEach((file) => {
    const schema = require(file);
    const { query, mutation, definition } = schema.default || schema;

    queries.push(query);
    mutations.push(mutation);
    definitions.push(definition);
  });

  return `
    schema {
      query: Query
      mutation: Mutation
    }
    type Query {
      ${queries.join('\n')}
    }
    type Mutation {
      ${mutations.join('\n')}
    }
    ${definitions.join('\n')}`;
}

module.exports = {
  schema: combineSchemas()
}