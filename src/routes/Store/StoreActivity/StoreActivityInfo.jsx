import {
  Table,
  Divider,
  Modal,
  Form,
  Input,
  Select,
  Button,
  DatePicker
} from "antd";
import React, { Component } from "react";
import axios from "axios";
import PicturesWall from "../../../components/UpLoad/UpLoad";
import { withRouter } from "react-router-dom";
import moment from "moment";

class StoreactivityInfo extends Component {
  constructor() {
    super();
    this.state = {
      data: "",
      fileList: []
    };
  }

  componentDidMount = () => {
    const id = parseInt(this.props.match.params.activityId);
    console.log(
      this.props.match.params,
      this.props.location,
      this.props.location.search
    );
    axios
      .post("http://localhost:8080/TradingArea/activity/page", {
        pageNum: "1",
        pageSize: "10",
        condition: {
          activityId: id,
          createTime: "1998-01-01",
          endTime: "3000-12-31"
        }
      })
      .then(response => {
        console.log(response);
        this.setState({
          data: response.data,
          fileList: response.data.activityPicList
        });
        // form.setFieldsValue({ activityPicList: fileList });
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
    const id = parseInt(this.props.match.params.activityId);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        values.createTime = values["createTime"].format("YYYY-MM-DD");
        values.endTime = values["endTime"].format("YYYY-MM-DD");
        console.log(values);
        axios
          .post(
            "http://localhost:8080/TradingArea/activity/addOrUpdate",
            {
              activityId:id,
              activityDiscount: values.activityDiscount,
              activityName: values.activityName,
              activityPicList: values.activityPicList,
              activityRemark: values.activityRemark,
              createTime: values.createTime,
              endTime: values.endTime
            }
          )
          .then(response => {
            if (response.data === 1) {
              Modal.confirm({
                title: "保存成功",
                okText: "返回列表",
                onOk() {
                  history.push(`/home/store/storeactivity/storeactivitylists?page=1`);
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
        <Divider />
        <Form onSubmit={this.handleSubmit} layout="horizontal">
          <Form.Item
            layout="inline"
            label="活动名称"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("activityName", {
              validateTrigger: "onBlur",
              initialValue: that.activityName,
              rules: [
                {
                  required: true,
                  message: "请输入活动名称"
                }
              ]
            })(
              <Input
                id="activityName"
                placeholder="请输入活动名称"
                maxLength={15}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label={`开始时间`}
          >
            {getFieldDecorator("createTime", {
              initialValue: moment("2015-06-06"),
              rules: [
                {
                  required: true,
                  message: "请选择活动开始时间"
                }
              ]
            })(<DatePicker placeholder="开始时间" id="createTime" />)}
          </Form.Item>
          <Form.Item
            layout="inline"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label={`结束时间`}
          >
            {getFieldDecorator("endTime", {
              initialValue: moment("2015-06-06"),
              rules: [
                {
                  required: true,
                  message: "请选择活动结束时间!"
                }
              ]
            })(<DatePicker placeholder="结束时间" id="endTime" />)}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="活动折扣"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("activityDiscount", {
              validateTrigger: "onBlur",
              initialValue: that.activityDiscount,
              rules: [
                {
                  required: true,
                  message: "请输入活动折扣"
                }
              ]
            })(
              <Input
                placeholder="请输入活动折扣"
                id="activityDiscount"
                maxLength={10}
              />
            )}
          </Form.Item>
          <Form.Item
            layout="inline"
            label="活动备注"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("activityRemark", {
              validateTrigger: "onBlur",
              initialValue: that.activityRemark,
              rules: [
                {
                  required: true,
                  message: "请输入活动备注"
                }
              ]
            })(
              <TextArea
                placeholder="请输入活动备注"
                id="activityRemark"
                rows={4}
                maxLength={200}
              />
            )}
          </Form.Item>

          <Form.Item
            label="活动图片"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
          >
            {getFieldDecorator("activityPicList", {
              validateTrigger: "onBlur",
              initialValue: that.activityPicList,
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
export default withRouter(Form.create()(StoreactivityInfo));
