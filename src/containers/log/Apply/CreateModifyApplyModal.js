import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Modal, Row } from 'antd';

const FormItem = Form.Item;
let id = 0;
let ids = null;

class FormModal extends Component {
  
  addConf = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(++id);
    form.setFieldsValue({
      keys: nextKeys
    });
  };
  
  removeConf(k) {
    console.log(k);
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    
    form.setFieldsValue({
      keys: keys.filter(key => key !== k)
    });
  }
  
  validateAppName = (rule, value, callback) => {
    if (!value) {
      callback(new Error('请输入应用名!'));
    } else if (/^[\u4e00-\u9fa5]+$/g.test(value)) {
      callback(new Error('应用名不能包含中文!'));
    } else if (this.modalType.type === 'ADD') {
      // 新增时校验应用名是否重复
      window.$get({
        url: `customs/monitor/log/apply/check/${value}`,
        success(res) {
          if (res.data === 'Y') {
            callback(new Error('该应用已接入，不能重复接入!'));
          } else {
            callback();
          }
        }
      });
    } else {
      callback();
    }
  };
  
  componentWillReceiveProps(props) {
    const { modalType, fields } = props;
    if (modalType.type === 'ADD') {
      id = 0;
    } else {
      id = 0;
      ids = [];
      while (id < fields.logFileInfoList.length) {
        ids.push(id);
        id++;
      }
    }
  }
  
  render() {
    const { modalType, fields, visible, onCancel, onConfirm, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;
    this.modalType = modalType;
    
    
    const formItemLayout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 20 }
    };
    
    if (this.modalType && this.modalType.type === 'ADD') {
      getFieldDecorator('keys', { initialValue: [id] });
    }
    
    // 编辑数据回显
    if (this.modalType && this.modalType.type === 'EDIT') {
      getFieldDecorator('keys', { initialValue: ids });
      
      getFieldDecorator('appName', { initialValue: fields.appName });
      getFieldDecorator('generalLogSize', { initialValue: fields.generalLogSize });
      getFieldDecorator('peakLogSize', { initialValue: fields.peakLogSize });
      
      fields.logFileInfoList.forEach((item, index) => {
        getFieldDecorator(`logFileInfoList[${index}].serverIp`, { initialValue: item.serverIp });
        getFieldDecorator(`logFileInfoList[${index}].logName`, { initialValue: item.logName });
      });
    }
    
    const keys = getFieldValue('keys');
    console.log(keys);
    
    const FormItems = keys && keys.map((key, index) => {
      const label = (
        <span>
         节点 { index + 1 } 配置
          { keys.length > 1 && <Icon onClick={ this.removeConf.bind(this, key) }
            type="close-circle"
            className="remove-trigger mx-2 text-danger"/> }
       </span>
      );
      return (
        <FormItem
          { ...formItemLayout }
          label={ label }
          key={ key }
        >
          <Row gutter={ 16 }>
            <Col span={ 12 }>
              <FormItem>
                { getFieldDecorator(`logFileInfoList[${key}].serverIp`, {
                  validateTrigger: 'onBlur',
                  rules: [
                    { required: true, message: '请输入该节点的ip' },
                    { pattern: /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/g, message: 'ip格式错误' }
                  ]
                })(
                  <Input placeholder="ip"/>
                ) }
              </FormItem>
            </Col>
            <Col span={ 12 }>
              <FormItem>
                { getFieldDecorator(`logFileInfoList[${key}].logName`, {
                  validateTrigger: 'onBlur',
                  rules: [{ required: true, message: '请输入该节点的日志路径' }]
                })(
                  <Input placeholder="日志路径"/>
                ) }
              </FormItem>
            </Col>
          </Row>
        </FormItem>
      );
    });
    
    return (
      modalType ? <Modal
        title={ modalType.title }
        visible={ visible }
        onOk={ onConfirm }
        onCancel={ onCancel }
        maskClosable={ false }
        width={ 960 }
      >
        <Form layout="horizontal">
          <FormItem
            label="应用名"
            extra={ modalType.type !== 'EDIT' && '应用名不能包含中文' }
            { ...formItemLayout }
          >
            <Row gutter={ 16 }>
              <Col span={ 12 }>
                { getFieldDecorator('appName', {
                  validateTrigger: 'onBlur',
                  rules: [{ validator: this.validateAppName }]
                })(
                  <Input disabled={ modalType.type === 'EDIT' }/>
                ) }
              </Col>
            </Row>
          </FormItem>
          { FormItems }
          <FormItem wrapperCol={ { span: 20, offset: 4 } }>
            <Button onClick={ this.addConf } type="dashed" block>
              <Icon type="plus"/> 增加节点配置
            </Button>
          </FormItem>
          <FormItem
            label="日志量（条/天）"
            { ...formItemLayout }
          >
            <Row gutter={ 16 }>
              <Col span={ 12 }>
                <FormItem>
                  { getFieldDecorator('generalLogSize', {
                    validateTrigger: [
                      'onChange',
                      'onBlur'
                    ],
                    rules: [
                      { required: true, message: '请输入均值日志量' },
                      { pattern: /^\d+$/g, message: '日志量必须为数字' }
                    ]
                  })(
                    <Input placeholder="均值日志量"/>
                  ) }
                </FormItem>
              </Col>
              <Col span={ 12 }>
                <FormItem>
                  { getFieldDecorator('peakLogSize', {
                    validateTrigger: [
                      'onChange',
                      'onBlur'
                    ],
                    rules: [
                      { required: true, message: '请输入峰值日志量' },
                      { pattern: /^\d+$/g, message: '日志量必须为数字' }
                    ]
                  })(
                    <Input placeholder="峰值日志量"/>
                  ) }
                </FormItem>
              </Col>
            </Row>
          </FormItem>
        </Form>
      </Modal> : null
    );
  }
}

const CreateModifyApplyModal = Form.create()(FormModal);

export default CreateModifyApplyModal;
