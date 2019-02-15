import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { http, ajax } from './request';

import * as serviceWorker from './serviceWorker';

import reducers from './store/reducers';

import './index.css';
import App from './App';
import Login from './containers/authentication/Login';

const store = createStore(reducers);


// 全局注册http和ajax方法
window.$http = http;
window.$ajax = ajax;
window.$get = ajax.get;
window.$post = ajax.post;
window.$put = ajax.put;
window.$delete = ajax.delete;

ReactDOM.render(
  <Provider store={ store }>
    <BrowserRouter>
      <Switch>
        <Route path="/login" component={ Login }></Route>
        <Route path="/" component={ App }></Route>
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
