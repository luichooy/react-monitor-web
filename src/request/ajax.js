import http from './http';

let ajax = {
  _options: {
    url: '',
    params: {},
    query: {},
    success(res) {
      console.log(res);
    },
    201(res) {
      console.log(res);
    },
    error: function (res) {
      console.log(res.message);
    }
  },
  
  get(opt) {
    const options = Object.assign({}, this.$ajax._options, opt);
    http.get(options.url, options.query).then(res => {
      if (res.status === 200) {
        options.success.call(this, res);
      } else {
        options.error.call(this, res);
      }
    }).catch(err => {
      console.log(err);
    });
  },
  
  post(opt) {
    const options = Object.assign({}, this.$ajax._options, opt);
    http.post(options.url, options.params).then(res => {
      if (res.status === 200) {
        options.success.call(this, res);
      } else if (res.status === 201) {
        options['201'].call(this, res);
      } else {
        options.error.call(this, res);
      }
    }).catch(err => {
      console.log(err);
    });
  },
  
  put(opt) {
    const options = Object.assign({}, this.$ajax._options, opt);
    http.put(options.url, options.params).then(res => {
      if (res.status === 200) {
        options.success.call(this, res);
      } else {
        options.error.call(this, res);
      }
    }).catch(err => {
      console.log(err);
    });
  },
  
  delete(opt) {
    const options = Object.assign({}, this.$ajax_options, opt);
    http.delete(options.url).then(res => {
      if (res.status === 200) {
        options.success.call(this, res);
      } else {
        options.error.call(this, res);
      }
    }).catch(err => {
      console.log(err);
    });
  }
};

export default ajax;
