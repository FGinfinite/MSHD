<template>
	<div>
		<div class="container">
			<div class="handle-box">
				<el-select v-model="query.location " placeholder="位置" class="handle-select mr10">
					<el-option key="1" label="广东省" value="广东省"></el-option>
					<el-option key="2" label="湖南省" value="湖南省"></el-option>
					<el-option key="3" label="河北省" value="河北省"></el-option>

				</el-select>
				<el-form-item  prop ="date">
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker
                                type="date"
                                placeholder="日期"
                                v-model="query.time"
                                style="width: 40%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                  
                </el-form-item>
				<el-select v-model="query.soureInFo" placeholder="来源" class="handle-select mr10">
					<el-option key="1" label="业务报送数据" value="业务报送数据"></el-option>
					<el-option key="2" label="泛在感知数据" value="泛在感知数据"></el-option>
					<el-option key="2" label="其他数据" value="其他数据"></el-option>
				</el-select>
				<el-select v-model="query.carrierType" placeholder="载体" class="handle-select mr10">
					<el-option key="1" label="文本" value="文本"></el-option>
					<el-option key="2" label="图片" value="图片"></el-option>
					<el-option key="3" label="音频" value="音频"></el-option>
					<el-option key="4" label="视频" value="视频"></el-option>
				</el-select>
				<el-input v-model="query.disaterId" placeholder="请输入灾情码" class="handle-input mr10"></el-input>
				<el-button type="primary" :icon="Search" @click="handleSearch">搜索</el-button>
				<!-- <el-button type="primary" :icon="Plus">新增</el-button> -->
			</div>
			<el-table :data="tableData" border class="table" ref="multipleTable" header-cell-class-name="table-header">
				<el-table-column prop="disaterId" label="灾情码" width="100" align="center"></el-table-column>
				<el-table-column prop="location" label="位置" align="center"></el-table-column>
				<el-table-column label="时间" align="center"></el-table-column>
				<el-table-column label="消息来源" align="center"></el-table-column>
				<el-table-column prop="carrierType" label="载体" align="center"></el-table-column>
				<el-table-column label="灾情信息" align="center"></el-table-column>
				<el-table-column prop="imforation" label="详细信息" align="center"></el-table-column>
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
				<el-pagination
					background
					layout="total, prev, pager, next"
					:current-page="query.pageIndex"
					:page-size="query.pageSize"
					:total="pageTotal"
					@current-change="handlePageChange"
				></el-pagination>
			</div>
		</div>
		<!-- 编辑弹出框 -->
		<el-dialog title="编辑" v-model="editVisible" width="30%">
			<el-form label-width="70px">
				<el-form-item label="灾情码">
					<el-input v-model="form.sourceInFo"></el-input>
				</el-form-item>
				<el-form-item label="位置">
					<el-input v-model="form.location"></el-input>
				</el-form-item>
				<el-form-item label="时间">
					<el-input v-model="form.time"></el-input>
				</el-form-item>
				<el-form-item label="信息来源">
					<el-input v-model="form.sourceInFo"></el-input>
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

interface TableItem {
	disaterId:string;
	location :string;
	time:string;
	sourceInFo:string ;
	carrierType:string;
	disarterInFo:string;
}

const query = reactive({
	pageIndex: 1,
	pageSize: 10,
	disaterId:'',
	location :'',
	time:'',
	soureInFo:'',
	carrierType:''
});

const tableData = ref<TableItem[]>([]);
const pageTotal = ref(0);
// 获取表格数据
const getData = () => {
	fetchData(query).then(res => {
		tableData.value = res.data.list;
		pageTotal.value = res.data.pageTotal || 50;
	});
};
getData();
// 查询操作
const handleSearch = async () => {
	const formData = new FormData();
	formData.set('location', query.location);
	formData.set('date', query.time);
	formData.set('sourceInfo',query.soureInFo);
	formData.set('carrierType', query.carrierType);
	formData.set('disasterCode', query.disaterId);

	try {
    const response: any = await HttpManager.searchDisaster(formData);
    console.log('testHttpPost 响应', response);
    if (response["status"]) {
        ElMessage.success('查询成功！');
        // 检查响应中是否有'data'属性，并且'data'属性是否包含'list'和'pageTotal'属性
        if (response.data && response.data.list && response.data.pageTotal) {
            tableData.value = response.data.list;
            pageTotal.value = response.data.pageTotal / 50;
        } else {
            console.error('testHttpPost 错误: 响应中缺少预期的数据');
        }
    }
} catch (error) {
    console.error('testHttpPost 错误', error);
}



	// const queryParams = {
    //     pageIndex: query.pageIndex,
    //     pageSize: query.pageSize,
    //     disaterId: query.disaterId,
    //     location: query.location,
    //     time: query.time,
    //     soureInFo: query.soureInFo,
    // };
	// // 发送查询请求
    // fetchData(queryParams)
    //     .then((res) => {
    //         tableData.value = res.data.list;
    //         pageTotal.value = res.data.pageTotal || 50;
    //     })
    //     .catch((error) => {
    //         console.error('查询失败', error);
    //         // 处理错误
    //         // ...
    //     });

	
};
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
		.catch(() => {});
};

// 表格编辑时弹窗和保存
const editVisible = ref(false);
let form = reactive({
	name: '',
	address: '',
	disarterInFo:'',
	disaterId:'',
	carrierType:'',
	time:'',
	location:'',
	sourceInFo:'',

});
let idx: number = -1;
const handleEdit = (index: number, row: any) => {
	idx = index;
	form.disarterInFo = row.disarterInFo;
	form.disaterId = row.disaterId;
	form.time = row.time;
	form.sourceInFo = row.sourceInFo;
	form.location  = row.location ;



	editVisible.value = true;
};
const saveEdit = () => {
	editVisible.value = false;
	ElMessage.success(`修改第 ${idx + 1} 行成功`);
	tableData.value[idx].disarterInFo = form.disarterInFo;
	tableData.value[idx].disaterId = form.disaterId;
	tableData.value[idx].time = form.time;
	tableData.value[idx].location = form.location;
	tableData.value[idx].carrierType = form.carrierType;
	tableData.value[idx].sourceInFo = form.sourceInFo;
	

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
