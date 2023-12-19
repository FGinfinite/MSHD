<template>
  <div class="sidebar">
    <el-menu
      class="sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="sidebar.collapse"
      mode="horizontal"
      background-color="rgb(68, 123, 99)"
      text-color="#fff"
      active-text-color="rgb(115, 208, 166)"
      unique-opened
      router
    >
      <template v-for="item in items">
        <template v-if="item.subs">
          <el-sub-menu
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <template #title>
              <el-icon>
                <component :is="item.icon"></component>
              </el-icon>
              <span>{{ item.title }}</span>
            </template>
            <template v-for="subItem in item.subs">
              <el-sub-menu
                v-if="subItem.subs"
                :index="subItem.index"
                :key="subItem.index"
                v-permiss="item.permiss"
              >
                <template #title>{{ subItem.title }}</template>
                <el-menu-item
                  v-for="(threeItem, i) in subItem.subs"
                  :key="i"
                  :index="threeItem.index"
                >
                  {{ threeItem.title }}
                </el-menu-item>
              </el-sub-menu>
              <el-menu-item
                v-else
                :index="subItem.index"
                v-permiss="item.permiss"
              >
                {{ subItem.title }}
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
        <template v-else>
          <el-menu-item
            :index="item.index"
            :key="item.index"
            v-permiss="item.permiss"
          >
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </template>

      <el-card class="page_status"
        ><div class="page_status_text">{{ route.name }}</div></el-card
      >
    </el-menu>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useSidebarStore } from "../store/sidebar";
import { useRoute } from "vue-router";

const items = [
  {
    icon: "Odometer",
    index: "/dashboard",
    title: "首页",
    permiss: "1",
  },
  {
    icon: "Calendar",
    index: "1",
    title: "灾情统计",
    permiss: "2",
    subs: [
      {
        index: "/table",
        title: "灾情码列表",
        permiss: "2",
      },
      {
        index: "/import",
        title: "灾情图表统计",
        permiss: "2",
      },
      {
        index: "/visual",
        title: "灾情分布总况",
        permiss: "2",
      },
    ],
  },
  {
    icon: "Edit",
    index: "3",
    title: "数据录入",
    permiss: "4",
    subs: [
      {
        index: "/form",
        title: "灾情码录入",
        permiss: "5",
      },
      {
        index: "/upload",
        title: "灾情详情录入",
        permiss: "6",
      },
    ],
  },
  // {
  //     icon: 'Setting',
  //     index: '/icon',
  //     title: '自定义图标',
  //     permiss: '10',
  // },
  // {
  //     icon: 'PieChart',
  //     index: '/charts',
  //     title: 'schart图表',
  //     permiss: '11',
  // },
  // {
  //     icon: 'Warning',
  //     index: '/permission',
  //     title: '权限管理',
  //     permiss: '13',
  // },
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});
// 每次切换页面时，更新页面名状态
const sidebar = useSidebarStore();
</script>

<style scoped>
.sidebar {
  background-color: rgb(133, 208, 178);
}
.sidebar-el-menu {
  background-color: rgb(68, 123, 99);
}
.page_status {
  position: absolute;
  left: 50%;
  margin-top: 10px;
  margin-bottom: 10px;
  background-color: rgb(133, 208, 178);
  color: #fff;
  transform: translate(-50%, 0);
}
.page_status_text {
  height: 100%;
  font-size: 20px;
  text-align: center;
  line-height: 0px;
}
</style>
