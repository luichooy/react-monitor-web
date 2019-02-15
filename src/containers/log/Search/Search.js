import React, { Component } from 'react';
import { Card, Input, Icon } from 'antd';
import SearchSetting from './SearchSetting';
import './index.css';
import { sessionStorage } from '../../../utils/storage';

class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      appOptions: [],
      ipOptions: [],
      form: {
        app_id: '',
        server_ip: [],
        start_time: Date.now() - 7 * 24 * 3600 * 1000,
        end_time: Date.now()
      }
    };
    
    this.openSettingModal = this.openSettingModal.bind(this);
    this.closeSettingModal = this.closeSettingModal.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.search = this.search.bind(this);
  }
  
  componentDidMount() {
    this.getAppOptions();
  }
  
  search(keyword) {
    console.log(this.props);
    console.log(keyword);
    this.setState({
      keyword
    });
    if (!keyword) return;
    
    const query = {
      keyword,
      form: this.state.form
    };
    
    console.log(query);
    sessionStorage.setItem('query', query);
    
    this.props.history.push('/log/search_result');
  }
  
  getAppOptions = () => {
    const that = this;
    window.$get({
      url: '/customs/monitor/log/apps',
      success(res) {
        that.setState({
          appOptions: res.data
        });
      }
    });
  };
  
  getIpOptions = (app) => {
    const that = this;
    window.$get({
      url: `/customs/monitor/log/apps/${app}/ips`,
      success(res) {
        that.setState({
          ipOptions: res.data
        });
      }
    });
  };
  
  handleFormChange(name, value) {
    console.log(name);
    console.log(value);
    this.setState(prevState => {
      return {
        form: Object.assign(prevState.form, { [name]: value })
      };
    });
    if (name === 'app_id') {
      this.setState(prevState => {
        return {
          ipOptions: [],
          form: Object.assign(prevState.form, { server_ip: [] })
        };
      });
      
      if (value) this.getIpOptions(value);
    }
  }
  
  openSettingModal() {
    this.setState({
      visible: true
    });
  }
  
  closeSettingModal() {
    this.setState({
      visible: false
    });
  }
  
  render() {
    
    const { visible, appOptions, ipOptions, form } = this.state;
    
    return (
      <div className="d-flex align-items-stretch h-100">
        <Card style={ { width: '100%' } }>
          <div className="search-logo text-center">
            <img src={ require('../../../assets/images/search.png') } alt="search-logo"/>
          </div>
          <div className="w-75 m-auto">
            <Input.Search
              enterButton={ <span><Icon type="search"/>&nbsp;Search</span> }
              size="large"
              suffix={ <span onClick={ this.openSettingModal }
                className="cursor-pointer px-2"><Icon type="setting"/></span> }
              onSearch={ this.search }
            />
          </div>
          <SearchSetting
            visible={ visible }
            appOptions={ appOptions }
            ipOptions={ ipOptions }
            data={ form }
            onChange={ this.handleFormChange }
            handleCancel={ this.closeSettingModal }
          />
        </Card>
      </div>
    );
  }
}

export default Search;
