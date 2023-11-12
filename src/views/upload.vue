<template>
    <div class="container">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
                <el-form-item label="发生地点" prop="region">
                    <el-cascader :options="option1" v-model="form.location"></el-cascader>
                </el-form-item>
                <el-form-item label="日期时间" prop ="date">
                    <el-col :span="11">
                        <el-form-item prop="date1">
                            <el-date-picker
                                type="date"
                                placeholder="选择日期"
                                v-model="form.date"
                                style="width: 100%"
                            ></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="11">
                        <el-form-item prop="date2">
                            <el-time-picker placeholder="选择时间" v-model="form.time" style="width: 100%">
                            </el-time-picker>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="来源" prop="options">
                    <el-cascader :options="options" v-model="form.sourceInFo"></el-cascader>
                </el-form-item>
                <el-form-item label="文件类型" prop="resource">
                    <el-radio-group v-model="form.carrierType">
                        <el-radio label="图片"></el-radio>
                        <el-radio label="音频"></el-radio>
                        <el-radio label="视频"></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="灾情描述" prop="desc" rules="rules">
                    <el-input type="textarea" rows="5" v-model="form.disarterInFo"></el-input>
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
                <el-button type="primary" @click="onSubmit()">表单提交</el-button>
                <el-button @click="onReset(formRef)">重置表单</el-button>
            </el-form-item>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ElMessage,UploadProps, UploadUserFile } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { HttpManager } from "../api";
const handle = (rawFile: any) => {
    form.disaterMediaURL = rawFile;
    console.log('上传的文件：', rawFile);
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
    name: [{ required: true, message: '请输入', trigger: 'blur' }],
    region: [{ required: true, message: '请输入', trigger: 'blur' }],
    date: [{ required: true, message: '请输入', trigger: 'blur' }],
    options: [{ required: true, message: '请输入', trigger: 'blur' }],
    resource: [{ required: true, message: '请输入', trigger: 'blur' }],
    rules: [{ required: true, message: '请输入', trigger: 'blur' }],
};
const formRef = ref<FormInstance>();
const form = reactive({
    date: '',
    time: '',
    carrierType: '',
    disarterInFo: '',
    location: [],
    sourceInFo:[],
    disaterMediaURL:'',

});
// 提交
const onSubmit = async ()=> {
    const jsondata = {};
    jsondata['date'] = form.date;
    jsondata['time'] = form.time;
    jsondata['varrierType'] = form.carrierType;
    jsondata['disarterInFo'] = form.disarterInFo;
    jsondata['location'] = form.location;
    jsondata['sourceInFo'] = form.sourceInFo;
    jsondata['disaterMediaURL'] = form.disaterMediaURL;
    try {
        // 调用 testHttpPost 函数，根据需要换成其他函数
        const response:any = await HttpManager.testHttpPost2(jsondata);
        console.log('testHttpPost 响应', response);
        // 处理响应数据
        if (response["status"]) {
          ElMessage.success('提交成功！');
        }
      } catch (error) {
        console.error('testHttpPost 错误', error);
        // 处理错误
        // ...

      }


   
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
