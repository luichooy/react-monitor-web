import React, { Component } from 'react';
import { Card, Input, Icon, List } from 'antd';
import moment from 'moment';
import SearchSetting from './SearchSetting';
import './index.css';
import { sessionStorage } from '../../../utils/storage';
import { formatDate } from '../../../utils/date';

class SearchResult extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      visible: false,
      appOptions: [],
      ipOptions: [],
      form: {
        app_id: '',
        server_ip: [],
        start_time: moment(moment().valueOf() - 7 * 24 * 3600 * 1000),
        end_time: moment()
      },
      keyword: '',
      page: {
        total: 0,
        pagesize: 8,
        pagenum: 1
      },
      logs: []
    };
    
    this.openSettingModal = this.openSettingModal.bind(this);
    this.closeSettingModal = this.closeSettingModal.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.search = this.search.bind(this);
  }
  
  componentDidMount() {
    const query = sessionStorage.getItem('query');
    this.setState(prevState => {
      return {
        keyword: query.keyword,
        form: Object.assign(prevState.form, query.form)
      };
    }, () => {
      if (!this.state.keyword) return;
      this.search();
      if (this.state.form.app_id) {
        this.getIpOptions(this.state.form.app_id);
      }
    });
    this.getAppOptions();
  }
  
  handleSearch = keyword => {
    this.setState({
      keyword
    }, () => {
      if (!this.state.keyword) return;
      sessionStorage.setItem('query', {
        keyword,
        form: this.state.form
      });
      this.search();
    });
  };
  
  search() {
    const query = {
      ...this.state.form,
      keyword: this.state.keyword,
      pageSize: this.state.page.pagesize,
      pageNum: this.state.page.pagenum
    };
    const that = this;
    window.$post({
      url: '/customs/monitor/log/offline/search',
      params: query,
      success(res) {
        that.setState(prevState => {
          return {
            page: Object.assign(prevState.page, { total: res.data.totalCount }),
            logs: res.data.result,
            loading: false
          };
        });
      }
    });
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
        console.log(res);
        that.setState({
          ipOptions: res.data
        });
      }
    });
  };
  
  handleFormChange(name, value) {
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
  
  handlePageChange = (pagenum, pagesize) => {
    this.setState(prevState => {
      return {
        page: Object.assign(prevState.page, { pagenum })
      };
    }, this.search);
  };
  
  goDetail = log => {
    console.log(log);
    console.log(this);
    this.props.history.push({
      pathname: `/log/detail/${log.id}`,
      state: {
        app_name: log.app_name,
        create_time: log.create_time
      }
    });
  };
  
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
    
    const { visible, appOptions, ipOptions, form, keyword, page, logs, loading } = this.state;
    
    const getTitleByKeyword = (str, keyword) => {
      const reg = new RegExp('^(.*)(' + keyword + ')(.*)', 'i');
      reg.test(str);
      // console.log(RegExp.$1);
      // console.log(RegExp.$2);
      const front = RegExp.$1.substr(-50);
      const end = RegExp.$3.substr(0, 50);
      return `${front}<span style="color: red;">${RegExp.$2}</span>${end}`;
    };
    
    return (
      <div>
        <div className="py-1 mb-2 d-flex w-75">
          <Input.Search
            defaultValue={ keyword }
            onSearch={ this.handleSearch }
            enterButton={ <span><Icon type="search"/>&nbsp;Search</span> }
            suffix={ <span onClick={ this.openSettingModal }
              className="cursor-pointer px-2"><Icon type="setting"/></span> }
            size="large"
          />
        </div>
        <Card>
          <List
            loading={ loading }
            itemLayout="vertical"
            size="large"
            pagination={ {
              onChange: this.handlePageChange,
              current: page.pagenum,
              pageSize: page.pagesize,
              total: page.total,
              showTotal: total => `共 ${total} 条`
            } }
            dataSource={ logs }
            renderItem={ log => (
              <List.Item key={ log.id }>
                <p
                  dangerouslySetInnerHTML={ { __html: getTitleByKeyword(log.content, keyword) } }
                  onClick={ this.goDetail.bind(this, log) }
                  className="link word-break-all my-0 fontsize-16"
                />
                <p className="mt-2 mb-1 fontsize-14">{ log.content }</p>
                <p className="my-0 fontsize-12">
                  <span className="text-success text">{ log.app_name }</span>
                  <span className="text-success ml-5">{ log.server_ip }</span>
                  <span className="text-success ml-5">{ log.log_name }</span>
                  <span className="text-success ml-5">{ formatDate(new Date(log.create_time), 'yyyy-MM-dd hh:mm:SS,sss') }</span>
                </p>
              </List.Item>
            ) }
          />
        </Card>
        <SearchSetting
          visible={ visible }
          appOptions={ appOptions }
          ipOptions={ ipOptions }
          data={ form }
          onChange={ this.handleFormChange }
          handleCancel={ this.closeSettingModal }
        />
      
      </div>
    );
  }
}

export default SearchResult;
