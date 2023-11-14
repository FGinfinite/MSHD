<template>
    <div id="code_view">灾情码：{{ code }}</div>
    <div id="code_detail">
        <el-collapse v-model="activeNames">
            <el-collapse-item title="灾情详情" name="1">
                <el-descriptions class="margin-top" :title="code" :column="3" :size="size" border>
                    <!-- opration按钮 -->
                    <template #extra>
                        <el-button type="primary">快速定位</el-button>
                    </template>

                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon :style="iconStyle">
                                    <Document />
                                </el-icon>
                                编码
                            </div>
                        </template>
                        {{ code }}
                    </el-descriptions-item>

                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon :style="iconStyle">
                                    <Connection />
                                </el-icon>
                                来源
                            </div>
                        </template>
                        {{code_source}}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon :style="iconStyle">
                                    <location />
                                </el-icon>
                                Place
                            </div>
                        </template>
                        Suzhou
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon :style="iconStyle">
                                    <tickets />
                                </el-icon>
                                Remarks
                            </div>
                        </template>
                        <el-tag size="small">School</el-tag>
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template #label>
                            <div class="cell-item">
                                <el-icon :style="iconStyle">
                                    <office-building />
                                </el-icon>
                                Address
                            </div>
                        </template>
                        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
                    </el-descriptions-item>
                </el-descriptions>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import {
    Iphone,
    Location,
    OfficeBuilding,
    Tickets,
    User,
} from '@element-plus/icons-vue'

const code = ref('')
const code_source = ref('')
// 测试数据
code.value = '130281113210202302251430001000101001';
code_source.value = '业务报送数据 - 前方地震应急指挥部';

const activeNames = ref(['1']);

const size = ref('')
const iconStyle = computed(() => {
    const marginMap = {
        large: '8px',
        default: '6px',
        small: '4px',
    }
    return {
        marginRight: marginMap[size.value] || marginMap.default,
    }
})

const blockMargin = computed(() => {
    const marginMap = {
        large: '32px',
        default: '28px',
        small: '24px',
    }
    return {
        marginTop: marginMap[size.value] || marginMap.default,
    }
})
</script>

<style scoped>
.el-descriptions {
    margin-top: 20px;
}

.cell-item {
    display: flex;
    align-items: center;
}

.margin-top {
    margin-top: 20px;
}
</style>