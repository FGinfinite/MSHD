<template>
  <div class="container">
    <el-form ref="formRef" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="发生地点" prop="region">
        <el-cascader :options="option1" v-model="form.location"></el-cascader>
      </el-form-item>
      <el-form-item label="日期时间" prop="date">
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
            <el-time-picker
              placeholder="选择时间"
              v-model="form.time"
              style="width: 100%"
            >
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
        <el-input
          type="textarea"
          rows="5"
          v-model="form.disarterInFo"
        ></el-input>
      </el-form-item>
      <el-form-item label="上传文件" prop="desc">
        <el-upload
          class="upload-demo"
          drag
          action
          multiple
          :on-change="handle"
          :auto-upload="false"
        >
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            将文件拖到此处，或
            <em>点击上传</em>
          </div>
        </el-upload></el-form-item
      >
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">表单提交</el-button>
        <el-button @click="onReset(formRef)">重置表单</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { ElMessage, UploadProps, UploadUserFile } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { HttpManager } from "../api";

let formData = new FormData();
const handle = (file: { raw: string | Blob }, fileList: any) => {
  formData.set("disasterMediaFile", file.raw);
  console.log("上传的文件：", file.raw);
};

const options = [
  {
    value: "业务报送数据",
    label: "业务报送数据",
    children: [
      {
        value: "前方地震应急指挥部",
        label: "前方地震应急指挥部",
      },
      {
        value: "后方地震应急指挥部",
        label: "后方地震应急指挥部",
      },
      {
        value: "应急指挥技术系统",
        label: "应急指挥技术系统",
      },
      {
        value: "社会服务工程应急救援系统",
        label: "社会服务工程应急救援系统",
      },
      {
        value: "危险区域评估工作组",
        label: "危险区域评估工作组",
      },
      {
        value: "震后政府信息支持项目组",
        label: "震后政府信息支持项目组",
      },
      {
        value: "疫情快速上报接受处理系统",
        label: "疫情快速上报接受处理系统",
      },
      {
        value: "地方地震局应急信息服务相关技术系统",
        label: "地方地震局应急信息服务相关技术系统",
      },
    ],
  },
  {
    value: "泛在感知数据",
    label: "泛在感知数据",
    children: [
      {
        value: "互联网感知",
        label: "互联网感知",
      },
      {
        value: "通信网感知",
        label: "通信网感知",
      },
      {
        value: "舆情网感知",
        label: "舆情网感知",
      },
      {
        value: "电力系统感知",
        label: "电力系统感知",
      },
      {
        value: "交通系统感知",
        label: "交通系统感知",
      },
    ],
  },
  {
    value: "其他数据",
    label: "其他数据",
  },
];
const option1 = [
  {
    value: "北京",
    label: "北京",
    children: [
      {
        value: "海淀区",
        label: "海淀区",
      },
      {
        value: "东城区",
        label: "东城区",
      },
      {
        value: "朝阳区",
        label: "朝阳区",
      },
      {
        value: "西城区",
        label: "西城区",
      },
      {
        value: "昌平区",
        label: "昌平区",
      },
      {
        value: "房山区",
        label: "房山区",
      },
    ],
  },
  {
    value: "河北省",
    label: "河北省",
    children: [
      {
        value: "石家庄市",
        label: "石家庄市",
      },
      {
        value: "唐山市",
        label: "唐山市",
      },
      {
        value: "秦皇岛市",
        label: "秦皇岛市",
      },
      {
        value: "邯郸市",
        label: "邯郸市",
      },
      {
        value: "保定市",
        label: "保定市",
      },
      {
        value: "张家口市",
        label: "张家口市",
      },
      {
        value: "廊坊市",
        label: "廊坊市",
      },
    ],
  },
  {
    value: "山西省",
    label: "山西省",
    children: [
      {
        value: "太原市",
        label: "太原市",
      },
      {
        value: "大同市",
        label: "大同市",
      },
      {
        value: "阳泉市",
        label: "阳泉市",
      },
      {
        value: "晋城市",
        label: "晋城市",
      },
      {
        value: "吕梁市",
        label: "吕梁市",
      },
      {
        value: "长治市",
        label: "长治市",
      },
    ],
  },
];
const rules: FormRules = {
  name: [{ required: true, message: "请输入", trigger: "blur" }],
  region: [{ required: true, message: "请输入", trigger: "blur" }],
  date: [{ required: true, message: "请输入", trigger: "blur" }],
  options: [{ required: true, message: "请输入", trigger: "blur" }],
  resource: [{ required: true, message: "请输入", trigger: "blur" }],
  rules: [{ required: true, message: "请输入", trigger: "blur" }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  date: "",
  time: "",
  carrierType: "",
  disarterInFo: "",
  location: "",
  sourceInFo: "",
  disaterMediaURL: "",
});
// 提交
const onSubmit = async () => {
  formData.set("date", form.date);
  formData.set("time", form.time);
  formData.set("carrierType", form.carrierType);
  formData.set("disasterInfo", form.disarterInFo);
  formData.set("location", form.location);
  formData.set("sourceInfo", form.sourceInFo);
  formData.set("disaterMediaURL", form.disaterMediaURL);

  try {
    const response: any = await HttpManager.testHttpPost2(formData);
    console.log("testHttpPost 响应", response);
    if (response["status"]) {
      ElMessage.success("提交成功！");
    }
  } catch (error) {
    console.error("testHttpPost 错误", error);
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

.line{
    text-align: center;
    line-height: 40px;
    font-size: 20px;
    color: #1f2f3d;
}

.container {
  position: relative;
  left: 50%;
  width: 60%;
  transform: translate(-50%, 0);
}

.upload-demo {
  width: 300px;
}
</style>
