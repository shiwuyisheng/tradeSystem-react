import {  Divider, Modal, Form, Input, Button } from "antd";
import React, { Component } from "react";
import PicturesWall from "../../../components/UpLoad/UpLoad";
import axios from "axios";
// import { withRouter } from 'react-router-dom';

class TradingAreaInfo extends Component {
  constructor(){
    super();
    this.state = {
      data:'',
      fileList: [],
      userNum:''
    }
  }

  componentDidMount = () => {
    const id = this.props.match.params.tradeId
    console.log(this.props.match.params,this.props.location,this.props.location.search);
    // axios.get('http://yapi.demo.qunar.com/mock/64904/tradelist/1', {
      axios.post('http://localhost:8080/TradingArea/trade/page', {
          "pageNum": '1',
          "pageSize": "10",
          "condition": {
            'tradeId': id
          }
          })
    .then( (response) =>{
      console.log(response.data.list[0]);
      this.setState({
        data: response.data.list[0],
        fileList: response.data.list[0].tradePicList,
        userNum: response.data.list[0].user.userNum
      });
      // form.setFieldsValue({ tradePicList: fileList });
    })
    .catch(function (error) {
      console.log(error);
    });
  };
   handleOnChange = ({ fileList }) => {
    console.log(fileList)
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
    const history = this.props.history
    const id = this.props.match.params.tradeId;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios.post('http://localhost:8080/TradingArea/trade/addOrUpdate', {
        'tradeId':id,
        'tradeLocation': values.tradeLocation,
            'tradeName': values.tradeName,
            'tradePhone': values.tradePhone,
            'tradePicList': values.tradePicList,
            'tradeRemark': values.tradeRemark,
            'user':
              {'userNum': values.userNum}
          })
          .then( (response) =>{
            if(response.data === 1){
              Modal.confirm({
              title: '保存成功',
              okText: '返回列表',
              onOk() {
                  history.push(`/home/admin/tradelists?page=1`)
              },
            })
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { TextArea } = Input;
    const that = this.state.data
    return (
      <div>
        <Divider />
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <Form.Item
            layout="inline"
            label="商圈名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("tradeName", {
              initialValue: that.tradeName,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商圈名称"
                }
              ]
            })(
              <Input
                id="tradeName"
                placeholder="请输入商圈名称"
                maxLength={15}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商圈地址"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("tradeLocation", {
              initialValue: that.tradeLocation,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商圈地址"
                }
              ]
            })(
              <Input
                placeholder="请输入商圈地址"
                id="tradeLocation"
                maxLength={10}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商圈简介"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("tradeRemark", {
              initialValue: that.tradeRemark,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商圈简介"
                }
              ]
            })(
              <TextArea
                placeholder="请输入商圈简介"
                id="tradeRemark"
                rows={4}
                maxLength={200}
              />
            )}
          </Form.Item>
          <Form.Item
            label="商圈热线"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("tradePhone", {
              initialValue: that.tradePhone,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请输入商圈热线"
                }
              ]
            })(
              <Input
                id="tradePhone"
                placeholder="请输入商圈热线"
                maxLength={11}
              />
            )}
          </Form.Item>
          <Form.Item
            label="店长联系方式"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("userNum", {
              validateTrigger: "onBlur",
              initialValue: this.state.userNum,
              rules: [
                {
                  required: true,
                  message: "请输入店长联系方式"
                }
              ]
            })(
              <Input
                id="userNum"
                placeholder="请输入店长联系方式"
                maxLength={11}
              />
            )}
          </Form.Item>
          <Form.Item
            label="商圈图片"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("tradePicList", {
              initialValue: that.tradePicList||[],
              valuePropName: "fileList",
              getValueFromEvent: this.handleOnChange,
              validateTrigger: "onBlur",
              rules: [
                {
                  required: true,
                  message: "请上传商圈图片"
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
export default (Form.create()(TradingAreaInfo));

