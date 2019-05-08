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
class Commodity extends React.Component {
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
        console.log(values);
        values.commodityPrice = values.commodityPrice.split(",");
        values.commodityPrice[0] = parseFloat(values.commodityPrice[0]);
        values.commodityPrice[1] = parseFloat(values.commodityPrice[1]);
        axios
          .post("http://localhost:8080/TradingArea/commodity/page", {
            pageNum: "1",
            pageSize: "10",
            condition: {
              commodityId: parseInt(values.commodityId),
              commodityName: values.commodityName,
              priceInterval: values.commodityPrice,
              commodityState: parseInt(values.commodityState)
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
      .post("http://localhost:8080/TradingArea/commodity/page", {
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
        history.push(`commoditylists?page=1`);
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  handleRelease = (commodityId, commodityState) => {
    if (commodityState === 0) {
      axios
        .post("http://localhost:8080/TradingArea/commodity/addOrUpdate", {
          commodityState: 1,
          commodityId: commodityId
        })
        .then(response => {
          if (response.data === 1) {
            message.success("商品已上线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/commodity/page",
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
                history.push(`commoditylists?page=1`);
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
        .post("http://localhost:8080/TradingArea/commodity/addOrUpdate", {
          commodityState: 0,
          commodityId:commodityId
        })
        .then(response => {
          if (response.data === 1) {
            message.warning("商圈已下线");
            const history = this.props.history;
            axios
              .post(
                "http://localhost:8080/TradingArea/commodity/page",
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
                history.push(`commoditylists?page=1`);
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
      .post("http://localhost:8080/TradingArea/commodity/page", {
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
        history.push(`commoditylists?page=1`);
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
      .post("http://localhost:8080/TradingArea/commodity/page", {
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
        history.push(`commoditylists?page=${page}`);
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
        <Form className="ant-advanced-search-form" onSubmit={this.handleSearch}>
          <Row gutter={24}>
            <Col span={8}>
              <Form.Item label={`商品编号`}>
                {getFieldDecorator("commodityId", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商品编号"
                    }
                  ]
                })(<Input placeholder="商品编号" id="commodityId" />)}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商品名称`}>
                {getFieldDecorator("commodityName", {
                  rules: [
                    {
                      required: false,
                      message: "请输入商品名称"
                    }
                  ]
                })(<Input placeholder="商品名称" id="commodityName" />)}
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item label={`商品状态`}>
                {getFieldDecorator("commodityState", {
                  initialValue: "1",
                  rules: [
                    {
                      required: false,
                      message: "请选择商品状态"
                    }
                  ]
                })(
                  <Select span={8} id="commodityState">
                    <Option value="1">上线</Option>
                    <Option value="0">下线</Option>
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label={`商品价格`}>
                {getFieldDecorator("commodityPrice", {
                  initialValue: "0,200.00",
                  rules: [
                    {
                      required: false,
                      message: "请选择商品价格"
                    }
                  ]
                })(
                  // <Slider id="commodityPrice" range step={10} />
                  <Select span={8} id="commodityPrice">
                    <Option value="0,200.00">200以下</Option>
                    <Option value="200.00,400.00">200-400</Option>
                    <Option value="400.00,600.00">400-600</Option>
                    <Option value="600.00,800.00">600-800</Option>
                    <Option value="800.00,1000.00">800-1000</Option>
                    <Option value="1000.00,10000000.00">1000以上</Option>
                  </Select>
                )}
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
          rowKey="commodityId"
          loading={this.state.loading}
          dataSource={this.state.dataSource}
          pagination={{
            current: page,
            total: this.state.total,
            onChange: this.onChange
          }}
        >
          <Column title="商品编号" dataIndex="commodityId" id="commodityId" />
          <Column
            title="商品名称"
            dataIndex="commodityName"
            id="commodityName"
          />
          <Column
            title="商品价格"
            dataIndex="commodityPrice"
            id="commodityPrice"
          />
          <Column
            title="商品备注"
            dataIndex="commodityRemark"
            id="commodityRemark"
          />
          <Column
            title="操作"
            id="action"
            render={(text, record) => (
              <span>
                <Link to={`commoditylists/${record.commodityId}`}>编辑</Link>
                <Divider type="vertical" />
                <a
                  onClick={this.handleRelease.bind(
                    this,
                    record.commodityId,
                    record.commodityState
                    // console.log(record.state)
                  )}
                >
                  {record.commodityState === 0 ? "上线" : "下线"}
                </a>
              </span>
            )}
          />
        </Table>
      </div>
    );
  }
}
export default Form.create()(Commodity);
