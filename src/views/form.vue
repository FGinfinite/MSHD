<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="formRef" :model="form" label-width="80px">
        <el-form-item label="编码" prop="name">
          <el-input v-model="form.disasterId"></el-input>
        </el-form-item>
        <el-form-item label="灾情说明" prop="desc">
          <el-input
            type="textarea"
            rows="5"
            v-model="form.disasterInfo"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="onsubmit()">表单提交</el-button>
          <el-button @click="onReset(formRef)">重置表单</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="baseform">
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { HttpManager } from "../api";
const rules: FormRules = {
  name: [{ required: true, message: "请输入灾情一体化编码", trigger: "blur" }],
  desc: [{ required: true, message: "请输入灾情说明" }],
};
const formRef = ref<FormInstance>();
const form = reactive({
  disasterId: "",
  disasterInfo: "",
  carrierType: "文本",
});
//编码提交

const onsubmit = async () => {
  const formData = new FormData();
  formData.set("disasterCode", form.disasterId);
  formData.set("disasterInfo", form.disasterInfo);
  formData.set("carrierType", form.carrierType);

  try {
    // 调用 testHttpPost 函数，根据需要换成其他函数
    const response: any = await HttpManager.testHttpPost1(formData);
    console.log("testHttpPost 响应", response);
    // 处理响应数据
    if (response["status"]) {
      ElMessage.success("提交成功！");
    }
    // ...
  } catch (error) {
    ElMessage.error("上传失败，请检查输入格式");
    console.error("testHttpPost 错误", error);
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
.container {
  position: relative;
  left: 50%;
  width: 60%;
  transform: translate(-50%, 0);
}
.form-box {
  position: relative;
  left: 0%;
}
</style>
