import React, { Component } from 'react';
import { Card, InputNumber, List } from 'antd';
import MagicBall from './MagicBall';
import { setStateAsync } from '../../../utils/async';
import './index.css';

class Detail extends Component {
  constructor(props) {
    super(props);
    this.center = React.createRef();
    this.start = React.createRef();
    this.end = React.createRef();
    
    this.state = {
      initLoading: true,
      limitAsc: 10,
      limitDesc: 10,
      asc: [],
      current: {},
      desc: []
    };
    
    this.getLogs = this.getLogs.bind(this);
  }
  
  componentDidMount() {
    const query = {
      ...this.props.location.state,
      ...this.props.match.params,
      limit: 10,
      order: ''
    };
    this.query = query;
    this.getLogs();
  }
  
  getLogs = (order = '') => {
    this.query.order = order;
    if (this.query.order === 'asc') this.query.limit = this.state.limitAsc;
    if (this.query.order === 'desc') this.query.limit = this.state.limitDesc;
    const that = this;
    window.$post({
      url: '/customs/monitor/log/scroll/search',
      params: this.query,
      async success(res) {
        if (res.data.asc) await setStateAsync.call(that, { asc: res.data.asc });
        if (res.data.desc) await setStateAsync.call(that, { desc: res.data.desc });
        if (res.data.current) await setStateAsync.call(that, { current: res.data.current });
        that.setState({
          initLoading: false
        }, () => {
          that.scrollIntoView(that.query.order);
        });
      }
    });
  };
  
  loadAsc = () => {
    this.setState(prevState => {
      return { limitAsc: prevState.limitAsc + 20 };
    }, () => this.getLogs('asc'));
  };
  
  loadDesc = () => {
    this.setState(prevState => {
      return { limitDesc: prevState.limitDesc + 20 };
    }, () => this.getLogs('desc'));
  };
  
  scrollIntoView = location => {
    switch (location) {
      case 'asc':
        // document.body.scrollTop = document.documentElement.scrollTop = 0;
        this.start.current.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
        break;
      case 'desc':
        // document.body.scrollTop = document.documentElement.scrollTop = document.body.scrollHeight;
        this.end.current.scrollIntoView({
          block: 'end',
          behavior: 'smooth'
        });
        break;
      case '':
        this.center.current.scrollIntoView({
          block: 'center',
          behavior: 'smooth'
        });
        break;
      default:
        break;
    }
  };
  
  handleChange = (dirt, value) => {
    if (dirt === 'asc') this.setState({ limitAsc: value });
    if (dirt === 'desc') this.setState({ limitDesc: value });
    
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.getLogs(dirt);
    }, 300);
  };
  
  
  render() {
    
    const { initLoading, limitAsc, limitDesc, asc, current, desc } = this.state;
    
    return (
      <div>
        <div ref={ this.start } className="start">start</div>
        <Card>
          <div className="mb-3 text-center">
            向上载入&nbsp;&nbsp;&nbsp;
            <InputNumber
              value={ limitAsc }
              onChange={ this.handleChange.bind(this, 'asc') }
              min={ 0 }
              formatter={ value => `${value}条` }
              parser={ value => value.replace('条', '') }
            />
          </div>
          <List
            itemLayout="vertical"
            loading={ initLoading }
            size="large"
            className="border-top border-bottom"
          >
            <List.Item className="py-0">
              <List
                dataSource={ asc }
                renderItem={ log => (
                  <List.Item className="px-4">
                    { log.content }
                  </List.Item>
                ) }
              />
            </List.Item>
            <List.Item className="py-0" style={ { backgroundColor: '#e6f8f1' } }>
              <div ref={ this.center }>
                <List>
                  <List.Item className="px-4">{ current.content }</List.Item>
                </List>
              </div>
            </List.Item>
            <List.Item className="py-0">
              <List
                dataSource={ desc }
                renderItem={ log => (
                  <List.Item className="px-4">{ log.content }</List.Item>
                ) }
              />
            </List.Item>
          </List>
          <div className="mt-3 text-center">
            向下载入&nbsp;&nbsp;&nbsp;
            <InputNumber
              value={ limitDesc }
              onChange={ this.handleChange.bind(this, 'desc') }
              min={ 0 }
              formatter={ value => `${value}条` }
              parser={ value => value.replace('条', '') }
            />
          </div>
        </Card>
        <div ref={ this.end } className="end">end</div>
        <MagicBall
          onScrollTop={ this.loadAsc }
          onScrollCenter={ this.scrollIntoView.bind(this, '') }
          onScrollBottom={ this.loadDesc }
        />
      </div>
    );
  }
}

export default Detail;
