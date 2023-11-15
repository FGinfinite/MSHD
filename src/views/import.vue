<!-- 
<template>
	
  <div id="myChart" style="width:1500px;height:500px;margin:auto;"></div>
  <h3>灾情数目统计</h3>
  <h3>灾情数据载体类型统计</h3>
  
</template>

<script>
// 引入echarts
import * as echarts from 'echarts'
import {onMounted} from "vue";

export default {
  setup() {
    onMounted(() => { // 需要在页面加载完毕后展示图表，这里使用Vue3的组合式生命周期钩子 onMounted()
      let myChart = echarts.init(document.getElementById("myChart"));
// 设置图表配置项,可以直接从Echarts的示例中，将配置项复制下来后放入下列的myChart.setOption()中实现图表的样式更换
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
          data: ['业务报送数据', '泛在感知数据', '其他数据']
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
            data: ['2006', '2009', '2011', '2014', '2017', '2020', '2023']
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '业务报送数据',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [120, 230, 101, 134, 90, 230, 40]
          },
          {
            name: '泛在感知数据',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [220, 100, 191, 234, 230, 120, 310]
          },
          {
            name: '其他数据',
            type: 'line',
            stack: 'Total',
            areaStyle: {},
            emphasis: {
              focus: 'series'
            },
            data: [150, 100, 201, 154, 190, 120, 210]
          },
         
        ]
            });
            window.onresize = function () { // 自适应大小
              myChart.resize();
            };
        
      }); 
    }
}
</script>
 -->
 <template>
  <div id="myChart" style="width:1500px;height:500px;margin:auto;"></div>
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
        const response = await HttpManager.fetchSourceInfoData(); 
        if (response) {

          console.log('response', response);
         
          response.forEach(item => {
            const source = item.source;
            chartData.value.seriesData[source] = item.data;
            console.log('charData', chartData.value.seriesData);
          });

          renderChart();
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    });

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
    };
  }
}
</script>
