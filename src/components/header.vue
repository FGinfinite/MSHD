<template>
	<div class="header">
		<div class="topleft">
		<div class="logo">灾情一体化管理平台</div>
	</div>
		<div class="header-right">
			<div class="header-user-con">
				<!-- 用户头像 -->
				<el-avatar class="user-avator" :size="35" :src="imgurl" shape="square" />
				<!-- 用户名下拉菜单 -->
				<el-dropdown class="user-name" trigger="click" @command="handleCommand">
					<span class="el-dropdown-link">
						{{ username }}
						<el-icon class="el-icon--right">
							<arrow-down />
						</el-icon>
					</span>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="user">个人中心</el-dropdown-item>
							<el-dropdown-item divided command="loginout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useSidebarStore } from '../store/sidebar';
import { useRouter } from 'vue-router';
import imgurl from '../assets/img/img.jpg';
import { ElMessage } from "element-plus";

const username: string | null = localStorage.getItem('ms_username');
const message: number = 2;

const sidebar = useSidebarStore();


// 用户名下拉菜单选择事件
const router = useRouter();
const handleCommand = (command: string) => {
	if (command == 'loginout') {
		localStorage.removeItem('ms_username');
		ElMessage.success('退出成功');
		router.push('/login');
	} else if (command == 'user') {
		router.push('/user');
	}
};
</script>
<style scoped>
.header {
	display: flex;
	justify-content: space-between;
	position: relative;
	/* box-sizing: border-box; */
	/* width: 100%; */
	height: 50px;
	font-size: 22px;
	color: #fff;
	/* margin-left: 29px; */
	animation: expandAnimation 0.5s ease;
	background-color: rgb(83, 164, 120);
	border-bottom-style: solid;
	border-bottom-width: 1px;
	border-bottom-color: rgb(115, 208, 166);	
}
.header1 {
	animation: expandAnimation 0.5s ease;
	display: flex;
	justify-content: space-between;
	margin-left: -157px;
	position: relative;
	/* box-sizing: border-box; */
	width: 111%;
	height: 70px;
	font-size: 22px;
	color: #fff;
	background-color: rgb(68, 123, 99);
}
.collapse-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.collapse-btn1 {
	margin-left: -157px;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
	float: left;
	padding: 0 21px;
	cursor: pointer;
}
.collapse-btn:hover {
	background-color: rgb(68, 123, 99);
}
.header .logo {
	float: left;
	width: 250px;
	line-height: 70px;
	margin-left: 20%;
}
.header-right {
	float: right;
	padding-right: 50px;
}
.header-user-con {
	display: flex;
	height: 100%;
	align-items: center;
}
.btn-fullscreen {
	transform: rotate(45deg);
	margin-right: 5px;
	font-size: 24px;
}
.btn-bell,
.btn-fullscreen {
	position: relative;
	width: 30px;
	height: 30px;
	text-align: center;
	border-radius: 15px;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.btn-bell-badge {
	position: absolute;
	right: 4px;
	top: 0px;
	width: 8px;
	height: 8px;
	border-radius: 4px;
	background: #f56c6c;
	color: #fff;
}
.btn-bell .el-icon-lx-notice {
	color: #fff;
}
.user-name {
	margin-left: 10px;
}
.user-avator {
	margin-left: 20px;
}
.el-dropdown-link {
	color: #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
}
.el-dropdown-menu__item {
	text-align: center;
}
.topleft {
	display: flex;
	align-items: center;
}
</style>
