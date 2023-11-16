
<template>
  <div id="myChart" style="width:1500px;height:500px;margin:auto;"></div>
  <div id="chart1" style="width: 1500px; height: 500px; margin: auto;"></div>
  <div id="chart2" style="width: 1500px; height: 500px; margin: auto;"></div>
  <h3>灾情数目统计</h3>
  <h3>灾情数据载体类型统计</h3>
</template>

<script>
import * as echarts from 'echarts'
import { onMounted, ref } from "vue";
import { fetchData } from '../api/index';
import { HttpManager } from "../api";

export default {
  setup() {
    const chart1Data = ref({
      legendData: ['灾情数量'],
      xAxisData: ['2006', '2009', '2011', '2014', '2017', '2020', '2023'],
      seriesData: {
        '灾情数量': [],
      }
    });

    const chart2Data = ref({
      legendData: ['音频', '视频', '图片', '文字'],
      xAxisData: ['2006', '2009', '2011', '2014', '2017', '2020', '2023'],
      seriesData: {
        '音频': [],
        '视频': [],
        '图片': [],
        '文字': [],
      }
    });
    const chartData = ref({
      legendData: ['业务报送数据', '泛在感知数据', '其他数据'],
      xAxisData: ['2006', '2009', '2011', '2014', '2017', '2020', '2023'],
      seriesData: {
        '业务报送数据': [],
        '泛在感知数据': [],
        '其他数据': [],
      }
    });

    onMounted(async () => {
      try {
        const response = await HttpManager.fetchInfoData();
        if (response) {
          console.log('response', response);
          response.forEach(item => {
            if (item.hasOwnProperty('source')) {
              const source = item.source;
              chartData.value.seriesData[source] = item.sourcedata;
            }
            else if (item.hasOwnProperty('carrier')) {
              const source1 = item.carrier;
              chart2Data.value.seriesData[source1] = item.carrierdata
            }
            else {
              chart1Data.value.seriesData['灾情数量'] = item.numdata;
              console.log(chart1Data.value);
            }

          });
          renderChart();
          renderChart1('chart1', chart1Data.value);
          renderChart1('chart2', chart2Data.value);
        }
        //灾情数目统计
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    });
    const renderChart1 = (id, data) => {
      let myChart = echarts.init(document.getElementById(id));
      myChart.setOption({
        title: {
          text: id === 'chart1' ? '灾情数目统计' : '灾情数据载体类型统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: data.legendData
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: data.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: data.legendData.map(source => ({
          name: source,
          type: id === 'chart2' ? 'line' : 'bar',
          stack: 'Total',
          areaStyle: id === 'chart1' ? {} : null,
          emphasis: {
            focus: 'series'
          },
          data: data.seriesData[source]
        }))
      });

      window.onresize = function () {
        myChart.resize();
      };
    };

    const renderChart = () => {
      let myChart = echarts.init(document.getElementById("myChart"));
      myChart.setOption({
        title: {
          text: '灾情来源统计'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: chartData.value.legendData
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: chartData.value.xAxisData
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: chartData.value.legendData.map(source => ({
          name: source,
          type: 'line',
          stack: 'Total',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: chartData.value.seriesData[source]
        }))
      });

      window.onresize = function () {
        myChart.resize();
      };
    };
    return {
      chartData,
      renderChart,
      chart1Data,
      chart2Data,
      renderChart1,
    };
  }
}
</script>
