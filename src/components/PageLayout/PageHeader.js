import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Dropdown, Menu, Avatar, Icon } from 'antd';

class PageHeader extends Component {
  
  render() {
    const menu = (
      <Menu>
        <Menu.Item key="acount"><Icon type="user" />我的账户</Menu.Item>
        <Menu.Item key="message"><Icon type="message" />消息</Menu.Item>
        <Menu.Item key="setting"><Icon type="setting" />账户设置</Menu.Item>
        <Menu.Item key="modifyPassword"><Icon type="safety" />修改密码</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出账户</Menu.Item>
      </Menu>
    );
    return (
      <div className="d-flex justify-content-center">
        <Link to="/" className="app-header-logo">
          <img src={ require('../../assets/images/logo-nav.png') } alt="logo"/>
        </Link>
        <div className="app-header-content d-flex justify-content-end align-items-center">
          <Dropdown overlay={menu} trigger={['click']}>
            <div>
              <span>admin</span>
              <Avatar src={ require('../../assets/images/avatar.png') } className="ml-2 mr-1" alt="用户头像"></Avatar>
              <Icon type="down" />
            </div>
          </Dropdown>
        
        </div>
      </div>
    );
  }
}

export default PageHeader;
