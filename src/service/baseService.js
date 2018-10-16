/**
 * Service基类，处理业务逻辑
 * @author Xiaojun Guan
 * @since  2018/5/2
 */
class BaseService {
  constructor(provider) {
    this.provider = provider;
    this.setProvider();
  }

  setProvider() {

  }
}

module.exports = BaseService;