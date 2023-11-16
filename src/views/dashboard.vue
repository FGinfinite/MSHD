<template>
  <el-container style="height: 100%">
    <el-aside width="800px" id="aside_tables">
      <el-card shadow="hover" class="table_card" header="近期地震报告">
        <div class="recent_table_container">
          <el-table
            :data="earthquakes_data"
            border
            :height="table_height"
            class="recent_table"
          >
            <el-table-column prop="level" label="震级(M)" width="80" />
            <el-table-column prop="time" label="发震时刻(UTC+8)" width="155" />
            <el-table-column prop="positon" label="经纬度" width="120" />
            <el-table-column prop="depth" label="深度(km)" width="60" />
            <el-table-column prop="address" label="参考位置" />
          </el-table></div
      ></el-card>

      <el-card shadow="hover" class="table_card" header="近期灾情数据">
        <div class="recent_table_container">
          <el-table
            :data="code_data"
            border
            :height="table_height"
            class="recent_table"
          >
            <el-table-column prop="code" label="灾情码" width="310" />
            <el-table-column prop="time" label="上传时间" width="100" />
            <el-table-column prop="position" label="经纬度" width="120" />
            <el-table-column prop="address" label="位置" />
          </el-table></div
      ></el-card>
    </el-aside>
    <el-container>
      <el-header>
        <el-row :gutter="1" class="mgb20">
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-1">
                <el-icon class="grid-con-icon"><Document /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{count_week}}</div>
                  <div class="grid-text">本周灾情码</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-2">
                <el-icon class="grid-con-icon"><Files /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{count_month}}</div>
                  <div class="grid-text">本月灾情码</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" :body-style="{ padding: '0px' }">
              <div class="grid-content grid-con-3">
                <el-icon class="grid-con-icon"><DocumentCopy /></el-icon>
                <div class="grid-cont-right">
                  <div class="grid-num">{{count_total}}</div>
                  <div class="grid-text">灾情码总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-header>
      <el-main>
        <el-container direction="horizontal" style="height: 80%; width: 100%">
          <el-card
            shadow="hover"
            header="近期地震分布"
            class="map_container_card"
          >
            <div id="earthquake_map_container"></div>
          </el-card>
          <el-card
            shadow="hover"
            header="近期灾情数据分布"
            class="map_container_card"
            ><div id="code_map_container"></div
          ></el-card>
        </el-container>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts" name="dashboard">
import { ref, onMounted } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import earthquake_record from "../assets/data/earthquake_record.json";

import axios from 'axios';
const name = localStorage.getItem("ms_username");
const role: string = name === "admin" ? "超级管理员" : "普通用户";

const count_total = ref(0);
const count_month = ref(0);
const count_week = ref(0);

var earthquake_map = null;
var code_map = null;
// 表格高度=类recent_table_container高度
const table_height = ref(0);

interface earthquakes_info {
	level: number;
	time: string;
	positon: number[];
	depth: number;
	address: string;
}

interface code_info {
	code: string;
	time: string;
	position: number[];
	address: string;
}

const earthquakes_data = ref<earthquakes_info[]>([]);
const code_data = ref<code_info[]>([]);
earthquakes_data.value = earthquake_record;
function render() {
	// 地图渲染
	window._AMapSecurityConfig = {
		securityJsCode: "42a4943fb43edf1ae68a202b096064c4",
	};
	AMapLoader.load({
		key: "497fa30626d9f0c23cb506cd479a5af8",
		version: "2.0",
		plugins: [""],
	}).then((AMap) => {
		earthquake_map = new AMap.Map("earthquake_map_container", {
			zoom: 2.48,
			center: [116.38, 39.9],
			mapStyle: "amap://styles/fresh",
			resizeEnable: true,
			showLabel: false,
			showIndoorMap: false,
		});
		code_map = new AMap.Map("code_map_container", {
			zoom: 3.5,
			center: [105.38, 39.9],
			resizeEnable: true,
			mapStyle: "amap://styles/normal",
			showLabel: false,
			showIndoorMap: false,
		});
		// 点标记
		var m_icon = new AMap.Icon({
			image:
				"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
			size: new AMap.Size(22, 28),
			imageSize: new AMap.Size(22, 28),
		});
		for (let i = 0; i < earthquakes_data.value.length; i++) {
			var marker = new AMap.Marker({
				position: earthquakes_data.value[i].positon,
				icon: m_icon,
				anchor: "bottom-center",
				offset: new AMap.Pixel(0, 0),
			});

			marker.setTitle(
				"" +
				earthquakes_data.value[i].address +
				" [" +
				earthquakes_data.value[i].positon[0] +
				"," +
				earthquakes_data.value[i].positon[1] +
				"]\n" +
				earthquakes_data.value[i].level +
				"M " +
				earthquakes_data.value[i].time
			);
			marker.setMap(earthquake_map);
		}
		for (let i = 0; i < code_data.value.length; i++) {
			console.log(code_data.value[i].position);
			var marker = new AMap.Marker({
				position: code_data.value[i].position,
				icon: m_icon,
				anchor: "bottom-center",
				offset: new AMap.Pixel(0, 0),
			});

			marker.setTitle(
				"" +
				code_data.value[i].address +
				" [" +
				code_data.value[i].position[0] +
				"," +
				code_data.value[i].position[1] +
				"]\n" +
				code_data.value[i].code +
				" " +
				code_data.value[i].time
			);
			marker.setMap(code_map);
		}
	});
}

