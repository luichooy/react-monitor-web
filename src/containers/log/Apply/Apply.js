import React, { Component } from 'react';
import { Card, Table, Tag, Modal, message, Divider, Button } from 'antd';
import CreateModifyApplyModal from './CreateModifyApplyModal';
import './apply.css';

const { Column, ColumnGroup } = Table;
const confirm = Modal.confirm;
const APPLYMODAL = {
  ADD: {
    type: 'ADD',
    title: '新增申请'
  },
  EDIT: {
    type: 'EDIT',
    title: '修改申请'
  }
};

class LogApply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      applyModalVisible: false,
      applies: [],
      currentpage: 1,
      total: 0
    };
    
    this.applyModal = APPLYMODAL.ADD;
    
    this.handleCurrentpageChange = this.handleCurrentpageChange.bind(this);
  }
  
  componentDidMount() {
    this.getApplies();
  }
  
  getApplies() {
    const self = this;
    window.$get({
      url: `customs/monitor/log/apply/list/${this.state.currentpage}/10`,
      success(res) {
        self.setState({
          applies: res.data.result,
          total: res.data.totalCount
        });
      }
    });
  }
  
  addApply(form) {
    const self = this;
    window.$post({
      url: 'customs/monitor/log/apply/join',
      params: form,
      success(res) {
        self.getApplies();
        self.closeApplyModal();
        // this.$message.success('申请成功，请等待审核');
      },
      201(res) {
        self.getApplies();
        self.closeApplyModal();
        // this.$alert(res.message, '提示', {
        //   type: 'warning'
        // });
      }
    });
  };
  
  modifyApply(form) {
    const self = this;
    window.$post({
      url: 'customs/monitor/log/apply/modify',
      params: form,
      success(res) {
        self.getApplies();
        self.closeApplyModal();
        // self.$message.success('修改成功！');
      },
      201(res) {
        self.getApplies();
        self.closeApplyModal();
        // self.$alert(res.message, '提示', {
        //   type: 'warning'
        // });
      }
    });
  };
  
  deleteStrategy(id) {
    confirm({
      title: '提示',
      content: '此操作将永久删除该申请, 是否继续?',
      okText: '删除',
      onOk: () => {
        return new Promise((reslove, reject) => {
          window.$delete({
            url: `customs/monitor/log/apply/delete/${id}`,
            success: (res) => {
              reslove();
              this.getApplies();
              message.success('删除成功');
            }
          });
        });
      },
      onCancel() {}
    });
  }
  
  handleSubmit = () => {
    const form = this.applyForm.props.form;
    form.validateFields((err, fields) => {
      if (err) {
        return;
      }
      
      delete fields.keys;
      let logFileInfoList = fields.logFileInfoList.filter(item => item !== null);
      fields.logFileInfoList = logFileInfoList;
      
      if (this.applyModal.type === 'ADD') {
        this.addApply(fields);
      } else {
        fields.id = this.fields.id;
        this.modifyApply(fields);
      }
      this.closeApplyModal();
    });
  };
  
  showApplyModal = (type, fields) => {
    this.applyModal = APPLYMODAL[type];
    
    if (type === 'EDIT') {
      this.fields = fields;
    } else {
      this.fields = null;
    }
    
    this.setState({
      applyModalVisible: true
    });
  };
  
  closeApplyModal = () => {
    const form = this.applyForm.props.form;
    form.resetFields();
    this.setState({ applyModalVisible: false });
  };
  
  handleCurrentpageChange(page, pageSize) {
    this.setState({
      currentpage: page
    }, this.getApplies);
  };
  
  saveApplyFormRef = (formRef) => {
    this.applyForm = formRef;
  };
  
  render() {
    const paginationTotal = (total, range) => {
      return <span>共 { total } 条</span>;
    };
    
    const generateTableStrategy = (text, record, index) => {
      if (!record.duration) return null;
      switch (record.strategy) {
        case 'hour':
          return record.duration + '小时';
        case 'day':
          return record.duration + '天';
        case 'week':
          return record.duration + '周';
        case 'month':
          return record.duration + '月';
        case 'year':
          return record.duration + '年';
        default:
          return null;
      }
    };
    
    const generateTableStatus = status => {
      switch (status) {
        case 'Y':
          return <Tag color="blue">审核通过</Tag>;
        case 'N':
          return <Tag color="red">审核不通过</Tag>;
        case 'W':
          return <Tag color="orange">待审核</Tag>;
        default:
          return null;
      }
    };
    
    const generateTableAction = (text, record) => {
      return (
        <span>
          <span className="link-btn">审核</span>
          <Divider type="vertical"/>
          <span onClick={ this.showApplyModal.bind(this, 'EDIT', record) } className="link-btn">编辑</span>
          <Divider type="vertical"/>
          <span onClick={ this.deleteStrategy.bind(this, record.id) } className="link-btn">删除</span>
        </span>
      );
    };
    
    const { applyModalVisible } = this.state;
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center py-3 mb-4">
          <h2>接入申请</h2>
          <Button
            onClick={ this.showApplyModal.bind(this, 'ADD') }
            type="primary"
            icon="plus"
            size="large"
            style={ { 'borderRadius': '60rem' } }
          >
            新增申请
          </Button>
        </div>
        <Card title="申请列表">
          <Table
            dataSource={ this.state.applies }
            rowKey="id"
            pagination={ {
              current: this.state.currentpage,
              showQuickJumper: true,
              total: this.state.total,
              hideOnSinglePage: true,
              showTotal: paginationTotal,
              onChange: this.handleCurrentpageChange
            } }
            bordered
          >
            <Column
              title="应用名"
              dataIndex="appName"
              align="center"
            />
            <ColumnGroup title="日志量（条/天）">
              <Column
                title="均值"
                dataIndex="generalLogSize"
                align="center"
              />
              <Column
                title="峰值"
                dataIndex="peakLogSize"
                align="center"
              />
            </ColumnGroup>
            <Column
              title="索引策略"
              align="center"
              render={ generateTableStrategy }
            />
            <Column
              title="申请时间"
              dataIndex="createTime"
              align="center"
            />
            <Column
              title="更新时间"
              dataIndex="updateTime"
              align="center"
            />
            <Column
              title="状态"
              dataIndex="status"
              render={ generateTableStatus }
              align="center"
            />
            <Column
              title="操作"
              render={ generateTableAction }
              align="center"
            />
          </Table>
        </Card>
        <CreateModifyApplyModal
          wrappedComponentRef={ this.saveApplyFormRef }
          modalType={ this.applyModal }
          fields={ this.fields }
          visible={ applyModalVisible }
          onCancel={ this.closeApplyModal }
          onConfirm={ this.handleSubmit }
        />
      </div>
    );
  }
}


export default LogApply;
