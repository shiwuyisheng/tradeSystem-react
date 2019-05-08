import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Table,
  Divider,
  message,
  Select
} from "antd";
import { Link } from "react-router-dom";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import axios from 'axios'
const { Column } = Table;
class TradingArea extends Component {
  state = {
    expand: false,
    loading: false,
    total: 1,
    dataSource: []
  };
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios
          .post("http://localhost:8080/TradingArea/trade/page", {
            pageNum: "1",
            pageSize: "10",
            condition: {
              tradeId: parseInt(values.tradeId),
              tradeLocation: values.tradeLocation,
              tradeName: values.tradeName,
              tradePhone: values.tradePhone,
              tradeState: parseInt(values.tradeState),
            }
          })
          .then(response => {
            console.log(response.data.list);
            this.setState({ dataSource: response.data.list });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
  };
  handleRelease = (tradeId, tradeState) => {
    console.log(tradeId);
    if (tradeState === 0) {
      axios
        .post("http://localhost:8080/TradingArea/trade/addOrUpdate", {
          tradeId: tradeId,
          tradeState: 1
        })
        .then(response => {
          if (response.data === 1) {
            message.success("商圈已上线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/trade/page",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {}
                }
              )
              .then(response => {
                this.setState({
                  loading: false,
                  dataSource: response.data.list,
                  total: response.data.totalRecord
                });
                console.log(response);
                history.push(`tradelists?page=1`);
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    } else {
      axios
        .post("http://localhost:8080/TradingArea/trade/addOrUpdate", {
          tradeId: tradeId,
          tradeState: 0
        })
        .then(response => {
          if (response.data === 1) {
            message.warning("商圈已下线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/trade/page",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {}
                }
              )
              .then(response => {
                this.setState({
                  loading: false,
                  dataSource: response.data.list,
                  total: response.data.totalRecord
                });
                console.log(response);
                history.push(`tradelists?page=1`);
              })
              .catch(function(error) {
                console.log(error);
              });
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  };
  componentDidMount() {
    const history = this.props.history;
    axios
      .post("http://localhost:8080/TradingArea/trade/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {}
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`tradelists?page=1`);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  handleReset = () => {
    this.props.form.resetFields();
    const history = this.props.history;
    axios
      .post("http://localhost:8080/TradingArea/trade/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {}
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`tradelists?page=1`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  onChange = page => {
    console.log({ page: page });
    this.setState({
      loading: true
    });
    const history = this.props.history;
    axios
      .post("http://localhost:8080/TradingArea/trade/page", {
        pageNum: page,
        pageSize: "10",
        condition: {}
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`tradelists?page=${page}`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    
    function getQueryString(name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var reg_rewrite = new RegExp("(^|/)" + name + "/([^/]*)(/|$)", "i");
      var r = window.location.search.substr(1).match(reg);
      var q = window.location.pathname.substr(1).match(reg_rewrite);
      if (r != null) {
        return unescape(r[2]);
      } else if (q != null) {
        return unescape(q[2]);
      } else {
        return null;
      }
    }
    const page = parseInt(getQueryString("page"));
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label={`商圈ID`}>
                {getFieldDecorator("tradeId", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商圈ID"
                    }
                  ]
                })(<Input placeholder="商圈ID" id="tradeId" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商圈名称`}>
                {getFieldDecorator("tradeName", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商圈名称"
                    }
                  ]
                })(<Input placeholder="商圈名称" id="tradeName" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商圈状态`}>
                {getFieldDecorator("tradeState", {
                  initialValue: "0",
                  rules: [
                    {
                      required: false,
                      message: "请选择商圈状态"
                    }
                  ]
                })(
                  <Select span={8} id="tradeState">
                    <Option value="0">下线</Option>
                    <Option value="1">上线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商圈管理员帐号`}>
                {getFieldDecorator("userNum", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商圈管理员帐号"
                    }
                  ]
                })(<Input placeholder="商圈管理员帐号" id="userNum" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商圈热线`}>
                {getFieldDecorator("tradePhone", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商圈热线"
                    }
                  ]
                })(<Input placeholder="商圈热线" id="tradePhone" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商圈位置`}>
                {getFieldDecorator("tradeLocation", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商圈位置"
                    }
                  ]
                })(<Input placeholder="商圈位置" id="tradeLocation" />)}
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>
                清空
              </Button>
            </Col>
          </Row>
        </Form>
        <Divider />
        <Table
          rowKey="tradeId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          pagination={{
            current: page,
            total: this.state.total,
            onChange: this.onChange
          }}
        >
          <Column title="商圈编号" dataIndex="tradeId" id="tradeId" />
          <Column title="商圈名称" dataIndex="tradeName" id="tradeName" />
          <Column
            title="商圈位置"
            dataIndex="tradeLocation"
            id="tradeLocation"
          />
          <Column
            title="商圈管理员"
            dataIndex="user.userNum"
            id="user.userNum"
          />

          <Column
            title="操作"
            id="action"
            render={(text, record) => (
              <span>
                <Link to={`tradelists/${record.tradeId}`}>编辑</Link>
                <Divider type="vertical" />
                <a
                  onClick={this.handleRelease.bind(
                    this,
                    record.tradeId,
                    record.tradeState
                    // console.log(record.state)
                  )}
                >
                  {record.tradeState === 0 ? "上线" : "下线"}
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(TradingArea);


