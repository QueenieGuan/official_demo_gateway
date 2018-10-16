const logger = require('log4js').getLogger('mysql -> sqlConvertor.js');

/**
 * recursive for query.where
 * @param {Object} filter 
 */
const filterRecursive = (filter) => {
  var res = '';
  var sqlParams = [];
  for (let i = 0; i < filter.length; i++) {
    if (filter[i].type === 'atom') {
      switch (filter[i].expression) {
        case 'eq':
          res = res + filter[i].field + ' = ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'not eq':
          res = res + filter[i].field + ' != ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'ge':
          res = res + filter[i].field + ' >= ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'gt':
          res = res + filter[i].field + ' > ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'lt':
          res = res + filter[i].field + ' < ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'le':
          res = res + filter[i].field + ' <= ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'in':
          var invalue = '('
          for (let j = 0; j < filter[i].value.length; j++) {
            invalue = invalue + '?';
            sqlParams = sqlParams.concat([filter[i].value[j]]);
            if (j !== (filter[i].value.length - 1)) {
              invalue = invalue + ',';
            }
          }
          invalue = invalue + ')';
          res = res + filter[i].field + ' in ' + invalue;
          break;
        case 'not in':
          var notinvalue = '('
          for (let j = 0; j < filter[i].value.length; j++) {
            notinvalue = notinvalue + '?';
            sqlParams = sqlParams.concat([filter[i].value[j]]);
            if (j !== (filter[i].value.length - 1)) {
              notinvalue = notinvalue + ',';
            }
          }
          notinvalue = notinvalue + ')';
          res = res + filter[i].field + ' not in ' + notinvalue;
          break;
        case 'between':
          res = res + '(' + filter[i].field + ' between ' + '?' + ' and ' + '?' + ')';
          sqlParams = sqlParams.concat([filter[i].value[0]]);
          sqlParams = sqlParams.concat([filter[i].value[1]]);
          break;
        case 'not between':
          res = res + '(' + filter[i].field + ' not between ' + '?' + ' and ' + '?' + ')';
          sqlParams = sqlParams.concat([filter[i].value[0]]);
          sqlParams = sqlParams.concat([filter[i].value[1]]);
          break;
        case 'like':
          res = res + filter[i].field + ' like ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'not like':
          res = res + filter[i].field + ' not like ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'is':
          res = res + filter[i].field + ' is ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'is not':
          res = res + filter[i].field + ' is not ' + '?';
          sqlParams = sqlParams.concat(filter[i].value);
          break;
        case 'exp':
          break;
      }

      if (i !== (filter.length - 1)) {
        if (filter[i].logic) {
          res = res + ' ' + filter[i].logic + ' ';
        } else {
          res = res + ' ' + 'and' + ' ';
        }
      }

    } else if (filter[i].type === 'complex') {
      filter[i].filters.forEach(e => { e['logic'] = filter[i]['logic'] })
      res = res + '( ' + filterRecursive(filter[i].filters).res + ' )';
      sqlParams = sqlParams.concat(filterRecursive(filter[i].filters).sqlParams);
      res = res + ' ' + 'and' + ' ';
    }
  }
  return { res, sqlParams };
}

/**
 * convert protocol to mysql clause.
 * @param {object} protocol 
 */
const sqlConvertor = (protocol) => {
  var sql = '';
  var sqlParams = [];
  if (protocol.operation) {
    const operation = protocol.operation;
    if (operation === 'select') {
      sql = sql + 'SELECT ';
    } else if (operation === 'update') {
      sql = sql + 'UPDATE ';
    }
    else if (operation === 'delete') {
      sql = sql + 'DELETE ';
    }
    else if (operation === 'insert') {
      sql = sql + 'INSERT INTO ';
    }
  }
  switch (protocol.operation) {
    case 'select':
      if (protocol.fields) {
        const fields = protocol.fields;
        for (let i = 0; i < fields.length; i++) {
          sql = sql + fields[i];
          if (i !== (fields.length - 1)) {
            sql = sql + ', ';
          }
        }
      }
      if (protocol.from) {
        const from = protocol.from;
        sql = sql + ' FROM ' + from;
      }
      if (protocol.where) {
        const where = protocol.where;
        sql = sql + ' WHERE ' + filterRecursive(where).res;
        sqlParams = sqlParams.concat(filterRecursive(where).sqlParams);
      }
      if (protocol.group) {
        const group = protocol.group;
        sql = sql + ' GROUP BY ';
        for (let i = 0; i < group.length; i++) {
          sql = sql + group[i];
          if (i !== (group.length - 1)) {
            sql = sql + ', ';
          }
        }
      }
      if (protocol.having) {
        const having = protocol.having;
        sql = sql + ' HAVING ' + '(' + filterRecursive(having).res + ')';
        sqlParams = sqlParams.concat(filterRecursive(having).sqlParams);
      }
      if (protocol.order) {
        const order = protocol.order;
        sql = sql + ' ORDER BY ';
        for (let i = 0; i < order.length; i++) {
          sql = sql + order[i].field + ' ' + order[i].type;
          if (i !== (order.length - 1)) {
            sql = sql + ', ';
          }
        }
      }
      if (protocol.limit) {
        const limit = protocol.limit;
        var page = limit.page;
        if (page <= 0) {
          page = 1;
        }
        sql = sql + ' LIMIT ' + ((page - 1) * limit.pageSize) + ',' + limit.pageSize;
      }
      break;
    case 'update':
      if (protocol.from) {
        const from = protocol.from;
        sql = sql + from;
      }
      sql = sql + ' set ';
      if (protocol.fields && protocol.values) {
        const fields = protocol.fields;
        const values = protocol.values;
        for (let i = 0; i < fields.length; i++) {
          sql = sql + fields[i] + '=' + '?';
          sqlParams = sqlParams.concat([values[i]]);
          if (i !== (fields.length - 1)) {
            sql = sql + ', ';
          }
        }
      }
      if (protocol.where) {
        const where = protocol.where;
        sql = sql + ' WHERE ' + filterRecursive(where).res;
        sqlParams = sqlParams.concat(filterRecursive(where).sqlParams);
      }
      break;
    case 'delete':
      if (protocol.from) {
        const from = protocol.from;
        sql = sql + ' FROM ' + from;
      }
      if (protocol.where) {
        const where = protocol.where;
        sql = sql + ' WHERE ' + filterRecursive(where).res;
        sqlParams = sqlParams.concat(filterRecursive(where).sqlParams);
      }
      break;
    case 'insert':
      if (protocol.from) {
        const from = protocol.from;
        sql = sql + from + ' ';
      }
      var f = '( ';
      var v = '( ';
      if (protocol.fields && protocol.values) {
        const fields = protocol.fields;
        const values = protocol.values;
        for (let i = 0; i < fields.length; i++) {
          f = f + fields[i];
          v = v + '?';
          sqlParams = sqlParams.concat([values[i]]);
          if (i !== (fields.length - 1)) {
            f = f + ', ';
            v = v + ', ';
          }
        }
        f = f + ' )';
        v = v + ' )';
        sql = sql + f + ' values ' + v;
      }
      break;
  }

  return { sql, sqlParams };
}

module.exports = sqlConvertor;