const merge = require('deepmerge');
const path = require('path');
const fs = require('fs');

const CURRENT_PATH = path.join(__dirname, './');
const FLAG = 'RESOLVER';

// read resolver.js files
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

// combine all resolvers
const combineResolvers = () => {
  let resolvers = readDirSync(CURRENT_PATH).map((file) => {
    let resolver = require(file);
    return resolver.default || resolver;
  });

  return merge.all(resolvers);
}

module.exports = {
  // merge resolver
  resolver: combineResolvers()
}