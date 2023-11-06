<template>
    <div class="container">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="表单名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="选择器" prop="region">
                    <el-cascader :options="option1" v-model="form.options1"></el-cascader>
                </el-form-item>
                <el-form-item label="日期时间">
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date1"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="date2">
                            <el-time-picker placeholder="选择时间" v-model="form.date2" style="width: 100%">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="来源" prop="options">
                    <el-cascader :options="options" v-model="form.options2"></el-cascader>
                </el-form-item>
                <el-form-item label="文件类型" prop="resource">
                    <el-radio-group v-model="form.resource">
                        <el-radio label="图片"></el-radio>
                        <el-radio label="音频"></el-radio>
                        <el-radio label="视频"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="灾情描述" prop="desc" rules="rules">
                    <el-input type="textarea" rows="5" v-model="form.desc"></el-input>
                </el-form-item>
               
            </el-form>
        <el-upload
            class="upload-demo"
            drag
            action="http://jsonplaceholder.typicode.com/api/posts/"
            multiple
            :on-change="handle"
        >
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
            </div>
        </el-upload>
        <el-form-item>
            <el-form-item label="灾情描述" prop="desc">
                <el-button type="primary" @click="onSubmit(formRef)">表单提交</el-button>
                <el-button @click="onReset(formRef)">重置表单</el-button>
                </el-form-item>
            </el-form-item>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
const handle = (rawFile: any) => {
    console.log(rawFile);
};
const options= [
    {
        value: 'A',
        label: '业务报送数据',
        children: [
            {
                value: 'a1',
                label: '前方地震应急指挥部',
               
            },
            {
                value: 'a2',
                label: '后方地震应急指挥部',
            },
            {
                value: 'a3',
                label: '应急指挥技术系统',
            },
            {
                value: 'a4',
                label: '社会服务工程应急救援系统',
            },
            {
                value: 'a5',
                label: '危险区域评估工作组',
            },
            {
                value: 'a6',
                label: '震后政府信息支持项目组',
            },
            {
                value: 'a7',
                label: '疫情快速上报接受处理系统',
            },
            {
                value: 'a8',
                label: '地方地震局应急信息服务相关技术系统',
            },
           
        ],
    },
    {
        value: 'b',
        label: '泛在感知数据',
        children: [
            {
                value: 'b1',
                label: '互联网感知',
            },
            {
                value: 'b2',
                label: '通信网感知',
            },
            {
                value: 'b3',
                label: '舆情网感知',
            },
            {
                value: 'b4',
                label: '电力系统感知',
            },
            {
                value: 'b5',
                label: '交通系统感知',
            },
           
        ],
    },
    {
        value: 'c',
        label: '其他数据',
    },
];
const option1 = [
{
        value: 'A',
        label: '北京',
        children: [
            {
                value: 'A1',
                label: '海淀区',
            },
            {
                value: 'A2',
                label: '东城区',
            },
            {
                value: 'A3',
                label: '朝阳区',
            },
            {
                value: 'A4',
                label: '西城区',
            },
            {
                value: 'A5',
                label: '昌平区',
            },
            {
                value: 'A6',
                label: '房山区',
            },
           
        ],
    },
    {
        value: 'B',
        label: '河北省',
        children: [
            {
                value: 'B1',
                label: '石家庄市',
            },
            {
                value: 'B2',
                label: '唐山市',
            },
            {
                value: 'B3',
                label: '秦皇岛市',
            },
            {
                value: 'B4',
                label: '邯郸市',
            },
            {
                value: 'B5',
                label: '保定市',
            },
            {
                value:'B6',
                label:'张家口市'
            },
            {
                value:'B7',
                label:'廊坊市'
            }  
        ],
    },
    {
        value: 'C',
        label: '山西省',
        children:[
            {
                value:'C1',
                label:'太原市',

            },
            {
                value:'C2',
                label:'大同市',
            },
            {
                value:'C3',
                label:'阳泉市',
            },
            {
                value:'C4',
                label:'晋城市',
            },
            {
                value:'C5',
                label:'吕梁市',
            },
            {
                value:'C6',
                label:'长治市',
            }
        ]
    },
];


const rules: FormRules = {
    name: [{ required: true, message: '请输入表单名称', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: true,
    type: ['小明'],
    resource: '小红',
    desc: '',
    options1: [],
    options2:[],
});
// 提交
const onSubmit = (formEl: FormInstance | undefined) => {
    // 表单校验
    if (!formEl) return;
    formEl.validate((valid) => {
        if (valid) {
            console.log(form);
            ElMessage.success('提交成功！');
        } else {
            return false;
        }
    });
};
// 重置
const onReset = (formEl: FormInstance | undefined) => {
    if (!formEl) return;
    formEl.resetFields();
};
</script>

<style scoped>
.content-title {
    font-weight: 40;
    line-height: 50px;
    margin: 10px 0;
    font-size: 22px;
    color: #1f2f3d;
}
.upload-demo {
    width: 300px;
    
}
</style>
