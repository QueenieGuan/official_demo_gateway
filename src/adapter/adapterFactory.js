const { adapterConfig } = require('../config');
const { ADAPTER } = require('../constant');
const MSAdapter = require('./msAdapter');
const MOCKAdapter = require('./mockAdapter');

/**
 * Adapter Factory
 * author: Xiaojun Guan
 */
class AdapterFactory {
  // create a adapter
  // msAdapter or mockAdapter
  static create() {
    switch (adapterConfig) {
      case ADAPTER.MS:  // MSAdapter
        return new MSAdapter();
      case ADAPTER.MOCK:  // MSAdapter
        return new MOCKAdapter();
      default:
        throw new Error(`cannot create ${adapterConfig} adapter, please check.`);
    }
  }
}

module.exports = AdapterFactory;