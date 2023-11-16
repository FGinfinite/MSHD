<template>
  <el-card class="figure_card" shadow="hover">
    <div id="chart_count_data" class="figure"></div
  ></el-card>
  <el-card class="figure_card" shadow="hover">
    <div id="chart_carrier_data" class="figure"></div
  ></el-card>
  <el-card class="figure_card" shadow="hover">
    <div id="chart_source_data" class="figure"></div
  ></el-card>
</template>

<script setup>
import * as echarts from "echarts";
import { onMounted, ref } from "vue";
import { fetchData } from "../api/index";
import { HttpManager } from "../api";

const chart_count_data = ref({
  legendData: ["灾情数量"],
  xAxisData: ["2006", "2009", "2011", "2014", "2017", "2020", "2023"],
  seriesData: {
    灾情数量: [],
  },
});

const chart_carrier_data = ref({
  legendData: ["音频", "视频", "图片", "文本"],
  xAxisData: ["2006", "2009", "2011", "2014", "2017", "2020", "2023"],
  seriesData: {
    文本: [],
    音频: [],
    视频: [],
    图片: [],
  },
});
const char_source_data = ref({
  legendData: ["业务报送数据", "泛在感知数据", "其他数据"],
  xAxisData: ["2006", "2009", "2011", "2014", "2017", "2020", "2023"],
  seriesData: {
    业务报送数据: [],
    泛在感知数据: [],
    其他数据: [],
  },
});

onMounted(async () => {
  try {
    const response = await HttpManager.fetchInfoData();
    if (response) {
      console.log("response", response);
      response.forEach((item) => {
        if (item.hasOwnProperty("source")) {
          const source = item.source;
          char_source_data.value.seriesData[source] = item.sourcedata;
        } else if (item.hasOwnProperty("carrier")) {
          const carrier = item.carrier;
          chart_carrier_data.value.seriesData[carrier] = item.carrierdata;
        } else {
          chart_count_data.value.seriesData["灾情数量"] = item.numdata;
          console.log(chart_count_data.value);
        }
      });
      renderChart();
      renderchart_count_data("chart_count_data", chart_count_data.value);
      renderchart_count_data("chart_carrier_data", chart_carrier_data.value);
    }
    //灾情数目统计
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
});
const renderchart_count_data = (id, data) => {
  let chart_source_data = echarts.init(document.getElementById(id));
  chart_source_data.setOption({
    title: {
      text: id === "chart_count_data" ? "灾情数目统计" : "灾情数据载体类型统计",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: data.legendData,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: data.xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: data.legendData.map((source) => ({
      name: source,
      type: id === "chart_carrier_data" ? "line" : "bar",
      stack: "Total",
      areaStyle: id === "chart_count_data" ? {} : null,
      emphasis: {
        focus: "series",
      },
      data: data.seriesData[source],
    })),
  });

  window.onresize = function () {
    chart_source_data.resize();
    chart_count_data.resize();
    chart_carrier_data.resize();
  };
};

const renderChart = () => {
  let chart_source_data = echarts.init(
    document.getElementById("chart_source_data")
  );
  chart_source_data.setOption({
    title: {
      text: "灾情来源统计",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
    },
    legend: {
      data: char_source_data.value.legendData,
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        boundaryGap: false,
        data: char_source_data.value.xAxisData,
      },
    ],
    yAxis: [
      {
        type: "value",
      },
    ],
    series: char_source_data.value.legendData.map((source) => ({
      name: source,
      type: "line",
      stack: "Total",
      areaStyle: {},
      emphasis: {
        focus: "series",
      },
      data: char_source_data.value.seriesData[source],
    })),
  });

  window.onresize = function () {
    chart_source_data.resize();
  };
};
</script>

<style scoped>
.figure_card {
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
  width: 60%;
  margin-bottom: 10px;
}
.figure {
  width: 100%;
  height: 250px;
}
</style>
