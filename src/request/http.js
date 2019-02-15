import axios from 'axios';


// import { sessionStorage } from '@/utils/storage';

// if (!store.state.token) {
//   store.commit('SET_TOKEN', (sessionStorage.getItem('vuex') && sessionStorage.getItem('vuex').token) || '');
// }

// api 配置

const http = axios.create({
  baseURL: '/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  transformRequest: [
    function (data, headers) {
      headers.token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxNTc1NzEyOTUyNiJ9.LT8GBwZtWEY6sWftXKNG0EfqH4Cn84CjMyeFj0POrxw';
      if (headers['Content-type'] === 'multipart/form-data') {
        return data;
      } else {
        return JSON.stringify(data);
      }
    }
  ]
});

// 请求拦截器
http.interceptors.request.use(config => {
  // 开发环境下，如果请求是 post,put,patch,则打印数据体，方便调试
  if (process.env.NODE_ENV === 'development') {
    const { method } = config;
    if (method === 'post' || method === 'put' || method === 'patch') {
      console.log(config.data);
    }
  }
  
  return config;
}, error => {
  return Promise.reject(error);
});

// 响应拦截器
http.interceptors.response.use(res => {
  console.log(res);
  return res.data;
}, error => {
  if (error && error.response) {
    console.log(error.response);
    
    return Promise.reject(error);
  }
});

export default http;
