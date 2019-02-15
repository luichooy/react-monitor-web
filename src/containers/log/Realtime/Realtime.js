import React, { Component } from 'react';
import { Button, Icon, Select, message } from 'antd';
import Scrollbar from '../../../components/Scrollbar/Scrollvar';
import './index.css';

const Option = Select.Option;


class Realtime extends Component {
  constructor(props) {
    super(props);
    this.container = React.createRef();
    this.state = {
      open: false,
      appOptions: [],
      ipOptions: [],
      logOptions: [],
      query: {
        app_id: '',
        log_name: '',
        server_ip: '',
        limit: 100
      },
      logs: []
    };
  }
  
  toggleSider = () => {
    this.setState(preState => {
      return {
        open: !preState.open
      };
    });
  };
  
  componentDidMount() {
    // 初始化请求应用名
    this.getApps();
  }
  
  getApps = () => {
    this.clearTimer();
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
  
  getIps = () => {
    const that = this;
    this.clearTimer();
    if (!this.state.query.app_id) return;
    window.$get({
      url: `/customs/monitor/log/apps/${this.state.query.app_id}/ips`,
      success(res) {
        that.setState({
          ipOptions: res.data
        });
      }
    });
  };
  
  getLogs() {
    const that = this;
    this.clearTimer();
    if (!this.state.query.server_ip) return;
    
    window.$get({
      url: `/customs/monitor/log/apps/${this.state.query.app_id}/ips/${this.state.query.server_ip}/logfile`,
      success(res) {
        that.setState({
          logOptions: res.data
        });
      }
    });
  }
  
  handleSelectChange(key, value) {
    this.setState(preState => ({
      query: {
        ...preState.query,
        [key]: value
      }
    }));
    
    if (key === 'app_id') {
      this.setState(prevState => ({
        ipOptions: [],
        logOptions: [],
        query: {
          ...prevState.query,
          server_ip: '',
          log_name: ''
        }
      }), () => this.getIps());
    }
    
    if (key === 'server_ip') {
      this.setState(prevState => ({
        logOptions: [],
        query: {
          ...prevState.query,
          log_name: ''
        }
      }), () => this.getLogs());
    }
  }
  
  handleQuery = () => {
    // 查询之前先将定时器清空
    this.clearTimer();
    // 为了使每次查询都有从头滚动的效果，将logs清空
    this.setState({
      logs: []
    }, () => {
      this.queryLog();
    });
    
    // 查询完成之后设置定时器
    this.timer = setInterval(this.queryLog, 5000);
    
    // 设置5分钟之后清除定时器，断开连接
    this.resetTimeout();
  };
  
  queryLog = () => {
    const that = this;
    window.$post({
      url: '/customs/monitor/log/real/search',
      params: this.state.query,
      success(res) {
        if (res.data.length) {
          that.setState({
            logs: res.data
          }, () => {
            // 滚动到底部
            that.scrollRef.scrollToBottom(0);
          });
        }
      },
      error(res) {
        message.error(res.message);
      }
    });
  };
  
  clearTimer = () => {
    clearInterval(this.timer);
    // 将timer设为null,是为了辅助computed里面tips的计算
    this.timer = null;
  };
  
  resetTimeout = () => {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(this.clearTimer, 300000);
  };
  
  render() {
    const { open, appOptions, ipOptions, logOptions, query, logs } = this.state;
    
    if (this.container.current) {
      this.style = {
        height: this.container.current.getBoundingClientRect().height
      };
    }
    
    const viewStyle = {
      padding: 24,
      backgroundColor: 'rgba(24, 28, 33, 0.9)',
      color: '#d1d2d3',
      scrollBehavior: 'smooth'
    };
    const thumbStyle = {
      backgroundColor: 'rgba(255,255,255,.8)',
      borderRadius: '3px',
      cursor: 'pointer'
    };
    const trackStyle = {
      backgroundColor: 'rgba(255,255,255,.2)'
    };
    
    function generateContent() {
      if (logs.length) {
        return (
          <Scrollbar
            getScrollRef={ el => this.scrollRef = el }
            style={ this.style }
            viewStyle={ viewStyle }
            thumbStyle={ thumbStyle }
            trackStyle={ trackStyle }
          >
            { logs.map(log =>
              <div
                key={ log.id }
                className="word-break-all fontsize-16"
                style={ { lineHeight: '150%' } }
              >
                { log.content }
              </div>
            ) }
            <div className={ `mt-3 text-big ${this.timer ? 'text-success' : 'text-danger'}` }>
              { this.timer ? '加载中...' : '连接已断开，请重新查询' }
            </div>
          </Scrollbar>
        );
      } else {
        return (
          <div className="flex-grow-1 align-self-center text-center text-secondary text-large">
            请配置左侧搜索条件查询数据
          </div>
        );
      }
    }
    
    return (
      <div className={ `realtime-container border ${open ? 'sider-open' : ''}` }>
        <div className="sider">
          <div className="media py-3 px-4 border-bottom">
            <div className="media-body">搜索条件</div>
            <Icon onClick={ this.toggleSider }
              type="close"
              className="p-2 d-lg-none cursor-pointer"
              style={ { marginRight: -8 } }
            />
          </div>
          <div className="p-4">
            <div className="mb-4">
              <label className="d-block mb-1">应用名：</label>
              <Select
                value={ query.app_id }
                onChange={ this.handleSelectChange.bind(this, 'app_id') }
                style={ { width: '100%' } }
              >
                { appOptions.map(app => {
                  return <Option value={ app.value } key={ app.value }>{ app.text }</Option>;
                }) }
              </Select>
            </div>
            <div className="mb-4">
              <label className="d-block mb-1">IP（请先选择应用名）：</label>
              <Select
                value={ query.server_ip }
                onChange={ this.handleSelectChange.bind(this, 'server_ip') }
                disabled={ !query.app_id }
                allowClear
                style={ { width: '100%' } }
              >
                { ipOptions.map(ip => {
                  return <Option value={ ip.value } key={ ip.value }>{ ip.text }</Option>;
                }) }
              </Select>
            </div>
            <div className="mb-4">
              <label className="d-block mb-1">日志文件（请先选择IP）：</label>
              <Select
                value={ query.log_name }
                onChange={ this.handleSelectChange.bind(this, 'log_name') }
                disabled={ !query.server_ip }
                allowClear
                style={ { width: '100%' } }
              >
                { logOptions.map(ip => {
                  return <Option value={ ip.value } key={ ip.value }>{ ip.text }</Option>;
                }) }
              </Select>
            </div>
            <Button onClick={ this.handleQuery } disabled={ !query.app_id } type="primary" block>查询</Button>
          </div>
        </div>
        <div className="d-flex flex-column flex-grow-1">
          <div className="media py-3 px-4 border-bottom">
            <div onClick={ this.toggleSider }
              className="px-4 mr-2 d-lg-none cursor-pointer text-muted"
              style={ { marginLeft: -24 } }>
              <Icon type="ellipsis" className="trigger"/>
            </div>
            
            <div className="media-body">搜索结果</div>
            <Button type="primary" shape="circle" icon="poweroff" size="large" className="mr-2"/>
            <Button type="danger" shape="circle" icon="delete" size="large" className="mr-2"/>
            <Button shape="circle" icon="ellipsis" size="large"/>
          </div>
          <div ref={ this.container } className="flex-grow-1 d-flex">
            { generateContent.call(this) }
          </div>
        </div>
      </div>
    );
  }
}

export default Realtime;
