<template>
  <div id="table_view">
    <div id="recent_data">
      <el-table
        :data="tableData"
        border style="width: 100%"
        :height="table_height"
      >
        <el-table-column prop="code" label="编码" width="120" />
        <el-table-column prop="address" label="位置" width="250" />
        <el-table-column prop="date" label="时间" width="160" />
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleCheck(scope.$index, scope.row)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div id="mini_map_container"></div>
  </div>
  <div id="map_container"></div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import axios from "axios";
import AMapLoader from "@amap/amap-jsapi-loader";

var map = null;
var loca = null;
var pointLayer = null;
var dataSource = null;
var tableData = null;
var mini_map = null;
var polygons = [];


function drawBounds(params) {
  mini_map.remove(polygons);
  polygons = [];
  var bounds = params.bounds;
  if (bounds) {
    for (var i = 0; i < bounds.length; i++) {
      var polygon = new AMap.Polygon({
        map: mini_map,
        strokeWeight: 1,
        strokeColor: "#0091ea",
        fillColor: "#80d8ff",
        fillOpacity: 0.4,
        path: bounds[i],
      });
      polygons.push(polygon);
    }
  }
  mini_map.add(polygons);
  mini_map.setFitView(polygons);
}

function handleCheck(index, row) {
  drawBounds(tableData[index]);
}
var table_height = window.innerHeight * 0.95 * 0.33;

var main_map_data = { type: "FeatureCollection", features: [] };

onMounted(async () => {
  await Promise.all(tableData.map(async (item) => {
    const response = await fetchDataAndRender(item.address);
    if (response && response.data && response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      if (feature && feature.geometry && feature.geometry.coordinates) {
        item.bounds = feature.geometry.coordinates;
      }
    }
  }));
});

