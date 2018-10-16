const BaseProvider = require('../baseProvider');
const logger = require('log4js').getLogger();

/**
 * Mock Provider Class
 * author: Xiaojun Guan
 */
class MockJSProvider extends BaseProvider {
  constructor() {
    super();

    this._dataSource = {};
  }

  static getInstance() {
    if (MockJSProvider._instance === null) {
      MockJSProvider._instance = new MockJSProvider();
    }

    return MockJSProvider._instance;
  }

  /**
  * init dataSource
  * @param {string} config mockData config 
  */
  init(config) {
    // get mock data
    if (config && config.dataKey) {
      if (this._dataSource[config.key] == undefined) {
        this._dataSource[config.key] = config.data;
      }

      logger.debug(`[Init DataSource]: ${JSON.stringify(this._dataSource[config.dataKey])}`)
    } else {
      throw new Error(`InitConfig is not defined, please check.`);
    }
  }

  /**
   * query data by filter
   * @param {object} protocol 
   */
  query(key, protocol) {
    let data, total, updateCount, deleteCount, insertCount;

    // data source map
    if (!this._dataSource || !this._dataSource[key]) {
      throw new Error(`dataSource[${key}] is not be inited, please check.`)
    }

    data = this._dataSource[key];
    total = data.length;

    // data filter
    if (protocol.where) {
      data = this._filterData(data, protocol.where);
      total = data.length;
      logger.debug(`Mock Filter: ${JSON.stringify(data)}`);
    }

    switch (protocol.operation) {
      case 'select':
        // data groupBy
        if (protocol.group) {
          data = this._groupByData(data, protocol.group, protocol.having, protocol.fields);
          total = data.length;
        }

        // data order
        if (protocol.order) {
          data = this._orderByData(data, protocol.order);
        }

        // data limit
        if (protocol.limit) {
          data = this._limitData(data, protocol.limit);
        }

        // select fields
        if (protocol.fields) {
          data = this._selectFields(data, protocol.fields);
        }

        break;
      case 'update':
        if (protocol.fields && protocol.values) {
          updateCount = data.length;
          data = this._updateData(key, data, protocol.fields, protocol.values);
        }
        break;
      case 'insert':
        if (protocol.fields && protocol.values) {
          data = this._insertData(key, protocol.fields, protocol.values);
          insertCount = 1;
          total += 1;
        }
        break;
      case 'delete':
        deleteCount = data.length;
        data = this._deleteData(key, data);
        total -= deleteCount;
        break;
      default:
        throw new Error(`CommonProtocol.operation is ${protocol.operation} that cannot be resolved.`)
    }

    // return data
    let result = {
      list: data,
      total: total,
      updateCount: updateCount,
      deleteCount: deleteCount,
      insertCount: insertCount
    };

    logger.info(`MockProvider Query Result: ${JSON.stringify(result)}`);

    return Promise.resolve(result);  // asyc return
  }

  /**
   *  filter data by condition
   * @param {object} data
   * @param {object} where
   */
  _filterData(data, where) {
    return data.filter((src) => {
      return this._recursiveFilter(where, src);
    });
  }

  /**
   * recursion analysis filter
   * @param {object} where select condition
   * @param {object} src  data source 
   * @param {string} logic condition logic: 'and', 'or'
   */
  _recursiveFilter(where, src, logic) {
    logic = logic || 'and';  // the first floor is 'and' logic;
    let isFilter = logic == 'and';

    where.forEach((item) => {
      let res;
      if (item.type === 'atom') {
        let srcVal = src[item.field];
        switch (item.expression) {
          case 'in':
            res = item.value.indexOf(srcVal) > -1;
            break;
          case 'not in':
            res = item.value.indexOf(srcVal) < 0;
            break;
          case 'eq':
            res = item.value[0] == srcVal;
            break;
          case 'not eq':
            res = item.value[0] != srcVal;
            break;
          case 'ge':
            res = srcVal >= item.value[0];
            break;
          case 'gt':
            res = srcVal > item.value[0];
            break;
          case 'lt':
            res = srcVal < item.value[0];
            break;
          case 'le':
            res = srcVal <= item.value[0];
            break;
          case 'between':
            res = srcVal <= item.value[1] && srcVal >= item.value[0];
            break;
          case 'not between':
            res = srcVal > item.value[1] || srcVal < item.value[0];
            break;
          case 'like':
            res = srcVal.indexOf(item.value[0]) > -1;
            break;
          case 'not like':
            res = srcVal.indexOf(item.value[0]) < 0;
            break;
          default:
            throw new Error(`MockJSProvider ${item.expression} cannot be resolved.`)
        }
        res = (!item.value || item.value.length == 0) || res;
      } else {
        res = this._recursiveFilter(item.filters, src, item.logic);
      }

      if (logic == 'or') {
        isFilter = isFilter || res;
      } else {
        isFilter = isFilter && res;
      }
    })

    return isFilter;
  }

