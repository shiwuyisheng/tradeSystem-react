import { Upload, Icon, Modal } from "antd";
import React, { Component } from "react";
export default class PicturesWall extends React.Component {
  state = {
    previewVisible: false,
    previewImage: "",
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = file => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true
    });
  };

  render() {
    const { previewVisible, previewImage } = this.state;
    const { fileList, imgNumber,onChange } = this.props;
    const list = fileList||[]
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="http://localhost:8080/TradingArea/uploadImg"
          listType="picture-card"
          fileList={list}
          onPreview={this.handlePreview}
          onChange={onChange}
          name='image'
        >
          {list.length >= imgNumber  ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}
