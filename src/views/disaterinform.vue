<template>
    <h1>灾情信息展示</h1>
</template>
<!-- <template>
    <div class="scene-container">
        <el-card class="card1">
            <el-form :inline="true" :model="formInline" class="demo-form-inline" size="small">
                <el-form-item label="场景名称">
                    <el-input v-model="formInline.scenename" placeholder="场景名称"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-select v-model="formInline.des" placeholder="关键词">
                    <el-option label="杭州电子科技大学" value="1"></el-option>
                    <el-option label="云技术实验室" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" icon="el-icon-search" style="background:rgb(14,122,162)" @click="onSearch()">搜索</el-button>
                    <el-button icon="el-icon-refresh-left" @click="clearAll()">清空</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formInline2" class="demo-form-inline2" size="small">
                <el-form-item>
                    <el-button type="primary" style="background:rgb(14,122,162)"><i class="el-icon-plus"></i>新增</el-button>
                    <el-button type="primary" style="background:rgb(14,122,162)">编辑</el-button>
                    <el-button type="primary" style="background:rgb(14,122,162)">删除</el-button>
                    <el-button type="info">刷新数据</el-button>
                    <el-button type="warning">导出excel</el-button>
                    <el-button @click="toggleSelection()">取消选择</el-button>
                    <el-button type="danger">隐藏搜索栏</el-button>
                </el-form-item>
            </el-form>
            <div class="table-section">
                <span>当前表格已选择 0 项  </span>
                <el-button type="text" style="color:rgb(14,122,162)" @click="toggleSelection()">清空</el-button>
                <el-table :data="tableData" 
                    :header-cell-style="tableHeaderColor"
                    ref="multipleTable"
                    style="width: 100%" 
                    :row-class-name="tableRowClassName"
                    border
                    size="small"
                    @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column type="index" width="50" align="center"></el-table-column>
                    <el-table-column prop="date" label="日期" width="180" align="center"></el-table-column>
                    <el-table-column prop="name" label="姓名" width="180" sortable align="center"></el-table-column>
                    <el-table-column prop="address" label="地址" align="center"></el-table-column>
                    <el-table-column
                        prop="tag"
                        label="标签"
                        width="100"
                        :filters="[{ text: '学校', value: '学校' }, { text: '公司', value: '公司' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end"
                        align="center">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.tag === '学校' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.tag}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                        <el-button
                            size="mini"
                            icon="el-icon-view"
                            @click="handleEdit(scope.$index, scope.row)">查看</el-button>
                        <el-button
                            size="mini"
                            type="danger"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>
 
<script>
export default {
    name: 'topbar',
    data() {
        return {
            formInline: {
                scenename: '',
                des: ''
            },
            formInline2: {},
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '公司'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '学校'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '学校'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                address: '上海市普陀区金沙江路 1518 弄',
                tag: '公司'
            }],
            multipleSelection: []
            
        };
    },
    methods: {
        onSearch() {
 
        },
        clearAll() {
            this.formInline.scenename = '',
            this.formInline.des = ''
        },
        //table的双色条纹
        tableRowClassName({row, rowIndex}) {
            if (rowIndex === 1) {
                return 'warning-row';
            } else if (rowIndex === 3) {
                return 'success-row';
            }
            return '';
        },
        //table的全选按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        //table的取消选择
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        //table的标签
        filterTag(value, row) {
            return row.tag === value;
        },
        //table的编辑和删除
        handleEdit(index, row) {
            console.log(index, row);
        },
        handleDelete(index, row) {
            console.log(index, row);
        },
        //修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'background-color:rgb(250,250,250);'
            }
        },
    }
}
</script>
 
<style lang="scss" scoped>
.scene-container {
    margin: 10px;
}
</style>
<style>
.scene-container .el-table .warning-row {
    background: oldlace;
}
.scene-container .el-table .success-row {
    background: #f0f9eb;
}
</style>
  -->