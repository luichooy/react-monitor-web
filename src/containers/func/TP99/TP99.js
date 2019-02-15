import React, { Component } from 'react';
import { Row, Col, Select, Button, List, Card, Tooltip, message } from 'antd';
import echarts from 'echarts';
import OPTIONS from './chart.config';
import { throttle } from '../../../utils/tool';
import './index.css';

const Option = Select.Option;
const removeParams = method => {
  return method.replace(/\(.*$/g, $0 => {
    return '(...)';
  });
};

class TP99 extends Component {
  constructor(props) {
    super(props);
    
    // 存放echarts图标的实例，当窗口大小变化的时候，调用resize方法
    this.charts = [];
    
    this.state = {
      loading: true,
      appOptions: [],
      methodOptions: [],
      appName: null,
      methodName: null,
      timeInterval: 30000,
      pageNum: 1,
      pageSize: 3,
      total: 400,
      charts: []
    };
  }
  
  componentDidMount() {
    this.getAppName();
    window.onresize = () => {
      this.charts.forEach(chart => {
        chart.resize();
      });
    };
  }
  
  componentWillUnmount() {
    window.onresize = null;
  }
  
  getAppName = () => {
    const that = this;
    window.$get({
      url: '/customs/monitor/method/apps',
      success(res) {
        that.setState({
          appOptions: res.data,
          appName: res.data[0].value
        }, () => {
          that.getData();
        });
      }
    });
  };
  
  
  getData = () => {
    const query = {
      appName: this.state.appName,
      methodName: this.state.methodName,
      timeInterval: this.state.timeInterval,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize
    };
    const that = this;
    window.$post({
      url: '/customs/monitor/method/search',
      params: query,
      success(res) {
        that.setState({
          charts: res.data.result,
          total: res.data.totalCount,
          loading: false
        });
      }
    });
  };
  
  getMethodOptions = value => {
    const that = this;
    value = value.trim();
    if (value !== '') {
      window.$get({
        url: `/customs/monitor/method/${this.state.appName}/${value}`,
        success(res) {
          that.setState({
            methodOptions: res.data
          });
        },
        error(res) {
          message.error(res.message);
        }
      });
    } else {
      this.setState({
        methodOptions: []
      });
    }
  };
  
  handleSearch = () => {
    this.setState({
      pageNum: 1
    }, () => this.getData());
  };
  
  handleSelectChange = (key, value) => {
    this.setState({
      [key]: value
    });
  };
  
  handlePageChange = (pageNum, pageSize) => {
    this.setState({
      pageNum
    }, () => this.getData());
  };
  
  setOption = (chart, el) => {
    if (el) {
      const echart = echarts.init(el);
      const option = Object.assign({}, OPTIONS, { dataset: { source: chart.chartData } });
      echart.setOption(option);
      
      // 绑定图表点击事件，用于页面下钻
      this.bindClickEvent(echart, chart);
      
      // 将chart实例存储起来，当页面resize的时候调整图标大小
      this.charts.push(echart);
    }
  };
  
  bindClickEvent = (echart, chart) => {
    echart.on('click', function (params) {
      console.log(params);
      
      const beginTime = params.name;
      const { appName, methodName } = chart;
      const timeInterval = this.state.timeInterval;
      const query = { appName, methodName, beginTime, timeInterval };
      console.log(this.props);
      this.props.history.push({
        pathname: '/func/tp99-drilldown',
        state: query
      });
    }.bind(this));
  };
  
  
  render() {
    const { loading, appOptions, methodOptions, appName, methodName, timeInterval, pageSize, pageNum, total, charts } = this.state;
    
    const options = methodOptions.map(opt => <Option key={ opt.value }>{ opt.text }</Option>);
    
    return (
      <div>
        <div className="border px-4 pt-4 mb-4">
          <Row gutter={ { lg: 5, xl: 16, xxl: 32 } }>
            <Col lg={ 6 } xxl={ 7 } className="mb-4">
              <label className="d-block mb-1">应用名</label>
              <Select
                value={ appName }
                onChange={ this.handleSelectChange.bind(this, 'appName') }
                size="large"
                className="d-block"
              >
                { appOptions.map(app => {
                  return <Option value={ app.value } key={ app.value }>{ app.text }</Option>;
                }) }
              </Select>
            </Col>
            <Col lg={ 6 } xxl={ 7 } className="mb-4">
              <label className="d-block mb-1">方法名</label>
              <Select
                value={ methodName }
                showSearch
                allowClear
                filterOption={ false }
                onSearch={ throttle(this.getMethodOptions) }
                onChange={ this.handleSelectChange.bind(this, 'methodName') }
                notFoundContent={ null }
                size="large"
                className="d-block"
              >
                { options }
              </Select>
            </Col>
            <Col lg={ 6 } xxl={ 7 } className="mb-4">
              <label className="d-block mb-1">时间间隔</label>
              <Select
                value={ timeInterval }
                onChange={ this.handleSelectChange.bind(this, 'timeInterval') }
                size="large"
                className="d-block"
              >
                <Option value={ 30000 }>30秒</Option>
                <Option value={ 60000 }>1分钟</Option>
                <Option value={ 120000 }>2分钟</Option>
                <Option value={ 300000 }>5分钟</Option>
                <Option value={ 600000 }>10分钟</Option>
              </Select>
            </Col>
            <Col lg={ 6 } xxl={ 3 } className="mb-4">
              <label className="mb-1 d-lg-block d-none">&nbsp;</label>
              <Button onClick={ this.handleSearch } type="primary" size="large" block>搜索</Button>
            </Col>
          </Row>
        </div>
        <List
          grid={ { gutter: 24, lg: 2, xl: 3 } }
          dataSource={ charts }
          loading={ loading }
          pagination={ {
            onChange: this.handlePageChange,
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showTotal: total => `共 ${total} 条`
          } }
          renderItem={ chart => (
            <List.Item key={ chart.methodName }>
              <Card bodyStyle={ { padding: 0 } }>
                <div
                  ref={ this.setOption.bind(this, chart) }
                  className="p-4 w-100"
                  style={ { height: 400 } }
                />
                <div className="px-4 py-3 border-top">
                  <p className="text-single-ellipsis text-center mb-2">{ chart.appName }</p>
                  <Tooltip title={ chart.methodName }>
                    <p className="text-single-ellipsis text-center mb-0">{ removeParams(chart.methodName) }</p>
                  </Tooltip>
                </div>
              </Card>
            </List.Item>
          ) }
        />
      </div>
    );
  }
}

export default TP99;
