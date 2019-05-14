import React from "react";
import {
  G2,
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";
import DataSet from "@antv/data-set";
import axios from 'axios'
import './style.css'

class Basiccolumn extends React.Component {
  state={
    data:[],
    newdata:[]
  }
   componentDidMount() {
    axios
      .post("http://localhost:8080/TradingArea/countSum")
      .then(response => {
        this.setState({
          data: response.data.slice(0, 4),
          newdata: response.data.slice(4)
        });
        // console.log(response.data.slice(4));
      })
      .catch(function(error) {
        console.log(error);
      });
  }
  render() {
    const { DataView } = DataSet;
     const dv = new DataView();
     dv.source(this.state.newdata).transform({
       type: "percent",
       field: "sum",
       dimension: "name",
       as: "percent"
     });
     const cols = {
       percent: {
         formatter: val => {
           val = val * 100 + "%";
           return val;
         }
       }
     };
     
    return (
      <div className="home">
        <div className="count">系统模块柱状统计图</div>
        <Chart height={360} data={this.state.data} forceFit>
          <Axis name="name" />
          <Axis name="sum" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="name*sum" />
        </Chart>
        <div className="count">店铺类型扇形统计图</div>
        <Chart
          height={window.innerHeight}
          data={dv}
          scale={cols}
          padding={[80, 100, 80, 80]}
          forceFit
        >
          <Coord type="theta" radius={0.75} />
          <Axis name="percent" />
          <Legend
            position="right"
            offsetY={-window.innerHeight / 2 + 120}
            offsetX={-100}
          />
          <Tooltip
            showTitle={false}
            itemTpl='<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}: {value}</li>'
          />
          <Geom
            type="intervalStack"
            position="percent"
            color="name"
            tooltip={[
              "name*percent",
              (name, percent) => {
                percent = percent * 100 + "%";
                return {
                  name: name,
                  value: percent
                };
              }
            ]}
            style={{
              lineWidth: 1,
              stroke: "#fff"
            }}
          >
            <Label
              content="percent"
              formatter={(val, name) => {
                return name.point.name + ": " + val;
              }}
            />
          </Geom>
        </Chart>
      </div>
    );
  }
}

export default Basiccolumn;