  /**
   * group by data by condition
   * @param {object} data 
   * @param {object} group
   * @param {object} having 
   * @param {object} fields fields to be selected
   */
  _groupByData(data, group, having, fields) {
    let groupArr = this._groupBy(data, (item) => {
      return group.map((field) => {
        return item[field];
      })
    });

    logger.debug(`Group Dicts: ${JSON.stringify(groupArr)}`)

    // grouped fields mapping
    let aggreDict = this._getGroupField(fields);

    logger.debug(`aggreDict: ${JSON.stringify(aggreDict)}`)

    let result = [];  // group result
    groupArr.forEach((group) => {
      let groupItem = {}

      group.forEach((item) => {
        let aggreVal = {}

        for (let field in item) {
          let aggreItem = aggreDict[field];
          if (aggreItem) {
            // init calculate value
            if (aggreVal[field] === undefined) {
              aggreVal[field] = 0;
            }
            // calculate the grouped field
            switch (aggreItem.method) {
              case 'sum':   // sum()
                aggreVal[field] += item[field];
                break;
              case 'count': // count()
                aggreVal[field] += 1;
                break;
            }
          } else {
            // set the non-grouped field
            groupItem[field] = item[field];
          }
        }

        Object.keys(aggreVal).forEach((field) => {
          groupItem[aggreDict[field].groupFieldName] = aggreVal[field];
        })
      });

      result.push(groupItem);
    })

    logger.info(`grouped data count: ${result.length}\ngrouped data: ${JSON.stringify(result)}`)

    // TODO: resolve having
    return result;
  }

  /**
   * get group fields mapping
   * @param {object} fields 
   */
  _getGroupField(fields) {
    let aggreDict = {}
    let incFields = fields.forEach((field) => {
      let repSum = /sum\((\S+)\) as (\S+)/.exec(field.trim());
      let repCount = /count\((\S+)\) as (\S+)/.exec(field.trim());
      if (repSum) {
        aggreDict[repSum[1]] = {
          method: 'sum',
          groupFieldName: repSum[2],
        }
      } else if (repCount) {
        aggreDict[repCount[1]] = {
          method: 'count',
          groupFieldName: repCount[2],
        }
      }
    })

    return aggreDict;
  }

  /**
   * groupBy array
   * @param {object} array 
   * @param {function} f 
   */
  _groupBy(array, f) {
    var groups = {};
    array.forEach((o) => {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map((group) => {
      return groups[group];
    })
  }

  /**
   * filter selected fields
   * @param {object} data 
   * @param {object} fields fields to be selected 
   */
  _selectFields(data, fields) {
    return data.map((item) => {
      let select = {};
      fields.forEach((field) => {
        let repSum = /sum\((\S+)\) as (\S+)/.exec(field.trim());
        let repCount = /count\((\S+)\) as (\S+)/.exec(field.trim());

        if (repSum) {
          select[repSum[2]] = item[repSum[2]]
        } else if (repCount) {
          select[repCount[2]] = item[repCount[2]]
        } else {
          select[field] = item[field];
        }
      });

      return select;
    })
  }


  /**
   * data order
   * @param {object} data 
   * @param {object} order 
   */
  _orderByData(data, order) {
    order.forEach(item => {
      var orderField = item.field;
      var isAsc = item.type ? item.type.toUpperCase() == 'ASC' : true;

      data.sort(function (a, b) {
        let compare = isAsc ? (a[orderField] - b[orderField])
          : (b[orderField] - a[orderField])
        return compare;
      })

    });

    return data;
  }

  /**
   * data pagination
   * @param {object} data 
   * @param {object} limit 
   */
  _limitData(data, limit) {
    let total = data.length;
    let start = (limit.page - 1) * limit.pageSize;
    let end = (limit.page * limit.pageSize) > total
      ? total : limit.page * limit.pageSize;

    data = data.filter((item, index) => {
      return (index >= start) && (index <= end - 1)
    })

    return data;
  }

  /**
   * mutate data by filter
   * @param {object} commonProtocol 
   */
  _updateData(key, data, fields, values) {
    for (let i = 0, len = data.length; i < len; i++) {
      let item = data[i];
      fields.forEach((field, index) => {
        item[field] = values[index];
      })

      this._dataSource[key] = this._dataSource[key].map((source) => {
        if (source.id == item.id) {
          return item;
        }
        return source;
      })
    }

    return this._dataSource[key];
  }


  /**
   * remove data by filter
   * @param {object} commonProtocol 
   */
  _insertData(key, fields, values) {
    let item = {
      id: Math.floor(Math.random() * 1000) + 100
    }

    fields.forEach((field, index) => {
      if (field !== 'id') {
        item[field] = values[index];
      }
    })

    this._dataSource[key].push(item);

    return this._dataSource[key];
  }

  /**
   * remove data
   * @param {object} data // to be removed data 
   */
  _deleteData(key, data) {
    let delIds = data.map((item) => {
      return item.id;
    })

    this._dataSource[key] = this._dataSource[key].filter((source) => {
      return delIds.indexOf(source.id) < 0;
    })

    return _dataSource[key];
  }
}

module.exports = MockJSProvider;
