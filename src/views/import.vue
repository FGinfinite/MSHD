<!-- <template>
    <div>
        <div class="container">
            <div class="handle-box">
                <el-upload
                    action="#"
                    :limit="1"
                    accept=".xlsx, .xls"
                    :show-file-list="false"
                    :before-upload="beforeUpload"
                    :http-request="handleMany"
                >
                    <el-button class="mr10" type="success">批量导入</el-button>
                </el-upload>
                <el-link href="/template.xlsx" target="_blank">下载模板</el-link>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="sno" label="学号"></el-table-column>
                <el-table-column prop="class" label="班级"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
            </el-table>
            <div class="handle-box">
                <el-button type="primary" @click="exportXlsx">导出Excel</el-button>
            </div>
            <el-table :data="tableData" border class="table" header-cell-class-name="table-header">
                <el-table-column prop="id" label="ID" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column prop="sno" label="学号"></el-table-column>
                <el-table-column prop="class" label="班级"></el-table-column>
                <el-table-column prop="age" label="年龄"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script setup lang="ts" name="import">
import { UploadProps } from 'element-plus';
import { ref, reactive } from 'vue';
import * as XLSX from 'xlsx';
interface TableItem {
    id: number;
    name: string;
    sno: string;
    class: string;
    age: string;
    sex: string;
}

const list = [['序号', '姓名', '学号', '班级', '年龄', '性别']];
const exportXlsx = () => {
    tableData.value.map((item: any, i: number) => {
        const arr: any[] = [i + 1];
        arr.push(...[item.name, item.sno, item.class, item.age, item.sex]);
        list.push(arr);
    });
    let WorkSheet = XLSX.utils.aoa_to_sheet(list);
    let new_workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(new_workbook, WorkSheet, '第一页');
    XLSX.writeFile(new_workbook, `表格.xlsx`);
};
interface TableItem {
    id: number;
    name: string;
    sno: string;
    class: string;
    age: string;
    sex: string;
}

const tableData = ref<TableItem[]>([]);
// 获取表格数据
const getData = () => {
    tableData.value = [
        {
            id: 1,
            name: '小明',
            sno: 'S001',
            class: '一班',
            age: '10',
            sex: '男',
        },
        {
            id: 2,
            name: '小红',
            sno: 'S002',
            class: '一班',
            age: '9',
            sex: '女',
        },
    ];
};
getData();

const importList = ref<any>([]);
const beforeUpload: UploadProps['beforeUpload'] = async (rawFile) => {
    importList.value = await analysisExcel(rawFile);
    return true;
};
const analysisExcel = (file: any) => {
    return new Promise(function (resolve, reject) {
        const reader = new FileReader();
        reader.onload = function (e: any) {
            const data = e.target.result;
            let datajson = XLSX.read(data, {
                type: 'binary',
            });

            const sheetName = datajson.SheetNames[0];
            const result = XLSX.utils.sheet_to_json(datajson.Sheets[sheetName]);
            resolve(result);
        };
        reader.readAsBinaryString(file);
    });
};

const handleMany = async () => {
    // 把数据传给服务器后获取最新列表，这里只是示例，不做请求
    const list = importList.value.map((item: any, index: number) => {
        return {
            id: index,
            name: item['姓名'],
            sno: item['学号'],
            class: item['班级'],
            age: item['年龄'],
            sex: item['性别'],
        };
    });
    tableData.value.push(...list);
};
</script>

<style scoped>
.handle-box {
    display: flex;
    margin-bottom: 20px;
}

.table {
    width: 100%;
    font-size: 14px;
}
.mr10 {
    margin-right: 10px;
}
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #f56c6c;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style> -->
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

