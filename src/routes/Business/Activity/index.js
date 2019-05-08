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
import axios from 'axios'
import moment from "moment";
import { _getCookie, _setCookie } from "../../../utils/Session"
const { Column } = Table;
class Activity extends React.Component {
  state = {
    expand: false,
    loading: false,
    total: 1,
    dataSource: []
  };

  // To generate mock Form.Item

  handleSearch = e => {
    const id = parseInt(_getCookie("userId"));
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.createTime = values["createTime"].format("YYYY-MM-DD");
        values.endTime = values["endTime"].format("YYYY-MM-DD");
        console.log(values);
        axios
          .post("http://localhost:8080/TradingArea/activity/acPage", {
            pageNum: "1",
            pageSize: "10",
            condition: {
              userId: id,
              acId: parseInt(values.acId),
              acName: values.acName,
              storeName: values.storeName,
              acState: parseInt(values.acState),
              createTime: values.createTime,
              endTime: values.endTime
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
  handleRelease = (acId, acState) => {
    console.log(acId);
    if (acState === 0) {
      axios
        .post("http://localhost:8080/TradingArea/activity/addOrUpdate", {
          activityId: acId,
          activityState: 1
        })
        .then(response => {
          if (response.data === 1) {
            message.success("活动已上线");
            const history = this.props.history;
            const id = parseInt(_getCookie("userId"));
            axios
              .post(
                "http://localhost:8080/TradingArea/activity/acPage",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {
                    userId: id,
                    createTime: "2010-02-20",
                    endTime: "3000-10-23"
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
                history.push(`activity?page=1`);
                // history.push(`activity`);
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
          activityId: acId,
          activityState: 0
        })
        .then(response => {
          if (response.data === 1) {
            message.warning("活动已下线");
            const history = this.props.history;
            const id = parseInt(_getCookie("userId"));
            axios
              .post(
                "http://localhost:8080/TradingArea/activity/acPage",
                {
                  pageNum: "1",
                  pageSize: "10",
                  condition: {
                    userId: id,
                    createTime: "2010-02-20",
                    endTime: "3000-10-23"
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
                history.push(`activity?page=1`);
                // history.push(`activity`);
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
    const id = parseInt(_getCookie("userId"));
    axios
      .post("http://localhost:8080/TradingArea/activity/acPage", {
        "pageNum":"1",
        "pageSize":"10",
        "condition":{
          "userId":id,
          "createTime":"2010-02-20",
          "endTime":"3000-10-23"
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`activity?page=1`);
        // history.push(`activity`);
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
     const id = parseInt(_getCookie("userId"));
     axios
       .post("http://localhost:8080/TradingArea/activity/acPage", {
         pageNum: page,
         pageSize: "10",
         condition: {
           userId: id,
           createTime: "2010-02-20",
           endTime: "3000-10-23"
         }
       })
       .then(response => {
         this.setState({
           loading: false,
           dataSource: response.data.list,
           total: response.data.totalRecord
         });
         console.log(response);
         history.push(`activity?page=${page}`);
         // history.push(`activity`);
       })
       .catch(function(error) {
         console.log(error);
       });
  };

  handleReset = () => {
    this.props.form.resetFields();
    const history = this.props.history;
    const id = parseInt(_getCookie("userId"));
    axios
      .post("http://localhost:8080/TradingArea/activity/acPage", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          userId: id,
          createTime: "2010-02-20",
          endTime: "3000-10-23"
        }
      })
      .then(response => {
        this.setState({
          loading: false,
          dataSource: response.data.list,
          total: response.data.totalRecord
        });
        console.log(response);
        history.push(`activity?page=1`);
        // history.push(`activity`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
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
        <Form
          className="ant-advanced-search-form"
          onSubmit={this.handleSearch}
        >
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label={`活动ID`}>
                {getFieldDecorator("acId", {
                  rules: [
                    {
                      required: false,
                      message: "请输入活动编号"
                    }
                  ]
                })(<Input placeholder="活动ID" id="acId" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`活动名称`}>
                {getFieldDecorator("acName", {
                  rules: [
                    {
                      required: false,
                      message: "请输入活动名称"
                    }
                  ]
                })(<Input placeholder="活动名称" id="acName" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商铺名称`}>
                {getFieldDecorator("storeName", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商铺名称"
                    }
                  ]
                })(<Input placeholder="商铺名称" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`活动状态`}>
                {getFieldDecorator("acState", {
                  initialValue: "1",
                  rules: [
                    {
                      required: false,
                      message: "请选择活动状态"
                    }
                  ]
                })(
                  <Select span={8} id="acState">
                    <Option value="1">上线</Option>
                    <Option value="0">下线</Option>
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
                  initialValue: moment("2015-09-06"),
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
          rowKey="acId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          pagination={{
            current: page,
            total: this.state.total,
            onChange: this.onChange
          }}
        >
          <Column title="活动编号" dataIndex="acId" id="acId" />
          <Column title="活动名称" dataIndex="acName" id="acName" />
          <Column title="活动店铺" dataIndex="storeName" id="storeName" />
          <Column
            title="活动折扣"
            dataIndex="acDiscount"
            id="acDiscount"
          />
          <Column title="创建时间" dataIndex="createTime" id="createTime" />
          <Column title="结束时间" dataIndex="endTime" id="endTime" />
          <Column
            title="操作"
            id="action"
            render={(text, record) => (
              <span>
                <a
                  onClick={this.handleRelease.bind(
                    this,
                    record.acId,
                    record.acState
                    // console.log(record.state)
                  )}
                >
                  {record.acState === 0 ? "上线" : "下线"}
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(Activity);
