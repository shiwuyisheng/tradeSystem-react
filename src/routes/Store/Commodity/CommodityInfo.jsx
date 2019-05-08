import {
  Table,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  Button
} from "antd";
import React, { Component } from "react";
import axios from "axios";
import { withRouter } from "react-router-dom";
import PicturesWall from "../../../components/UpLoad/UpLoad";

class commodityInfo extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      fileList: []
    };
  }

  componentDidMount = () => {
    const id = parseInt(this.props.match.params.commodityId);
    axios
      .post("http://localhost:8080/TradingArea/commodity/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          commodityId: id
        }
      })
      .then(response => {
        console.log(response);
        this.setState({
          data: response.data.list[0],
          fileList: response.data.list[0].commodityPicList
        });
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
    const id = this.props.match.params.commodityId;
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        axios
          .post(
            "http://localhost:8080/TradingArea/commodity/addOrUpdate",
            {
              commodityId: parseInt(id),
              commodityName: values.commodityName,
              commodityPrice: parseFloat(values.commodityPrice),
              commodityPicList: values.commodityPicList,
              commodityRemark: values.commodityRemark
            }
          )
          .then(response => {
            if (response.data === 1) {
              Modal.confirm({
                title: "保存成功",
                okText: "返回列表",
                onOk() {
                  history.push(
                    `/home/store/commodity/commoditylists?page=1`
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
    const that = this.state.data;
    return (
      <div>
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <Form.Item
            layout="inline"
            label="商品名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("commodityName", {
              validateTrigger: "onBlur",
              initialValue: that.commodityName,
              rules: [
                {
                  required: true,
                  message: "请输入商品名称"
                }
              ]
            })(
              <Input
                id="commodityName"
                placeholder="请输入商品名称"
                maxLength={15}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商品价格"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("commodityPrice", {
              validateTrigger: "onBlur",
              initialValue: that.commodityPrice,
              rules: [
                {
                  required: true,
                  message: "请输入商品价格"
                }
              ]
            })(
              <Input
                placeholder="请输入商品价格"
                id="commodityPrice"
                maxLength={10}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="商品简介"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("commodityRemark", {
              validateTrigger: "onBlur",
              initialValue: that.commodityRemark,
              rules: [
                {
                  required: true,
                  message: "请输入商品简介"
                }
              ]
            })(
              <TextArea
                placeholder="请输入商品简介"
                id="commodityRemark"
                rows={4}
                maxLength={200}
              />
            )}
          </Form.Item>

          <Form.Item
            label="商品图片"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("commodityPicList", {
              valuePropName: "fileList",
              initialValue: that.commodityPicList,
              getValueFromEvent: this.handleOnChange,
              validateTrigger: "onBlur",
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
export default withRouter(Form.create()(commodityInfo));
