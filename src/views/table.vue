<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-cascader :options="option1" placeholder="位置" v-model="query.location"
					style="width: 100px "></el-cascader>
				<el-form-item prop="date">
					<el-col :span="11">
						<el-form-item prop="date1">
							<el-date-picker type="date" placeholder="日期" v-model="query.time"
								style="width: 40%"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col class="line" :span="2">-</el-col>

				</el-form-item>
				<el-cascader :options="options" placeholder="来源" v-model="query.sourceInFo"
					style="width: 100px "></el-cascader>
				<el-select v-model="query.carrierType" placeholder="载体" class="handle-select mr10">
					<el-option key="1" label="文本" value="文本"></el-option>
					<el-option key="2" label="图片" value="图片"></el-option>
					<el-option key="3" label="音频" value="音频"></el-option>
					<el-option key="4" label="视频" value="视频"></el-option>
				</el-select>
				<el-input v-model="query.disaterId" placeholder="请输入灾情码" class="handle-input mr10"></el-input>
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="disasterCode" label="灾情码" width="100" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column prop="date" label="时间" align="center"></el-table-column>
				<el-table-column prop="sourceInfo" label="消息来源" align="center"></el-table-column>
				<el-table-column prop="carrierType" label="载体" align="center"></el-table-column>
				<el-table-column prop="disasterInfo" label="灾情信息" align="center"></el-table-column>
				<el-table-column prop="information" label="详细信息" align="center">
					<router-link to="/disaterinform">灾情详述</router-link>
				</el-table-column>
				<el-table-column label="操作" width="220" align="center">
					<template #default="scope">
						<el-button text :icon="Edit" @click="handleEdit(scope.$index, scope.row)" v-permiss="15">
							编辑
						</el-button>
						<el-button text :icon="Delete" class="red" @click="handleDelete(scope.$index)" v-permiss="16">
							删除
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="pagination">
				<el-pagination background layout="total, prev, pager, next" :current-page="query.pageIndex"
					:page-size="query.pageSize" :total="pageTotal" @current-change="handlePageChange"></el-pagination>
			</div>
		</div>
		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="灾情码">
					<el-input v-model="form.disasterCode"></el-input>
				</el-form-item>
				<el-form-item label="位置">
					<el-input v-model="form.location"></el-input>
				</el-form-item>
				<el-form-item label="时间">
					<el-input v-model="form.date"></el-input>
				</el-form-item>
				<el-form-item label="信息来源">
					<el-input v-model="form.sourceInfo"></el-input>
				</el-form-item>
				<el-form-item label="载体">
					<el-input v-model="form.carrierType"></el-input>
				</el-form-item>

			</el-form>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="editVisible = false">取 消</el-button>
					<el-button type="primary" @click="saveEdit">确 定</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script setup lang="ts" name="basetable">
import { ref, reactive } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Delete, Edit, Search, Plus } from '@element-plus/icons-vue';
import { fetchData } from '../api/index';
import { HttpManager } from "../api";
import { useRoute } from 'vue-router';

