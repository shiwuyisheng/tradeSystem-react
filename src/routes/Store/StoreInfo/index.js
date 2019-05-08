import { Modal, Form, Input, Select, Button } from "antd";
import React, { Component } from "react";
import axios from "axios";
import PicturesWall from "../../../components/UpLoad/UpLoad";
import { withRouter } from "react-router-dom";
import { _setCookie,_getCookie } from "../../../utils/Session";

class StoreInfo extends Component {
  constructor() {
    super();
    this.state = {
      confirmDirty: false,
      data: "",
      fileList: [],
      storeId: "",
      userNum: ""
    };
  }

  componentDidMount = () => {
    const id = parseInt(_getCookie("userId"));
    axios
      .post("http://localhost:8080/TradingArea/store/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          user: {
            userId: id
          }
        }
      })
      .then(response => {
        console.log(response);
        this.setState({
          data: response.data.list[0],
          fileList: response.data.list[0].storePicList,
          userNum: response.data.list[0].user.userNum,
          storeId: response.data.list[0].storeId
        });
        // form.setFieldsValue({ storePicList: fileList });
      })
      .catch(function(error) {
        console.log(error);
      });
  };
  handleOnChange = ({ fileList }) => {
    console.log(fileList);
    return fileList.map(file => ({
      status: file.status,
      uid: file.response ? file.response.data.pictureId : file.uid,
      pictureId: file.response ? file.response.data.pictureId : file.uid,
      url: file.response ? file.response.data.url : file.url || file.thumbUrl
    }));
  };
  handleSubmit = e => {
    const history = this.props.history;
    // ????
    const userId = parseInt(_getCookie("userId"));
    const id = this.state.storeId;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios
          .post("http://localhost:8080/TradingArea/user/update", {
            userId: userId,
            userPassword: values.userPassword
          })
          .then(response => {
            if (response.data === 1) {
              axios
                .post(
                  "http://localhost:8080/TradingArea/store/addOrUpdate",
                  {
                    storeId: parseInt(id),
                    storeLocation: values.storeLocation,
                    storeName: values.storeName,
                    storePhone: values.storePhone,
                    storePicList: values.storePicList,
                    storeRemark: values.storeRemark,
                    storeType: values.storeType,
                    user: {
                      userNum: values.userNum
                    }
                  }
                )
                .then(response => {
                  if (response.data === 1) {
                    Modal.confirm({
                      title: "保存成功",
                      okText: "重新登录",
                      onOk() {
                        history.push("/login");
                      }
                    });
                  }
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
    });
  };
  handleConfirmBlur = e => {
    const value = e.target.value;
    this.setState({ confirmDirty: this.state.confirmDirty || !!value });
  };

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue("userPassword")) {
      callback("两次密码输入不一致!");
    } else {
      callback();
    }
  };

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(["confirm"], { force: true });
    }
    callback();
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const Option = Select.Option;
    const that = this.state.data;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <Form.Item
            layout="inline"
            label="商铺名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storeName", {
              initialValue: that.storeName,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商铺名称"
                }
              ]
            })(
              <Input
                id="storeName"
                placeholder="请输入商铺名称"
                maxLength={15}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商铺类型"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storeType", {
              initialValue: that.storeType,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商铺类型"
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
          <Form.Item
            layout="inline"
            label="商铺地址"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storeLocation", {
              validateTrigger: "onBlur",
              initialValue: that.storeLocation,
              rules: [
                {
                  required: true,
                  message: "请输入商铺地址"
                }
              ]
            })(
              <Input
                placeholder="请输入商铺地址"
                id="storeLocation"
                maxLength={10}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商铺简介"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storeRemark", {
              validateTrigger: "onBlur",
              initialValue: that.storeRemark,
              rules: [
                {
                  required: true,
                  message: "请输入商铺简介"
                }
              ]
            })(
              <TextArea
                placeholder="请输入商铺简介"
                id="storeRemark"
                rows={4}
                maxLength={200}
              />
            )}
          </Form.Item>
          <Form.Item
            label="商铺热线"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storePhone", {
              validateTrigger: "onBlur",
              initialValue: that.storePhone,
              rules: [
                {
                  required: true,
                  message: "请输入商铺热线"
                }
              ]
            })(
              <Input
                id="storePhone"
                placeholder="请输入商铺热线"
                maxLength={11}
              />
            )}
          </Form.Item>
          <Form.Item
            label="管理员联系方式"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("userNum", {
              validateTrigger: "onBlur",
              initialValue: this.state.userNum,
              rules: [
                {
                  required: true,
                  message: "请输入管理员联系方式"
                }
              ]
            })(
              <Input
                id="userNum"
                placeholder="请输入管理员联系方式"
                maxLength={11}
              />
            )}
          </Form.Item>
          <Form.Item
            label="输入新密码"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("userPassword", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入新密码"
                },
                {
                  validator: this.validateToNextPassword
                }
              ]
            })(
              <Input
                type="password"
                id="userPassword"
                placeholder="请输入新密码"
              />
            )}
          </Form.Item>
          <Form.Item
            label="再次输入密码"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("confirm ", {
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请再次输入新密码"
                },
                {
                  validator: this.compareToFirstPassword
                }
              ]
            })(
              <Input
                type="password"
                id="userPassword"
                placeholder="请再次输入新密码"
                onBlur={this.handleConfirmBlur}
              />
            )}
          </Form.Item>
          <Form.Item
            label="商铺图片"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("storePicList", {
              initialValue: that.storePicList,
              validateTrigger: "onBlur",
              valuePropName: "fileList",
              getValueFromEvent: this.handleOnChange,
              rules: [
                {
                  required: true
                }
              ]
            })(<PicturesWall imgNumber={4} />)}
          </Form.Item>

          <Form.Item wrapperCol={{ span: 12, offset: 12 }}>
            <Button type="primary" htmlType="submit">
              保存
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default withRouter(Form.create()(StoreInfo));
