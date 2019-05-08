import React from "react";
import { Form, Input, Button, notification } from "antd";
import { withRouter } from "react-router-dom";
import { _setCookie } from "../../utils/Session";
import axios from 'axios'
import "./style.css";

class LoginForm extends React.Component {
  state = {
    focusItem: -1
  };

  loginSubmit = e => {
    e.preventDefault();
    this.setState({
      focusItem: -1
    });
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
         axios
           .post("http://localhost:8080/TradingArea/user/login", {
             userNum: values.username,
             userPassword: values.password
           })
           .then((response) =>{
               console.log(response)
               if (response.msg='success'){
                    _setCookie("sessionId",response.data.data.userNum,"");
                    _setCookie(
                      "userId",
                      response.data.data.userId,
                      ""
                    );
                     _setCookie(
                      "tosId",
                      response.data.data.tosId,
                      ""
                    );
                    _setCookie(
                      "sessionState",
                      response.data.data.userState,
                      ""
                    );
                    this.props.history.push("/home");
               }else{
                   notification.error({
                     message: "登录失败",
                     description:'请确认密码后重新登录'
                   });
               }
           })
           .catch(function(error) {
             notification.error({
               message: "登录失败",
               description: "请稍后重新登录"
             });
           });
        
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { focusItem } = this.state;
    return (
      <div className={this.props.className}>
        <div className="owl">
          <div
            className="hand-left hand"
            style={focusItem === 1 ? styles.focusHandLeft : {}}
          />
          <div
            className="hand-right hand"
            style={focusItem === 1 ? styles.focusHandRight : {}}
          />
          <div className="arms-box">
            <div
              className="arms arms-left"
              style={focusItem === 1 ? styles.focusArmsLeft : {}}
            />
            <div
              className="arms arms-right"
              style={focusItem === 1 ? styles.focusArmsRight : {}}
            />
          </div>
        </div>
        <div className="title">后台管理系统</div>
        <Form onSubmit={this.loginSubmit}>
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [{ required: true, message: "请输入用户名" }]
            })(
              <Input
                placeholder="用户名"
                addonBefore={
                  <span
                    className="iconfont icon-User"
                    style={focusItem === 0 ? styles.focus : {}}
                  />
                }
                onFocus={() => this.setState({ focusItem: 0 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                size="large"
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [{ required: true, message: "请输入密码" }]
            })(
              <Input
                placeholder="密码"
                addonBefore={
                  <span
                    className="iconfont icon-suo1"
                    style={focusItem === 1 ? styles.focus : {}}
                  />
                }
                type="password"
                onFocus={() => this.setState({ focusItem: 1 })}
                onBlur={() => this.setState({ focusItem: -1 })}
                size="large"
              />
            )}
          </Form.Item>
          <Form.Item>
            <div className="bottom">
              <a className="forget" href="">
                忘记密码
              </a>
              <Button type="primary" htmlType="submit">
                登录
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
const styles = {
  backgroundBox: {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100vw",
    height: "100vh",
    backgroundImage: `url(${require("./img/bg5.jpg")})`,
    backgroundSize: "100% 100%"
  },
  focus: {
    transform: "scale(0.6)",
    width: 40
  },
  focusHandLeft: {
    transform: "translateX(-42px) translateY(-15px) scale(0.7)"
  },
  focusHandRight: {
    transform: "translateX(42px) translateY(-15px) scale(0.7)"
  },
  focusArmsLeft: {
    transform: "translateY(-40px) translateX(-40px) scaleX(-1)"
  },
  focusArmsRight: {
    transform: "translateY(-40px) translateX(40px)"
  }
};
export default withRouter(Form.create()(LoginForm));
