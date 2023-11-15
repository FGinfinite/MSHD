<template>
  <div id="code_view">灾情码：{{ code }}</div>

  <div id="code_detail">
    <el-collapse v-model="activeNames">
      <el-collapse-item title="灾情详情" name="1">
        <el-descriptions
          class="margin-top"
          :title="code"
          :column="3"
          :size="size"
          border
        >
          <!-- opration按钮 -->
          <template #extra>
            <el-button type="primary" v-on:click="location">快速定位</el-button>
          </template>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <MessageBox />
                </el-icon>
                灾情信息
              </div>
            </template>
            {{ code_details }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Document />
                </el-icon>
                载体
              </div>
            </template>
            {{ carrier }}
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <Connection />
                </el-icon>
                来源
              </div>
            </template>
            {{ code_source }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <User />
                </el-icon>
                上传者
              </div>
            </template>
            {{ uploader }}>>
          </el-descriptions-item>

          <el-descriptions-item>
            <template #label>
              <div class="cell-item">
                <el-icon :style="iconStyle">
                  <LocationInformation />
                </el-icon>
                位置信息
              </div>
            </template>
            {{ address }}
          </el-descriptions-item>
        </el-descriptions>
      </el-collapse-item>

      <el-collapse-item
        title="地图定位"
        name="2"
        id="map_view"
        v-on:click="drawBounds"
      >
        <div id="map_container_view">
          <div id="map_container">aaa</div>
        </div>
      </el-collapse-item>

      <el-collapse-item title="关联文件" name="3">
        <!-- 文件表格 -->
        <div id="table_view">
          <el-table :data="files" border style="width: 100%">
            <el-table-column prop="name" label="文件名"></el-table-column>
            <el-table-column prop="type" label="文件类型"></el-table-column>
            <el-table-column label="操作">
              <template #default="{ row }">
                <el-button type="primary" size="mini" v-on:click="openFile(row)"
                  >打开</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from "vue";
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from "@element-plus/icons-vue";

import AMapLoader from "@amap/amap-jsapi-loader";

const code = ref("");
const carrier = ref("");
const code_source = ref("");
const uploader = ref("");
const code_details = ref("");
const address = ref("");
const files = ref([]);
var polygons = [];
var map = null;
var map_data = {};
var renderFlag = false;
// 临时测试数据
// Todo: 从后端获取数据
code.value = "130281113210202302251430001000101001";
code_source.value = "业务报送数据 - 前方地震应急指挥部";
uploader.value = "成都市应急管理局";
code_details.value = "震情 - 震情信息 - 地理位置";
address.value = "四川省 成都市锦江区沙河街道塔子山社区居委会";
carrier.value = "图片";
map_data = {
  code: "130281113210202302251430001000101001",
  address: "吉林省延边朝鲜族自治州和龙市头道镇",
  date: "2021-08-01 10:00:00",
  bounds: [
    [
      [129.0, 42.0],
      [129.0, 43.0],
      [130.0, 43.0],
      [130.0, 42.0],
    ],
  ],
};
files.value = [
  {
    name: "文件1",
    type: ".pdf",
    url: "http://www.baidu.com",
  },
  {
    name: "文件2",
    type: ".jpg",
    url: "http://www.baidu.com",
  },
  {
    name: "文件3",
    type: ".doc",
    url: "http://www.baidu.com",
  },
];
onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "42a4943fb43edf1ae68a202b096064c4",
  };
  AMapLoader.load({
    key: "497fa30626d9f0c23cb506cd479a5af8",
    version: "2.0",
    plugins: [""],
  })
    .then((AMap) => {
      map = new AMap.Map("map_container", {
        resizeEnable: true,
        zoom: 10,
        center: [116.39, 39.9],
      });
      polygons = [];
      var bounds = map_data.bounds;
      if (bounds) {
        for (var i = 0; i < bounds.length; i++) {
          var polygon = new AMap.Polygon({
            map: map,
            strokeWeight: 1,
            strokeColor: "#0091ea",
            fillColor: "#80d8ff",
            fillOpacity: 0.4,
            path: bounds[i],
          });
          polygons.push(polygon);
        }
      }
      map.add(polygons);
      map.setFitView(polygons);
    })
    .catch((e) => {
      console.log(e);
    });
});

function drawBounds() {
  console.log("drawBounds");
  if (!renderFlag) {
    renderFlag = true;
    setTimeout(() => {
      map.remove(polygons);
      polygons = [];
      var bounds = map_data.bounds;
      if (bounds) {
        for (var i = 0; i < bounds.length; i++) {
          var polygon = new AMap.Polygon({
            map: map,
            strokeWeight: 1,
            strokeColor: "#0091ea",
            fillColor: "#80d8ff",
            fillOpacity: 0.4,
            path: bounds[i],
          });
          polygons.push(polygon);
        }
      }
      map.add(polygons);
      map.setFitView(polygons);
    }, 500);
  }
}

function location() {
  console.log("location");
  if (!renderFlag) {
    drawBounds();
  } else {
    map.setFitView(polygons);
  }
}

function openFile(row) {
  console.log("openFile");
  window.open(row.url);
}

const activeNames = ref(["1"]);
const size = ref("");
const iconStyle = computed(() => {
  const marginMap = {
    large: "8px",
    default: "6px",
    small: "4px",
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});

const blockMargin = computed(() => {
  const marginMap = {
    large: "32px",
    default: "28px",
    small: "24px",
  };
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  };
});

// 地图
AMapLoader.load;
</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}

#map_container {
  margin: 10px;
  padding: 0px;
  height: 620px;
  border-radius: 5px;
  border-color: rgb(138, 138, 138);
  border-style: solid;
  border-width: 1px;
}
</style>
