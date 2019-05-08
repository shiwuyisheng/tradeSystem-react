import {
  Form,
  Row,
  Col,
  Input,
  Button,
  DatePicker,
  Select,
  Table,
  Divider,
  message
} from "antd";
import React from "react";
import moment from "moment";
import axios from "axios";
import { Link } from "react-router-dom";
const { Column } = Table;
class StoreActivity extends React.Component {
  state = {
    expand: false,
    loading: false,
    total: 1,
    dataSource: []
  };

  // To generate mock Form.Item

  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.createTime = values["createTime"].format("YYYY-MM-DD");
        values.endTime = values["endTime"].format("YYYY-MM-DD");
        console.log("Received values of form: ", values);
        axios
          .post("http://localhost:8080/TradingArea/activity/page", {
            pageNum: "1",
            pageSize: "10",
            condition: {
              activityId: parseInt(values.activityId),
              activityName: values.activityName,
              activityPhone: values.activityPhone,
              activityState: values.activityState,
              createTime: values.createTime,
              endTime: values.endTime
            }
          })
          .then(response => {
            console.log(response);
            this.setState({ dataSource: response.data.list });
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
  };

  handleReset = () => {
    this.props.form.resetFields();
    const history = this.props.history;
    axios
      .post("http://localhost:8080/TradingArea/activity/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          createTime: "1998-01-01",
          endTime: "3000-12-31"
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`storeactivitylists?page=1`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };
  handleRelease = (activityId, activityState) => {
    if (activityState === 0) {
      axios
        .post("http://localhost:8080/TradingArea/activity/addOrUpdate", {
          activityState: 1,
          activityId:activityId
        })
        .then(response => {
          if (response.data === 1) {
            message.success("活动已上线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/activity/page",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {
                    createTime: '1998-01-01',
                    endTime: '3000-12-31'
                  }
                }
              )
              .then(response => {
                this.setState({
                  loading: false,
                  dataSource: response.data.list,
                  total: response.data.totalRecord
                });
                console.log(response);
                history.push(`storeactivitylists?page=1`);
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
        .post("http://localhost:8080/TradingArea/activity/addOrUpdate", {
          activityState: 0,
          activityId:activityId
        })
        .then(response => {
          if (response.data === 1) {
            message.warning("活动已下线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/activity/page",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {
                    createTime: '1998-01-01',
                    endTime: '3000-12-31'
                  }
                }
              )
              .then(response => {
                this.setState({
                  loading: false,
                  dataSource: response.data.list,
                  total: response.data.totalRecord
                });
                console.log(response);
                history.push(`storeactivitylists?page=1`);
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
      .post("http://localhost:8080/TradingArea/activity/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          createTime: '1998-01-01',
          endTime: '3000-12-31'
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`storeactivitylists?page=1`);
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  onChange = page => {
    console.log({ page: page });
    this.setState({
      loading: true
    });
    const history = this.props.history;
    axios
      .post("http://localhost:8080/TradingArea/activity/page", {
        pageNum: page,
        pageSize: "10",
        condition: {
          createTime: "1998-01-01",
          endTime: "3000-12-31"
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`storeactivitylists?page=${page}`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const Option = Select.Option;
    const { getFieldDecorator } = this.props.form;
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

    return (
      <div>
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label={`活动编号`}>
                {getFieldDecorator("activityId", {
                  rules: [
                    {
                      required: false,
                      message: "请输入活动编号"
                    }
                  ]
                })(<Input placeholder="活动编号" id="activityId" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`活动名称`}>
                {getFieldDecorator("activityName", {
                  rules: [
                    {
                      required: false,
                      message: "请输入活动名称"
                    }
                  ]
                })(<Input placeholder="活动名称" id="activityName" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label={`活动状态`}>
                {getFieldDecorator("activityState", {
                  initialValue: "0",
                  rules: [
                    {
                      required: false,
                      message: "请选择活动状态"
                    }
                  ]
                })(
                  <Select span={8} id="activityState">
                    <Option value="0">上线</Option>
                    <Option value="1">下线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`开始时间`}>
                {getFieldDecorator("createTime", {
                  initialValue: moment("2015-06-06"),
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(<DatePicker placeholder="开始时间" id="createTime" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`结束时间`}>
                {getFieldDecorator("endTime", {
                  initialValue: moment("2015-06-06"),
                  rules: [
                    {
                      required: false,
                      message: "Input something!"
                    }
                  ]
                })(<DatePicker placeholder="结束时间" id="endTime" />)}
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
          rowKey="activityId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          pagination={{
            current: page,
            total: this.state.total,
            onChange: this.onChange
          }}
        >
          <Column title="活动编号" dataIndex="activityId" id="activityId" />
          <Column
            title="活动名称"
            dataIndex="activityName"
            id="activityName"
          />
          <Column
            title="活动折扣"
            dataIndex="activityDiscount"
            id="activityDiscount"
          />
          <Column title="创建时间" dataIndex="createTime" id="createTime" />
          <Column title="结束时间" dataIndex="endTime" id="endTime" />
          <Column
            title="操作"
            id="action"
            render={(text, record) => (
              <span>
                <Link to={`storeactivitylists/${record.activityId}`}>
                  编辑
                </Link>
                <Divider type="vertical" />
                <a
                  onClick={this.handleRelease.bind(
                    this,
                    record.activityId,
                    record.activityState
                    // console.log(record.state)
                  )}
                >
                  {record.activityState === 0 ? "上线" : "下线"}
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(StoreActivity);
