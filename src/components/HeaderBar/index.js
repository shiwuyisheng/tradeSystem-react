import React from 'react'
import { Icon, Badge, Dropdown, Menu, Modal } from 'antd'
import screenfull from 'screenfull'
import { inject, observer } from 'mobx-react'
import { Link, withRouter } from 'react-router-dom'
import { isAuthenticated, logout } from "../../utils/Session";

//withRouter一定要写在前面，不然路由变化不会反映到props中去
@withRouter
class HeaderBar extends React.Component {
  state = {
    visible: false,
    avatar: require("./img/04.jpg")
  };
  logout = () => {
    logout()
    this.props.history.push("/login");
  };
  render() {
    const { avatar } = this.state;
    const menu = (
      <Menu className="menu">
        <Menu.ItemGroup title="用户中心" className="menu-group">
          <Menu.Item>你好 - {isAuthenticated()}</Menu.Item>
          <Menu.Item>个人信息</Menu.Item>
          <Menu.Item>
            <span onClick={this.logout}>退出登录</span>
          </Menu.Item>
        </Menu.ItemGroup>
      </Menu>
    );
    const login = (
      <Dropdown overlay={menu}>
        <img
          onClick={() => this.setState({ visible: true })}
          src={avatar}
          alt=""
        />
      </Dropdown>
    );
    return (
      <div id="headerbar">
        <div style={{ lineHeight: "64px", float: "right" }}>
          <ul className="header-ul">
            <li>{login}</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default HeaderBar