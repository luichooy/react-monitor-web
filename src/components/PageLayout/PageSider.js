import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Menu, Icon } from 'antd';

const { Item, SubMenu } = Menu;

class PageSider extends Component {
  handleClick = ({ key }) => {
    console.log(key);
    let { history } = this.props;
    history.push(key);
  };
  
  render() {
    const { location } = this.props;
    return (
      <div>
        <Menu
          mode="inline"
          theme="dark"
          inlineCollapsed="true"
          defaultOpenKeys={ ['/log'] }
          defaultSelectedKeys={ [location.pathname] }
          onClick={ this.handleClick }
        >
          <SubMenu key="/log" title={ <span><Icon type="appstore"/><span>日志监控</span></span> }>
            <Item key="/log/search">日志搜索</Item>
            <Item key="/log/realtime">实时日志</Item>
            <Item key="/log/apply">接入申请</Item>
            <Item key="/log/strategy">日志策略</Item>
          </SubMenu>
          <SubMenu key="/func" title={ <span><Icon type="appstore"/><span>方法监控</span></span> }>
            <Item key="/func/tp99">TP99指标</Item>
          </SubMenu>
          <SubMenu key="/error" title={ <span><Icon type="appstore"/><span>异常页面</span></span> }>
            <Item key="/error/404">404</Item>
            <Item key="/error/500">500</Item>
          </SubMenu>
        </Menu>
      </div>
    );
  }
}

export default withRouter(PageSider);
