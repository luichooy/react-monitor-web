import React, { Component } from 'react';
import { Modal, Select, DatePicker } from 'antd';
import './index.css';
import moment from 'moment';

const Option = Select.Option;

class SearchSetting extends Component {
  
  disabledStartTime = (startTime) => {
    // console.log(startTime.valueOf());
    const endTime = this.props.data.end_time;
    if (!startTime || !endTime) {
      return false;
    }
    return startTime.valueOf() > endTime.valueOf();
  };
  
  disabledEndTime = (endTime) => {
    const startTime = this.props.data.start_time;
    if (!endTime || !startTime) {
      return false;
    }
    return endTime.valueOf() <= startTime.valueOf();
  };
  
  render() {
    const { appOptions, ipOptions, data, onChange } = this.props;
    
    return (
      <Modal
        title="搜索设置"
        visible={ this.props.visible }
        onCancel={ this.props.handleCancel }
        footer={ null }
        wrapClassName="setting-modal"
        width={ 360 }
      >
        <div className="mb-4">
          <label className="d-block mb-1">应用名：</label>
          <Select
            value={ data.app_id }
            onChange={ value => onChange('app_id', value) }
            allowClear
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
            value={ data.server_ip }
            onChange={ value => onChange('server_ip', value) }
            mode="multiple"
            disabled={ !data.app_id }
            style={ { width: '100%' } }
          >
            { ipOptions.map(ip => {
              return <Option value={ ip.value } key={ ip.value }>{ ip.text }</Option>;
            }) }
          </Select>
        </div>
        <div className="mb-4">
          <label className="d-block mb-1">开始时间：</label>
          <DatePicker
            value={ data.start_time ? moment(data.start_time) : '' }
            onChange={ (date, dateStr) => onChange('start_time', date ? date.valueOf() : '') }
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            disabledDate={ this.disabledStartTime }
            placeholder="开始时间"
            style={ { width: '100%' } }
          />
        </div>
        <div className="mb-4">
          <label className="d-block mb-1">结束时间：</label>
          <DatePicker
            value={ data.end_time ? moment(data.end_time) : '' }
            onChange={ (date, dateStr) => onChange('end_time', date ? date.valueOf() : '') }
            format="YYYY-MM-DD HH:mm:ss"
            showTime
            disabledDate={ this.disabledEndTime }
            placeholder="结束时间"
            style={ { width: '100%' } }
          />
        </div>
      </Modal>
    );
  }
}

export default SearchSetting;
