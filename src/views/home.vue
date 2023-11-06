<template>
	<v-header />
	<v-sidebar />
	<div class="content-box" :class="{ 'content-collapse': sidebar.collapse }">
		<v-tags></v-tags>
		<div class="content">

			<router-view v-slot="{ Component }">
				
				<transition name="move" mode="out-in">
					
					<keep-alive :include="tags.nameList">
						<component :is="Component"></component>
					</keep-alive>
				</transition>
				
			</router-view>
			
		</div>
	</div>
</template>
<script setup lang="ts">
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
const sidebar = useSidebarStore();
const tags = useTagsStore();
</script>

<style>
.message-title {
	cursor: pointer;
}
.handle-row {
	margin-top: 30px;
}
</style>


