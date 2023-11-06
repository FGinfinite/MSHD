<template>
	<div>
		<el-row :gutter="20">
			<el-col :span="16">
				<el-row :gutter="20" class="mgb20">
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-1">
								<el-icon class="grid-con-icon"><User /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">1234</div>
									<div>用户访问量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-2">
								<el-icon class="grid-con-icon"><ChatDotRound /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">321</div>
									<div>灾情统计数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					<el-col :span="8">
						<el-card shadow="hover" :body-style="{ padding: '0px' }">
							<div class="grid-content grid-con-3">
								<el-icon class="grid-con-icon"><Goods /></el-icon>
								<div class="grid-cont-right">
									<div class="grid-num">5000</div>
									<div>用户数量</div>
								</div>
							</div>
						</el-card>
					</el-col>
					
				</el-row>
				<el-tabs v-model="message">
			<el-tab-pane :label="`未读消息(${state.unread.length})`" name="first">
				<el-table :data="state.unread" :show-header="false" style="width: 100%">
					<el-table-column>
						<template #default="scope">
							<span class="message-title">{{ scope.row.title }}</span>
						</template>
					</el-table-column>
					<el-table-column prop="date" width="180"></el-table-column>
					<el-table-column width="120">
						<template #default="scope">
							<el-button size="small" @click="handleRead(scope.$index)">标为已读</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="handle-row">
					<el-button type="primary">全部标为已读</el-button>
				</div>
			</el-tab-pane>
			<el-tab-pane :label="`已读消息(${state.read.length})`" name="second">
				<template v-if="message === 'second'">
					<el-table :data="state.read" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-title">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="150"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button type="danger" @click="handleDel(scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">删除全部</el-button>
					</div>
				</template>
			</el-tab-pane>
			<el-tab-pane :label="`回收站(${state.recycle.length})`" name="third">
				<template v-if="message === 'third'">
					<el-table :data="state.recycle" :show-header="false" style="width: 100%">
						<el-table-column>
							<template #default="scope">
								<span class="message-title">{{ scope.row.title }}</span>
							</template>
						</el-table-column>
						<el-table-column prop="date" width="150"></el-table-column>
						<el-table-column width="120">
							<template #default="scope">
								<el-button @click="handleRestore(scope.$index)">还原</el-button>
							</template>
						</el-table-column>
					</el-table>
					<div class="handle-row">
						<el-button type="danger">清空回收站</el-button>
					</div>
				</template>
			</el-tab-pane>
		</el-tabs>
			</el-col>
		</el-row>
	</div>
</template>

<script setup lang="ts" name="dashboard">
import Schart from 'vue-schart';
import imgurl from '../assets/img/img.jpg';
import { useSidebarStore } from '../store/sidebar';
import { useTagsStore } from '../store/tags';
import vHeader from '../components/header.vue';
import vSidebar from '../components/sidebar.vue';
import vTags from '../components/tags.vue';
import { ref, reactive } from 'vue';

const message = ref('first');
const state = reactive({
	unread: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		},
		{
			date: '2018-04-19 21:00:00',
			title: '今晚12点整发大红包，先到先得'
		}
	],
	read: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		}
	],
	recycle: [
		{
			date: '2018-04-19 20:00:00',
			title: '【系统通知】该系统将于今晚凌晨2点到5点进行升级维护'
		}
	]
});

const handleRead = (index: number) => {
	const item = state.unread.splice(index, 1);
	state.read = item.concat(state.read);
};
const handleDel = (index: number) => {
	const item = state.read.splice(index, 1);
	state.recycle = item.concat(state.recycle);
};
const handleRestore = (index: number) => {
	const item = state.recycle.splice(index, 1);
	state.read = item.concat(state.read);
};
const name = localStorage.getItem('ms_username');
const role: string = name === 'admin' ? '超级管理员' : '普通用户';

</script>

<style scoped>
.el-row {
	margin-bottom: 20px;
}

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

.user-info {
	display: flex;
	align-items: center;
	padding-bottom: 20px;
	border-bottom: 2px solid #ccc;
	margin-bottom: 20px;
}

.user-info-cont {
	padding-left: 50px;
	flex: 1;
	font-size: 14px;
	color: #999;
}

.user-info-cont div:first-child {
	font-size: 30px;
	color: #222;
}

.user-info-list {
	font-size: 14px;
	color: #999;
	line-height: 25px;
}

.user-info-list span {
	margin-left: 70px;
}

.mgb20 {
	margin-bottom: 100px;
}

.todo-item {
	font-size: 14px;
}

.todo-item-del {
	text-decoration: line-through;
	color: #999;
}

.schart {
	width: 100%;
	height: 300px;
}
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>
