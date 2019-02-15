import React, { Component } from 'react';

class Drilldown extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      pageSize: 10,
      pageNum: 1,
      total: 0,
      data: []
    };
  }
  
  componentDidMount() {
    const query = this.props.history.location.state;
    this.setState(preState => ({
      ...preState,
      ...query
    }), () => this.getData());
  }
  
  getData = () => {
    const that = this;
    const { appName, methodName, timeInterval, beginTime, pageSize, pageNum } = this.state;
    const query = { appName, methodName, timeInterval, beginTime, pageSize, pageNum };
    window.$post({
      url: '/customs/monitor/method/into',
      params: query,
      success(res) {
        console.log(res);
        that.setState({
          data: res.data.result,
          total: res.data.totalCount
        });
      }
    });
  };
  
  render() {
    return (
      <div>Drilldown</div>
    );
  }
}


export default Drilldown;