const options = [
	{
		value: '业务报送数据',
		label: '业务报送数据',
		children: [
			{
				value: '前方地震应急指挥部',
				label: '前方地震应急指挥部',

			},
			{
				value: '后方地震应急指挥部',
				label: '后方地震应急指挥部',
			},
			{
				value: '应急指挥技术系统',
				label: '应急指挥技术系统',
			},
			{
				value: '社会服务工程应急救援系统',
				label: '社会服务工程应急救援系统',
			},
			{
				value: '危险区域评估工作组',
				label: '危险区域评估工作组',
			},
			{
				value: '震后政府信息支持项目组',
				label: '震后政府信息支持项目组',
			},
			{
				value: '疫情快速上报接受处理系统',
				label: '疫情快速上报接受处理系统',
			},
			{
				value: '地方地震局应急信息服务相关技术系统',
				label: '地方地震局应急信息服务相关技术系统',
			},

		],
	},
	{
		value: '泛在感知数据',
		label: '泛在感知数据',
		children: [
			{
				value: '互联网感知',
				label: '互联网感知',
			},
			{
				value: '通信网感知',
				label: '通信网感知',
			},
			{
				value: '舆情网感知',
				label: '舆情网感知',
			},
			{
				value: '电力系统感知',
				label: '电力系统感知',
			},
			{
				value: '交通系统感知',
				label: '交通系统感知',
			},

		],
	},
	{
		value: '其他数据',
		label: '其他数据',
	},
];
const option1 = [
{
        value: '北京',
        label: '北京',
        children: [
            {
                value: '海淀区',
                label: '海淀区',
            },
            {
                value: '东城区',
                label: '东城区',
            },
            {
                value: '朝阳区',
                label: '朝阳区',
            },
            {
                value: '西城区',
                label: '西城区',
            },
            {
                value: '昌平区',
                label: '昌平区',
            },
            {
                value: '房山区',
                label: '房山区',
            },
           
        ],
    },
    {
        value: '河北省',
        label: '河北省',
        children: [
            {
                value: '石家庄市',
                label: '石家庄市',
            },
            {
                value: '唐山市',
                label: '唐山市',
            },
            {
                value: '秦皇岛市',
                label: '秦皇岛市',
            },
            {
                value: '邯郸市',
                label: '邯郸市',
            },
            {
                value: '保定市',
                label: '保定市',
            },
            {
                value:'张家口市',
                label:'张家口市'
            },
            {
                value:'廊坊市',
                label:'廊坊市'
            }  
        ],
    },
    {
        value: '山西省',
        label: '山西省',
        children:[
            {
                value:'太原市',
                label:'太原市',

            },
            {
                value:'大同市',
                label:'大同市',
            },
            {
                value:'阳泉市',
                label:'阳泉市',
            },
            {
                value:'晋城市',
                label:'晋城市',
            },
            {
                value:'吕梁市',
                label:'吕梁市',
            },
            {
                value:'长治市',
                label:'长治市',
            }
        ]
    },
];
interface TableItem {   //定义表格中每一项数据的结构
	disasterCode: string;
	location: string;
	date: string;
	sourceInfo: string;
	carrierType: string;
	disasterInfo: string;
}

const query = reactive({//用于查询的各种属性，如分页信息、灾害 ID、位置、时间、资源信息
	pageIndex: 1,
	pageSize: 10,
	disaterId: '',
	location: '',
	time: '',
	sourceInFo: '',
	carrierType: ''
});
// 查询操作
const handleSearch = async () => {
	const formData = new FormData();
	formData.set('location', query.location);
	formData.set('date', query.time);
	formData.set('sourceInfo', query.sourceInFo);
	formData.set('carrierType', query.carrierType);
	formData.set('disasterCode', query.disaterId);

	try {
		const response: any = await HttpManager.searchDisaster(formData);
		console.log('testHttpPost 响应', response);
		if (response && response.length > 0) {
			ElMessage.success('查询成功！');
			// 检查响应中是否有'data'属性，并且'data'属性是否包含'list'和'pageTotal'属性
			tableData.value = response;
			pageTotal.value = response.length;
		} else {
			console.error('testHttpPost 错误: 响应中缺少预期的数据');
		}
	} catch (error) {
		console.error('testHttpPost 错误', error);
	}
};
const tableData = ref<TableItem[]>([]);//存储表格数据数组
const pageTotal = ref(0);//存储数据总条数，用于分页
// 获取表格数据
const getData = () => {
	handleSearch();
};
getData();

// 分页导航
const handlePageChange = (val: number) => {
	query.pageIndex = val;
	getData();
};

// 删除操作
const handleDelete = (index: number) => {
	// 二次确认删除
	ElMessageBox.confirm('确定要删除吗？', '提示', {
		type: 'warning'
	})
		.then(() => {
			ElMessage.success('删除成功');
			tableData.value.splice(index, 1);
		})
		.catch(() => { });
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: '',
	disasterInfo: '',
	disasterCode: '',
	carrierType: '',
	date: '',
	location: '',
	sourceInfo: '',

});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.disasterInfo = row.disasterInFo;
	form.disasterCode = row.disasterCode;
	form.date = row.time;
	form.sourceInfo = row.sourceInFo;
	form.location = row.location;
	editVisible.value = true;
};

const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].disasterInfo = form.disasterInfo;
	tableData.value[idx].disasterCode = form.disasterCode;
	tableData.value[idx].date = form.date;
	tableData.value[idx].location = form.location;
	tableData.value[idx].carrierType = form.carrierType;
	tableData.value[idx].sourceInfo = form.sourceInfo;


};
</script>
<style scoped>
.handle-box {
	margin-bottom: 20px;
}

.handle-select {
	width: 90px;
}

.handle-input {
	width: 300px;
}

.table {
	width: 100%;
	font-size: 14px;
}

.red {
	color: #F56C6C;
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
</style>
