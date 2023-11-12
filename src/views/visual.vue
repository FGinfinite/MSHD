<template>
  <div id="map_container"></div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

var map = null;
var loca = null;
var pointLayer = null;
var dataSource = null;

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "42a4943fb43edf1ae68a202b096064c4",
  };
  function getGeoJson() {
    const district = new AMap.DistrictSearch({
      // 关键字对应的行政区级别，country表示国家
      level: "province",
      // 显示下级行政区级数，1表示返回下一级行政区
      subdistrict: 1,
      // 是否显示边界
      showbiz: false,
      // 返回行政区边界坐标拐点数组
      extensions: "all",
    });

    let test_geojson = null;
    // 搜索行政区边界
    district.search("北京", (status, result) => {
      if (status === "complete") {
        // 将边界数据转换为geojson格式
        test_geojson = {
          type: "FeatureCollection",
          features: [],
        };
        const bounds = result.districtList[0].boundaries;
        for (let i = 0; i < bounds.length; i++) {
          const polygon = {
            type: "Feature",
            properties: {
              name: "北京市",
              value: 37,
              health: 0.626965,
              zylsd: 40.959447,
            },
            geometry: {
              type: "Polygon",
              coordinates: [bounds[i]],
            },
          };
          test_geojson.features.push(polygon);
        }

        console.log("test_json: " + test_geojson);
        return test_geojson;
        //   // 将geojson数据保存到文件
        //   const blob = new Blob([JSON.stringify(test_geojson)], {
        //     type: "application/json",
        //   });
        //   const link = document.createElement("a");
        //   link.href = URL.createObjectURL(blob);
        //   link.download = "beijing.geojson";
        //   link.click();
      }
    });
  }
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
    });
    
    map = new AMap.Map("map_container", {
      zoom: 11.14,
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
      "#FFF8B4",
      "#D3F299",
      "#9FE084",
      "#5ACA70",
      "#00AF53",
      "#00873A",
      "#006B31",
      "#004835",
      "#003829",
    ].reverse();
    var height = [1000, 2000, 4000, 6000, 8000, 10000, 12000, 14000, 16000];

    // 数据来源
    var geo_data = new Loca.GeoJSONSource({
      data: getGeoJson(),
    });
    console.log("geo_data: " + geo_data);
    console.log("pl: " + pl);

    pl.setStyle({
      topColor: function (index, feature) {
        var v = feature.properties.health * 100;
        return v < 40
          ? colors[8]
          : v < 50
          ? colors[7]
          : v < 55
          ? colors[6]
          : v < 60
          ? colors[5]
          : v < 65
          ? colors[4]
          : v < 70
          ? colors[3]
          : v < 75
          ? colors[2]
          : v < 80
          ? colors[1]
          : v < 100
          ? colors[0]
          : "green";
      },
      sideTopColor: function (index, feature) {
        // var v = feature.properties.value;
        var v = feature.properties.health * 100;
        return v < 40
          ? colors[8]
          : v < 50
          ? colors[7]
          : v < 55
          ? colors[6]
          : v < 60
          ? colors[5]
          : v < 65
          ? colors[4]
          : v < 70
          ? colors[3]
          : v < 75
          ? colors[2]
          : v < 80
          ? colors[1]
          : v < 100
          ? colors[0]
          : "green";
      },
      sideBottomColor: function (index, feature) {
        // var v = feature.properties.value;
        var v = feature.properties.health * 100;
        return v < 40
          ? colors[8]
          : v < 50
          ? colors[7]
          : v < 55
          ? colors[6]
          : v < 60
          ? colors[5]
          : v < 65
          ? colors[4]
          : v < 70
          ? colors[3]
          : v < 75
          ? colors[2]
          : v < 80
          ? colors[1]
          : v < 100
          ? colors[0]
          : "green";
      },
      height: function (index, feature) {
        var v = feature.properties.health * 100;
        return v < 40
          ? height[8]
          : v < 50
          ? height[7]
          : v < 55
          ? height[6]
          : v < 60
          ? height[5]
          : v < 65
          ? height[4]
          : v < 70
          ? height[3]
          : v < 75
          ? height[2]
          : v < 80
          ? height[1]
          : v < 100
          ? height[0]
          : 0;
      },
      altitude: 0,
    });

    pl.setSource(geo_data);
    loca.add(pl);

    // 左下角的图例
    var lengend = new Loca.Legend({
      loca: loca,
      title: {
        label: "健康度",
        fontColor: "#eee",
      },
      style: {
        backgroundColor: "rgba(255,255,255,0.1)",
        left: "20px",
        bottom: "40px",
      },
      dataMap: [
        { label: 100, color: colors[0] },
        { label: 80, color: colors[1] },
        { label: 75, color: colors[2] },
        { label: 70, color: colors[3] },
        { label: 65, color: colors[4] },
        { label: 60, color: colors[5] },
        { label: 55, color: colors[6] },
        { label: 50, color: colors[7] },
        { label: 40, color: colors[8] },
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
        var health = feat.properties.health;
        text.setText(
          feat.properties.name + " 健康度：" + parseInt(health * 100) + " %"
        );
        text.setPosition(e.lnglat);

        pl.setStyle({
          topColor: (index, feature) => {
            if (feature === feat) {
              return [164, 241, 199, 0.5];
            }
            var v = feature.properties.health * 100;
            return v < 40
              ? colors[8]
              : v < 50
              ? colors[7]
              : v < 55
              ? colors[6]
              : v < 60
              ? colors[5]
              : v < 65
              ? colors[4]
              : v < 70
              ? colors[3]
              : v < 75
              ? colors[2]
              : v < 80
              ? colors[1]
              : v < 100
              ? colors[0]
              : "green";
          },
          sideTopColor: (index, feature) => {
            if (feature === feat) {
              return [164, 241, 199, 0.5];
            }
            var v = feature.properties.health * 100;
            return v < 40
              ? colors[8]
              : v < 50
              ? colors[7]
              : v < 55
              ? colors[6]
              : v < 60
              ? colors[5]
              : v < 65
              ? colors[4]
              : v < 70
              ? colors[3]
              : v < 75
              ? colors[2]
              : v < 80
              ? colors[1]
              : v < 100
              ? colors[0]
              : "green";
          },
          sideBottomColor: (index, feature) => {
            if (feature === feat) {
              return [164, 241, 199, 0.5];
            }
            var v = feature.properties.health * 100;
            return v < 40
              ? colors[8]
              : v < 50
              ? colors[7]
              : v < 55
              ? colors[6]
              : v < 60
              ? colors[5]
              : v < 65
              ? colors[4]
              : v < 70
              ? colors[3]
              : v < 75
              ? colors[2]
              : v < 80
              ? colors[1]
              : v < 100
              ? colors[0]
              : "green";
          },
          height: function (index, feature) {
            var v = feature.properties.health * 100;
            return v < 40
              ? height[8]
              : v < 50
              ? height[7]
              : v < 55
              ? height[6]
              : v < 60
              ? height[5]
              : v < 65
              ? height[4]
              : v < 70
              ? height[3]
              : v < 75
              ? height[2]
              : v < 80
              ? height[1]
              : v < 100
              ? height[0]
              : 0;
          },
        });
      } else {
        text.hide();
      }
    });

    var dat = new Loca.Dat();
    dat.addLight(loca.ambLight, loca, "环境光");
    dat.addLight(loca.dirLight, loca, "平行光");
    dat.addLight(loca.pointLight, loca, "点光");
    dat.addLayer(pl);

    // 生长动画
    map
      .on("click", function () {
        pl.addAnimate(
          {
            key: "height",
            value: [0, 1],
            duration: 1000,
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
});

// onUnmounted(() => {
//   map?.destroy();
// });
</script>

<style scoped>
#map_container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  height: 800px;
}
</style>