async function fetchDataAndRender(address) {
  try {
    const district = getSmallestDistrict(address);
    const response = await axios.get(`http://localhost:7999/mshd/district/fetchDistrictData/${district}`);
    main_map_data.features.push(...response.data.features);
    console.log("response data:", response.data);
    console.log("main_map_data:", main_map_data);
    render(); // 渲染
    return response;
  } catch (error) {
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

function getSmallestDistrict(address) {
  const units = ["省", "自治州", "市", "区", "县", "镇", "乡", "村"];
  let smallestDistrict = "";
  let lastPosition = -1;

  // 从最小的行政单位开始搜索，一旦找到第二个单位，就会截取该单位后面的所有字符
  for (let i = units.length - 1; i >= 0; i--) {
    const position = address.lastIndexOf(units[i]);
    if (position !== -1) {
      if (lastPosition !== -1) {
        smallestDistrict = address.substring(position + units[i].length);
        break;
      } else {
        lastPosition = position;
      }
    }
  }

  // 如果没有找到任何单位，返回整个地址
  return smallestDistrict === "" ? address : smallestDistrict;
}

tableData = [
  {
    code: "110101002003",
    address: "吉林省延边朝鲜族自治州和龙市",
    date: "2021-08-01 10:00:00",
    bounds: [
      [
        [129.0, 42.0],
        [129.0, 43.0],
        [130.0, 43.0],
        [130.0, 42.0],
      ],
    ],
  },
  {
    code: "110101002003",
    address: "湖北省武汉市",
    date: "2021-08-01 10:00:00",
    bounds: [
      [
        [129.0, 42.0],
        [129.0, 43.0],
        [130.0, 43.0],
        [130.0, 42.0],
      ],
    ],
  },
  {
    code: "110101002003",
    address: "连云港",
    date: "2021-08-01 10:00:00",
    bounds: [
      [
        [129.0, 42.0],
        [129.0, 43.0],
        [130.0, 43.0],
        [130.0, 42.0],
      ],
    ],
  },
  {
    code: "110101002003",
    address: "内蒙古",
    date: "2021-08-01 10:00:00",
    bounds: [
      [
        [129.0, 42.0],
        [129.0, 43.0],
        [130.0, 43.0],
        [130.0, 42.0],
      ],
    ],
  },
  {
    code: "110101002003",
    address: "台湾",
    date: "2021-08-01 10:00:00",
    bounds: [
      [
        [129.0, 42.0],
        [129.0, 43.0],
        [130.0, 43.0],
        [130.0, 42.0],
      ],
    ],
  },
];

function render() {
  // 高德地图安全码
  window._AMapSecurityConfig = {
    securityJsCode: "42a4943fb43edf1ae68a202b096064c4",
  };
  // 迷你地图
  AMapLoader.load({
    key: "497fa30626d9f0c23cb506cd479a5af8",
    version: "2.0",
    plugins: ["AMap.DistrictSearch"],
  }).then((AMap) => {
    mini_map = new AMap.Map("mini_map_container", {
      resizeEnable: true,
      zoom: 10,
      center: [116.39, 39.9],
    });
  });

  // 主地图

  // 主地图
  AMapLoader.load({
    key: "497fa30626d9f0c23cb506cd479a5af8",
    version: "2.0",
    plugins: ["AMap.DistrictSearch"],
    Loca: {
      version: "2.0.0",
    },
  }).then((AMap) => {
    var pl = new Loca.PolygonLayer({
      // loca,
      zIndex: 120,
      opacity: 0.8,
      shininess: 10,
      hasSide: true,
      labelsLayerOptions: false,
    });

    map = new AMap.Map("map_container", {
      zoom: 5,
      viewMode: "3D",
      pitch: 45,
      mapStyle: "amap://styles/whitesmoke",
      center: [116.38, 39.9],
      showBuildingBlock: false,
      showLabel: false,
    });
    loca = window.loca = new Loca.Container({
      map: map,
    });

    // 光照
    loca.ambLight = {
      intensity: 0.3,
      color: "#fff",
    };
    loca.dirLight = {
      intensity: 0.6,
      color: "#fff",
      target: [0, 0, 0],
      position: [0, -1, 1],
    };
    loca.pointLight = {
      color: "rgb(100,100,100)",
      position: [120.24289, 30.341335, 20000],
      intensity: 3,
      // 距离表示从光源到光照强度为 0 的位置，0 就是光不会消失。
      distance: 50000,
    };

    var colors = [
      "#f0bb41",
      "#f0a441",
      "#f09241",
      "#f07e41",
      "#f06a41",
      "#f05e41",
      "#f05541",
      "#f05241",
      "#f04141",
    ].reverse();
    var height = [
      100000, 150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000,
    ].reverse();

    // 数据来源
    var geo_data = new Loca.GeoJSONSource({
  data: main_map_data,
});

    pl.setSource(geo_data);
    pl.setStyle({
      topColor: function (index, feature) {
        var v = feature.properties.occurrences;
        return v < 5
          ? colors[8]
          : v < 10
          ? colors[7]
          : v < 15
          ? colors[6]
          : v < 20
          ? colors[5]
          : v < 25
          ? colors[4]
          : v < 30
          ? colors[3]
          : v < 35
          ? colors[2]
          : v < 40
          ? colors[1]
          : v < 45
          ? colors[0]
          : "red";
      },
      sideTopColor: function (index, feature) {
        // var v = feature.properties.value;
        var v = feature.properties.occurrences;
        return v < 5
          ? colors[8]
          : v < 10
          ? colors[7]
          : v < 15
          ? colors[6]
          : v < 20
          ? colors[5]
          : v < 25
          ? colors[4]
          : v < 30
          ? colors[3]
          : v < 35
          ? colors[2]
          : v < 40
          ? colors[1]
          : v < 45
          ? colors[0]
          : "red";
      },
      sideBottomColor: function (index, feature) {
        // var v = feature.properties.value;
        var v = feature.properties.occurrences;
        return v < 5
          ? colors[8]
          : v < 10
          ? colors[7]
          : v < 15
          ? colors[6]
          : v < 20
          ? colors[5]
          : v < 25
          ? colors[4]
          : v < 30
          ? colors[3]
          : v < 35
          ? colors[2]
          : v < 40
          ? colors[1]
          : v < 45
          ? colors[0]
          : "red";
      },
      height: function (index, feature) {
        var v = feature.properties.occurrences;
        return v < 5
          ? height[8]
          : v < 10
          ? height[7]
          : v < 15
          ? height[6]
          : v < 20
          ? height[5]
          : v < 25
          ? height[4]
          : v < 30
          ? height[3]
          : v < 35
          ? height[2]
          : v < 40
          ? height[1]
          : v < 45
          ? height[0]
          : 50;
      },
      altitude: 0,
    });

    loca.add(pl);

    // 左下角的图例
    var lengend = new Loca.Legend({
      loca: loca,
      title: {
        label: "总体灾情分布",
        fontColor: "#eee",
      },
      style: {
        backgroundColor: "rgba(0,0,0,0.5)",
        left: "20px",
        bottom: "40px",
      },
      dataMap: [
        { label: 45, color: colors[0] },
        { label: 40, color: colors[1] },
        { label: 35, color: colors[2] },
        { label: 30, color: colors[3] },
        { label: 25, color: colors[4] },
        { label: 20, color: colors[5] },
        { label: 15, color: colors[6] },
        { label: 10, color: colors[7] },
        { label: 5, color: colors[8] },
      ].reverse(),
    });

    // 创建纯文本标记
    var text = new AMap.Text({
      text: "纯文本标记",
      anchor: "center", // 设置文本标记锚点
      draggable: true,
      cursor: "pointer",
      angle: 0,
      visible: false,
      offset: [0, -25],
      style: {
        padding: "5px 10px",
        "margin-bottom": "1rem",
        "border-radius": ".25rem",
        "background-color": "rgba(0,0,0,0.5)",
        // 'width': '12rem',
        "border-width": 0,
        "box-shadow": "0 2px 6px 0 rgba(255, 255, 255, .3)",
        "text-align": "center",
        "font-size": "16px",
        color: "#fff",
      },
    });
    text.setMap(map);
    // 拾取
    map.on("mousemove", (e) => {
      var feat = pl.queryFeature(e.pixel.toArray());

      if (feat) {
        text.show();
        var occurrences = feat.properties.occurrences;
        text.setText(
          feat.properties.name + " 震情次数：" + parseInt(occurrences)
        );
        text.setPosition(e.lnglat);

        pl.setStyle({
          topColor: (index, feature) => {
            if (feature === feat) {
              return [245, 59, 59, 0.5];
            }
            var v = feature.properties.occurrences;
            return v < 5
              ? colors[8]
              : v < 10
              ? colors[7]
              : v < 15
              ? colors[6]
              : v < 20
              ? colors[5]
              : v < 25
              ? colors[4]
              : v < 30
              ? colors[3]
              : v < 35
              ? colors[2]
              : v < 40
              ? colors[1]
              : v < 45
              ? colors[0]
              : "red";
          },
          sideTopColor: (index, feature) => {
            if (feature === feat) {
              return [245, 59, 59, 0.5];
            }
            var v = feature.properties.occurrences;
            return v < 5
              ? colors[8]
              : v < 10
              ? colors[7]
              : v < 15
              ? colors[6]
              : v < 20
              ? colors[5]
              : v < 25
              ? colors[4]
              : v < 30
              ? colors[3]
              : v < 35
              ? colors[2]
              : v < 40
              ? colors[1]
              : v < 45
              ? colors[0]
              : "red";
          },
          sideBottomColor: (index, feature) => {
            if (feature === feat) {
              return [245, 59, 59, 0.5];
            }
            var v = feature.properties.occurrences;
            return v < 5
              ? colors[8]
              : v < 10
              ? colors[7]
              : v < 15
              ? colors[6]
              : v < 20
              ? colors[5]
              : v < 25
              ? colors[4]
              : v < 30
              ? colors[3]
              : v < 35
              ? colors[2]
              : v < 40
              ? colors[1]
              : v < 45
              ? colors[0]
              : "red";
          },
          height: function (index, feature) {
            var v = feature.properties.occurrences;
            return v < 5
              ? height[8]
              : v < 10
              ? height[7]
              : v < 15
              ? height[6]
              : v < 20
              ? height[5]
              : v < 25
              ? height[4]
              : v < 30
              ? height[3]
              : v < 35
              ? height[2]
              : v < 40
              ? height[1]
              : v < 45
              ? height[0]
              : 50;
          },
        });
      } else {
        text.hide();
      }
    });

    // 生长动画
    map
      .on("click", function () {
        pl.addAnimate(
          {
            key: "height",
            value: [0, 1],
            duration: 500,
            easing: "CubicInOut",
          },
          function () {
            // console.log(123);
          }
        );
      })
      .catch((e) => {
        console.log(e);
      });
  });
}
</script>

<style scoped>
#map_container {
  position: absolute;
  left: 40%;
  padding: 0px;
  margin: 0px;
  width: 58%;
  height: 95%;
  border-radius: 5px;
  border-color: rgb(138, 138, 138);
  border-style: solid;
  border-width: 1px;
}

#table_view {
  position: absolute;
  padding: 0px;
  margin: 0px;
  width: 39%;
  height: 95%;
  border-radius: 5px;
  border-color: rgb(138, 138, 138);
  border-style: solid;
  border-width: 1px;
}

#recent_data {
  margin: 10px;
  padding: 0px;
  height: 35%;
}

#mini_map_container {
  margin: 10px;
  padding: 0px;
  height: 62%;
  border-radius: 5px;
  border-color: rgb(138, 138, 138);
  border-style: solid;
  border-width: 1px;
}
</style>
