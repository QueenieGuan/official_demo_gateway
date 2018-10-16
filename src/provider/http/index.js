const BaseProvider = require('../baseProvider');
const url = require('url');
const { httpConfig } = require('../../config');
const logger = require('log4js').getLogger('HttpProvider.js');

/**
 * HttpProvider
 */
class HttpProvider extends BaseProvider {
  constructor() {
    super();
    this.httpHost = null;
  }

  /**
   * get http host config
   * @param {string} configKey 
   */
  init(configKey) {
    // set http config host
    this.httpHost = httpConfig[configKey];
    if (!this.httpHost) {
      throw new Error(`cannot find httpconfig by ${configKey}, please check.`);
    }
  }

  /**
   * send http request
   * @param {string} method  http request method
   * @param {string} pathname '/' request path etc:'/index'
   * @param {object} params {} request params
   * @param {object} headers {} request headers
   */
  query(method, pathname = '/', params = {}, headers = {}) {
    method = method || 'GET';
    switch (method.toUpperCase()) {
      case 'POST':
        return this._post(pathname, params, headers);
      default:
        return this._get(pathname, params, headers);
    }
  }

  // url params transform
  _paramsTransform(params, method) {
    let str = '?';
    for (let [key, value] of Object.entries(params)) {
      str += `${key}=${value}&`;
    }
    return encodeURIComponent(str.substring(0, queryStr.length - 1));
  }

  /**
   * http request by 'GET' method
   * @param {string} pathname '/' request path etc:'/index'
   * @param {object} params {} request params
   * @param {object} headers {} request headers
   */
  _get(pathname = '/', params = {}, headers = {}) {
    try {
      pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
      let path = pathname + this._paramsTransform(params);
      let { protocol, hostname, port } = url.parse(this.httpHost);
      let options = {
        protocol, hostname, port, path, headers,
        method: 'GET',
      }
      return this._sendRequest(options);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * http request by 'POST' method
   * @param {string} pathname '/' request path etc:'/index'
   * @param {object} params {} request params
   * @param {object} headers {} request headers
   */
  _post(pathname = '/', params = {}, headers = {}) {
    try {
      pathname = pathname.startsWith('/') ? pathname : `/${pathname}`;
      let path = pathname;
      let { protocol, hostname, port } = url.parse(this.httpHost);
      let options = {
        protocol, hostname, port, path,
        method: 'POST',
        headers: Object.assign(headers, {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(JSON.stringify(params)),
        }),
      }
      return this._sendRequest(options, params);
    } catch (e) {
      logger.error(e);
    }
  }

  /**
   * Send Http Request 
   * @param {options} options
   * @param {objec} bodyParams
   * @returns Promise
   */
  _sendRequest(options, bodyParams) {
    return new Promise((resolve, reject) => {
      try {
        const lib = options.protocol === 'https:' ? require('https') : require('http');
        let req = lib.request(options, res => {
          if (res.statusCode < 200 || res.statusCode >= 300) {
            reject(new Error('statusCode=' + res.statusCode));
            return;
          }
          let body = [];
          res.on('data', function (chunk) {
            body.push(chunk);
          });
          res.on('end', function () {
            try {
              body = JSON.parse(Buffer.concat(body).toString());
            } catch (e) {
              reject(e);
              return;
            }
            resolve(body);
          });
        });
        req.on('error', function (err) {
          reject(err);
        });
        options.method === 'POST' && req.write(JSON.stringify(bodyParams));
      } catch (e) {
        logger.error(e);
      }
    });
  }
}

module.exports = HttpProvider;