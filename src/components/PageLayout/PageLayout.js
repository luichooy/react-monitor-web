import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import PageHeader from './PageHeader';
import PageSider from './PageSider';
import './layout.css';

import LogSearch from '../../containers/log/Search/Search';
import LogSearchResult from '../../containers/log/Search/SearchResult';
import LogDetail from '../../containers/log/Detail/Detail';
import LogRealtime from '../../containers/log/Realtime/Realtime';
import LogApply from '../../containers/log/Apply/Apply';
import LogStrategy from '../../containers/log/Strategy/Strategy';
import FuncTP99 from '../../containers/func/TP99/TP99';
import Drilldown from '../../containers/func/TP99/Drilldown';

class PageLayout extends Component {
  render() {
    const { Header, Sider, Content } = Layout;
    return (
      <div>
        <Layout>
          <Header className="layout-header">
            <PageHeader/>
          </Header>
          <Layout className="layout-inner">
            <Sider width={ 250 } className="layout-sider">
              <PageSider/>
            </Sider>
            <Content className="layout-content">
              <Switch>
                <Route path="/log/search" component={ LogSearch }/>
                <Route path="/log/search_result" component={ LogSearchResult }/>
                <Route path="/log/detail/:id" component={ LogDetail }/>
                <Route path="/log/realtime" component={ LogRealtime }/>
                <Route path="/log/apply" component={ LogApply }/>
                <Route path="/log/strategy" component={ LogStrategy }/>
                <Route path="/func/tp99" component={ FuncTP99 }/>
                <Route path="/func/tp99-drilldown" component={ Drilldown }/>
                <Redirect to="/log/search"></Redirect>
              </Switch>
            </Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

export default PageLayout;

