import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  Table,
  Divider,
  message
} from "antd";
import { Link } from "react-router-dom";
import React from "react";
import axios from "axios";
const { Column } = Table;
class Shop extends React.Component {
  state = {
    expand: false,
    loading: false,
       total:1,
       dataSource: []
  };

  // To generate mock Form.Item
  handleRelease = (storeId, storeState) => {
    if (storeState === 0) {
      axios
        .post("http://localhost:8080/TradingArea/store/addOrUpdate", {
          storeState: 1,
          storeId: storeId
        })
        .then(response => {
          if (response.data === 1) {
            message.success("商铺已上线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/store/page",
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
                history.push(`storelists?page=1`);
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
        .post("http://localhost:8080/TradingArea/store/addOrUpdate", {
        storeId:storeId,  
        storeState: 0
        })
        .then(response => {
          if (response.data === 1) {
            message.warning("商铺已下线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/store/page",
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
                history.push(`storelists?page=1`);
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
      .post("http://localhost:8080/TradingArea/store/page", {
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
        history.push(`storelists?page=1`);
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
      .post("http://localhost:8080/TradingArea/store/page", {
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
        history.push(`storelists?page=${page}`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  handleSearch = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios
          .post("http://localhost:8080/TradingArea/store/page", {
            pageNum: "1",
            pageSize: "10",
            condition: {
              storeId: parseInt(values.storeId),
              storeLocation: values.storeLocation,
              storeName: values.storeName,
              storeType: values.storeType,
              storeState: values.storeState,
              
            }
          })
          .then((response) =>{
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
      .post("http://localhost:8080/TradingArea/store/page", {
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
        history.push(`storelists?page=1`);
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
              <Form.Item label={`商铺ID`}>
                {getFieldDecorator("storeId", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商铺ID"
                    }
                  ]
                })(<Input placeholder="商铺ID" id="storeId" />)}
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
                })(<Input placeholder="商铺名称" id="storeName" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商铺类型`}>
                {getFieldDecorator("storeType", {
                  initialValue: "美食",
                  rules: [
                    {
                      required: false,
                      message: "请选择商铺类型"
                    }
                  ]
                })(
                  <Select span={8} id="storeType">
                    <Option value="美食">美食</Option>
                    <Option value="服饰">服饰</Option>
                    <Option value="美妆">美妆</Option>
                    <Option value="电影/演出">电影/演出</Option>
                    <Option value="酒店住宿">酒店住宿</Option>
                    <Option value="休闲娱乐">休闲娱乐</Option>
                    <Option value="其他">其他</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商铺状态`}>
                {getFieldDecorator("storeState", {
                  initialValue: "1",
                  rules: [
                    {
                      required: false,
                      message: "请选择商铺状态"
                    }
                  ]
                })(
                  <Select span={8} id="storeState">
                    <Option value="1">上线</Option>
                    <Option value="0">下线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商铺位置`}>
                {getFieldDecorator("storeLocation", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商铺位置"
                    }
                  ]
                })(<Input placeholder="商铺位置" id="storeLocation" />)}
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
          rowKey="storeId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          pagination={{
            current: page,
            total: this.state.total,
            onChange: this.onChange
          }}
        >
          <Column title="商铺编号" dataIndex="storeId" id="storeId" />
          <Column title="商铺名称" dataIndex="storeName" id="storeName" />
          <Column title="商铺类型" dataIndex="storeType" id="storeType" />
          <Column title="商铺热线" dataIndex="storePhone" id="storePhone" />
          <Column
            title="商铺管理员"
            dataIndex="user.userNum"
            id="user.userNum"
          />
          <Column
            title="操作"
            id="action"
            render={(text, record) => (
              <span>
                <Link to={`storelists/${record.storeId}`}>编辑</Link>
                <Divider type="vertical" />
                <a
                  onClick={this.handleRelease.bind(
                    this,
                    record.storeId,
                    record.storeState
                    // console.log(record.state)
                  )}
                >
                  {record.storeState === 0 ? "上线" : "下线"}
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(Shop);



