import {Modal, Form, Input, Select, Button } from "antd";
import React, { Component } from "react";
import axios from "axios";
import PicturesWall from "../../../components/UpLoad/UpLoad";
import { withRouter } from "react-router-dom";

class ShopInfo extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      fileList: [],
      userNum: ""
    };
  }

  componentDidMount = () => {
    const id = this.props.match.params.storeId;
    console.log(
      this.props.match.params,
      this.props.location,
      this.props.location.search
    );
    axios
      .post("http://localhost:8080/TradingArea/store/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          storeId: id
        }
      })
      .then(response => {
        console.log(response);
        this.setState({
          data: response.data.list[0],
        fileList: response.data.list[0].storePicList,
        userNum: response.data.list[0].user.userNum
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
      url: file.response
        ? file.response.data.url
        : file.url || file.thumbUrl
    }));
  };
  handleSubmit = e => {
    const history = this.props.history;
    const id = this.props.match.params.storeId;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios
          .post("http://localhost:8080/TradingArea/store/addOrUpdate", {
          'storeId':parseInt(id),  
          'storeLocation': values.storeLocation,
            'storeName': values.storeName,
            'storePhone': values.storePhone,
            'storePicList': values.storePicList,
            'storeRemark': values.storeRemark,
            'storeType':values.storeType,
            'user':
              {'userNum': values.userNum}
          })
          .then(response => {
            if (response.data === 1) {
              Modal.confirm({
                title: "保存成功",
                okText: "返回列表",
                onOk() {
                  history.push(
                    '/home/business/store/storelists?page=1'
                  );
                }
              });
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    });
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
export default withRouter(Form.create()(ShopInfo));