onMounted(async () => {
	await fetchRecent5Disaster();
	table_height.value =
		document.getElementsByClassName("table_card")[0].offsetHeight * 0.8;
	console.log(table_height.value);
	render();
});

async function fetchAllDisasterCount() {
	try {
		const response = await axios.get(`http://10.29.52.19:7999/mshd/disaster/fetchRecent5Disaster`)
	}
}

async function fetchRecent5Disaster() {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await axios.get(`http://10.29.52.19:7999/mshd/disaster/fetchRecent5Disaster`);
            console.log("search---")
            if (response && response.data && response.data.length > 0) {
                code_data.value.push(...response.data.map((item: {
                    [x: string]: any; disasterCode: any; location: any; date: any; position: any;
                }) => ({
                    code: item.disaster.disasterCode,
                    address: item.disaster.location,
                    time: item.disaster.date,
                    position: item.position.split(',').map(Number), 
                })));
                console.log("tableData:", code_data.value);
            }
            resolve(code_data.value);
        } catch (error) {
            console.error('Error message:', error.message);
            if (error.response) {
                console.error('Response status:', error.response.status);
                console.error('Response data:', error.response.data);
            }
            reject(error);
        }
    });
}

</script>

<style scoped>
.grid-content {
	display: flex;
	align-items: center;
	height: 100px;
}

.grid-cont-right {
	flex: 1;
	text-align: center;
	font-size: 1px;
	color: #999;
	overflow: visible;
}

.grid-num {
	font-size: 30px;
	font-weight: bold;
}

.grid-con-icon {
	font-size: 50px;
	width: 100px;
	height: 100px;
	text-align: center;
	line-height: 100px;
	color: #fff;
}

.grid-text {
	font-size: 16px;
}

.grid-con-1 .grid-con-icon {
	background: rgb(45, 140, 240);
}

.grid-con-1 .grid-num {
	color: rgb(45, 140, 240);
}

.grid-con-2 .grid-con-icon {
	background: rgb(100, 213, 114);
}

.grid-con-2 .grid-num {
	color: rgb(100, 213, 114);
}

.grid-con-3 .grid-con-icon {
	background: rgb(242, 94, 67);
}

.grid-con-3 .grid-num {
	color: rgb(242, 94, 67);
}

.mgb20 {
	margin-bottom: 0px;
	margin-top: 1.5%;
}

.recent_table {
	margin-top: 10px;
	margin-left: 20px;
	margin-right: 20px;
	margin-bottom: 20px;
	padding: 0px;
	height: 35%;
	border-radius: 5px;
}

#aside_tables {
	height: auto;
	margin-top: 0;
	margin-bottom: 0;
	padding: 0px;
}

.table_card {
	margin-top: 20px;
	margin-bottom: 20px;
	padding: 0px;
	height: 38%;
	border-radius: 5px;
}

.map_container_card ::v-deep .el-card__body {
	width: 100%;
	height: 100%;
	margin: 0px;
	padding: 0px;
}

.table_card ::v-deep .el-card__body {
	width: 95%;
	height: 80%;
	margin: 0px;
	padding: 0px;
}

.map_container_card {
	position: relative;
	top: 5%;
	margin-top: 20px;
	margin-bottom: 20px;
	margin-right: 1%;
	padding: 0px;
	height: 93%;
	width: 50%;
	border-radius: 5px;
}

#earthquake_map_container {
	width: 100%;
	height: 95%;
	padding: 0px;
}

#code_map_container {
	width: 100%;
	height: 95%;
	padding: 0px;
}

.recent_table_container {
	height: 100%;
	padding: 0px;
}
</style>
