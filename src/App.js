import React, { Component } from 'react';
import PageLayout from './components/PageLayout/PageLayout';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

class App extends Component {
  render() {
    return (
      <LocaleProvider locale={ zhCN }>
        <PageLayout/>
      </LocaleProvider>
    );
  }
}

export default App;
