import React from 'react'
import CustomMenu from "../CustomMenu/index";

import { _getCookie } from "../../utils/Session";
const admin = [
  {
    title: "首页",
    icon: "home",
    key: "/home"
  },
   {
    title: "系统管理",
    icon: "bars",
    key: "/home/admin",
    subs: [
      {
        key: "/home/admin/tradenew",
        title: "新增商圈",
        icon: "",
      },
      {
        key: "/home/admin/tradelists",
        title: "商圈管理",
        icon: ""
      }
      ]
  },
  {
    title: "关于",
    icon: "info-circle-o",
    key: "/home/about"
  }
];
const trade = [
  {
    title: "首页",
    icon: "home",
    key: "/home"
  },
  {
    title: "商圈管理",
    icon: "laptop",
    key: "/home/business",
    subs: [
      {
        key: "/home/business/store",
        title: "商铺管理",
        icon: "",
        subs: [
          {
            key: "/home/business/store/new",
            title: "新建商铺",
            icon: ""
          },
          {
            key: "/home/business/store/storelists",
            title: "商铺管理",
            icon: ""
          }
        ]
      },
      {
        key: "/home/business/activity",
        title: "活动管理",
        icon: ""
      },
      {
        key: "/home/business/info",
        title: "信息更改",
        icon: ""
      }
    ]
  },
  {
    title: "关于",
    icon: "info-circle-o",
    key: "/home/about"
  }
];
const store = [
  {
    title: "首页",
    icon: "home",
    key: "/home"
  },
  {
    title: "商铺管理",
    icon: "bars",
    key: "/home/store",
    subs: [
      {
        key: "/home/store/storeactivity",
        title: "活动管理",
        icon: "",
        subs: [
          {
            key: "/home/store/storeactivity/new",
            title: "新建活动",
            icon: ""
          },
          {
            key: "/home/store/storeactivity/storeactivitylists",
            title: "活动管理",
            icon: ""
          }
        ]
      },
      {
        key: "/home/store/commodity",
        title: "商品管理",
        icon: "",
        subs: [
          {
            key: "/home/store/commodity/new",
            title: "新建商品",
            icon: ""
          },
          {
            key: "/home/store/commodity/commoditylists",
            title: "商品管理",
            icon: ""
          }
        ]
      },
      { key: "/home/store/storeinfo", title: "信息更改", icon: "" }
    ]
  },
  {
    title: "关于",
    icon: "info-circle-o",
    key: "/home/about"
  }
];
const other = [
  {
    title: "首页",
    icon: "home",
    key: "/home"
  },
  {
    title: "关于",
    icon: "info-circle-o",
    key: "/home/about"
  }
];


class SiderNav extends React.Component {
  state={
    menus:[]
  }
  componentDidMount() {
    console.log(_getCookie("sessionState"));
    const sessionState = parseInt(_getCookie("sessionState"));
    if (sessionState === 1) {
      this.setState({ menus: admin });
    } else if (sessionState === 2) {
             this.setState({ menus: trade });
           } else if (sessionState === 3) {
                    this.setState({ menus: store });
                  } else {
                    this.setState({ menus: other });
                  }
  }

  render() {
    return (
      <div style={{height: '100vh',overflowY:'scroll'}}>
        <div style={styles.logo}></div>
        <CustomMenu menus={this.state.menus}/>
      </div>
    )
  }
}

const styles = {
  logo: {
    height: '32px',
    background: 'rgba(255, 255, 255, .2)',
    margin: '16px'
  }
}

export default SiderNav