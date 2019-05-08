import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分

//系统管理
const TradingArea = LoadableComponent(() =>
  import("../../routes/Admin/TradingArea/index")
);
const TradingAreaNew = LoadableComponent(() =>
  import("../../routes/Admin/TradingArea/TradingAreaNew")
);
const TradingAreaInfo = LoadableComponent(() =>
  import("../../routes/Admin/TradingArea/TradingAreaInfo")
);
//商圈管理
const Shop = LoadableComponent(() =>
  import("../../routes/Business/Shop/index")
);
const ShopNew = LoadableComponent(() =>
  import("../../routes/Business/Shop/ShopNew")
);
const ShopInfo = LoadableComponent(() =>
  import("../../routes/Business/Shop/ShopInfo")
);
const Activity = LoadableComponent(() =>
  import("../../routes/Business/Activity/index")
);
const Info = LoadableComponent(() =>
  import("../../routes/Business/Info/Info")
);
//商户管理
const StoreActivity = LoadableComponent(() =>
  import("../../routes/Store/StoreActivity/index")
);
const StoreActivityNew = LoadableComponent(() =>
  import("../../routes/Store/StoreActivity/StoreActivityNew")
);
const StoreActivityInfo = LoadableComponent(() =>
  import("../../routes/Store/StoreActivity/StoreActivityInfo")
);
const Commodity = LoadableComponent(() =>
  import("../../routes/Store/Commodity/index")
);
const CommodityNew = LoadableComponent(() =>
  import("../../routes/Store/Commodity/CommodityNew")
);
const CommodityInfo = LoadableComponent(() =>
  import("../../routes/Store/Commodity/CommodityInfo")
);
const StoreInfo = LoadableComponent(() =>
  import("../../routes/Store/StoreInfo/index")
);


//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

@withRouter
class ContentMain extends React.Component {
  render () {
    return (
      <div style={{ padding: 16, position: "relative" }}>
        <Switch>
          <PrivateRoute exact path="/home" component={Home} />
          {/* admin */}
          <PrivateRoute
            exact
            path="/home/admin/tradenew"
            component={TradingAreaNew}
          />
          <PrivateRoute
            exact
            path="/home/admin/tradelists"
            component={TradingArea}
          />
          <PrivateRoute
            exact
            path="/home/admin/tradelists/:tradeId"
            component={TradingAreaInfo}
          />
          {/* 商圈 */}
          <PrivateRoute
            exact
            path="/home/business/store/new"
            component={ShopNew}
          />
          <PrivateRoute
            exact
            path="/home/business/store/storelists"
            component={Shop}
          />
          <PrivateRoute
            exact
            path="/home/business/store/storelists/:storeId"
            component={ShopInfo}
          />
          <PrivateRoute
            exact
            path="/home/business/activity"
            component={Activity}
          />
          <PrivateRoute
            exact
            path="/home/business/info"
            component={Info}
          />

          {/* 商户 */}

          <PrivateRoute
            exact
            path="/home/store/storeactivity/new"
            component={StoreActivityNew}
          />
          <PrivateRoute
            exact
            path="/home/store/storeactivity/storeactivitylists"
            component={StoreActivity}
          />
          <PrivateRoute
            exact
            path="/home/store/storeactivity/storeactivitylists/:activityId"
            component={StoreActivityInfo}
          />
          <PrivateRoute
            exact
            path="/home/store/commodity/new"
            component={CommodityNew}
          />
          <PrivateRoute
            exact
            path="/home/store/commodity/commoditylists/:commodityId"
            component={CommodityInfo}
          />
          <PrivateRoute
            exact
            path="/home/store/commodity/commoditylists"
            component={Commodity}
          />
          <PrivateRoute
            exact
            path="/home/store/storeinfo"
            component={StoreInfo}
          />
          <PrivateRoute exact path="/home/about" component={About} />

          <Redirect exact from="/" to="/home" />
        </Switch>
      </div>
    );
  }
}

export default ContentMain