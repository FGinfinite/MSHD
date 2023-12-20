<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>基础信息</span>
            </div>
          </template>
          <div class="info">
            <div class="info-image" @click="showDialog">
              <el-avatar :size="100" :src="avatarImg" />
              <span class="info-edit">
                <i class="el-icon-lx-camerafill"></i>
              </span>
            </div>
            <div class="info-name">{{ name }}</div>
            <div class="info-desc">{{ quote }}</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover">
          <template #header>
            <div class="clearfix">
              <span>账户编辑</span>
            </div>
          </template>
          <el-form label-width="90px">
            <el-form-item label="用户名："> {{ name }} </el-form-item>
            <el-form-item label="旧密码：">
              <el-input type="password" v-model="form.old" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item label="新密码：">
              <el-input type="password" v-model="form.new" placeholder="请输入新密码"></el-input>
            </el-form-item>
            <el-form-item label="个人简介：">
              <el-input v-model="form.desc"></el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item>
                  <el-button type="primary" @click="onSubmit">保存</el-button>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <el-button type="danger" @click="logoff">注销</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    <el-dialog title="裁剪图片" v-model="dialogVisible" width="600px">
      <vue-cropper ref="cropper" :src="imgSrc" :ready="cropImage" :zoom="cropImage" :cropmove="cropImage"
        style="width: 100%; height: 400px"></vue-cropper>

      <template #footer>
        <span class="dialog-footer">
          <el-button class="crop-demo-btn" type="primary">选择图片
            <input class="crop-input" type="file" name="image" accept="image/*" @change="setImage" />
          </el-button>
          <el-button type="primary" @click="saveAvatar">上传并保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="user">
import { onMounted, reactive, ref } from "vue";
import VueCropper from "vue-cropperjs";
import "cropperjs/dist/cropper.css";
import avatar from "../assets/img/img.jpg";
import { HttpManager } from "../api";
import { ElMessage, ElMessageBox } from "element-plus";
import { useRouter } from "vue-router";

const name = localStorage.getItem("ms_username");
const quote = ref("I love MSHD.");
const form = reactive({
  name: localStorage.getItem("ms_username") || "",
  old: "",
  new: "",
  desc: "",
});
const router = useRouter();

onMounted(() => {
  quote.value = localStorage.getItem("ms_quote") || "";
  form.desc = quote.value;
  if (quote.value == "") {
    quote.value = "I love MSHD.";
    localStorage.setItem("ms_quote", quote.value);
  }
});

async function fetchChangePasswordStatus() {
  try {
    const formdata = new FormData();
    formdata.append("username", form.name);
    formdata.append("old_password", form.old);
    formdata.append("new_password", form.new);
    const response: any = await HttpManager.tryChangePassword(formdata);
    if (response && response.status) {
      return response.status;
    }
  } catch (e) {
    console.log(e);
  }
}

const onSubmit = async () => { // Make this an async function
  let passwordchangeflag = false;
  let descchangeflag = false;

  // Reset flags at the beginning
  passwordchangeflag = false;
  descchangeflag = false;

  if (form.old != "" || form.new != "") {
    if (form.old == "") {
      ElMessage.error("请输入旧密码");
    } else if (form.new == "") {
      ElMessage.error("请输入新密码");
    } else {
      const status = await fetchChangePasswordStatus(); // Await the async function
      if (status == "success") {
        passwordchangeflag = true;
      } else {
        ElMessage.error("旧密码验证错误，密码修改失败");
        return; // Early return if there's an error
      }
    }
  }
  
  if (form.desc != quote.value) {
    quote.value = form.desc;
    localStorage.setItem("ms_quote", quote.value);
    descchangeflag = true;
  }

  // Only show success if a change occurred
  if (passwordchangeflag || descchangeflag) {
    ElMessage.success("修改成功");
  }
};

async function fetchLogoffStatus() {
  try {
    const formdata = new FormData();
    formdata.append("username", form.name);
    const response: any = await HttpManager.tryLogoff(formdata);
    if (response && response.status) {
      return response.status;
    }
  } catch (e) {
    console.log(e);
  }
}

const logoff = () => {
  ElMessageBox.confirm("此操作将永久注销该账户, 是否继续?", "警告", {
    confirmButtonText: "确认",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      fetchLogoffStatus().then((status) => {
        if (status == "success") {
          ElMessage.success("注销成功");
          localStorage.removeItem("ms_username");
          localStorage.removeItem("ms_quote");
          localStorage.removeItem("ms_keys");
          router.push("/login");
        } else {
          ElMessage.error("注销失败");
        }
      });
    })
    .catch(() => {
      ElMessage.info("已取消注销");
    });
};

const avatarImg = ref(avatar);
const imgSrc = ref("");
const cropImg = ref("");
const dialogVisible = ref(false);
const cropper: any = ref();

const showDialog = () => {
  dialogVisible.value = true;
  imgSrc.value = avatarImg.value;
};

const setImage = (e: any) => {
  const file = e.target.files[0];
  if (!file.type.includes("image/")) {
    return;
  }
  const reader = new FileReader();
  reader.onload = (event: any) => {
    dialogVisible.value = true;
    imgSrc.value = event.target.result;
    cropper.value && cropper.value.replace(event.target.result);
  };
  reader.readAsDataURL(file);
};

const cropImage = () => {
  cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
};

const saveAvatar = () => {
  avatarImg.value = cropImg.value;
  dialogVisible.value = false;
};
</script>

<style scoped>
.info {
  text-align: center;
  padding: 35px 0;
}

.info-image {
  position: relative;
  margin: auto;
  width: 100px;
  height: 100px;
  background: #f8f8f8;
  border: 1px solid #eee;
  border-radius: 50px;
  overflow: hidden;
}

.info-edit {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-edit i {
  color: #eee;
  font-size: 25px;
}

.info-image:hover .info-edit {
  opacity: 1;
}

.info-name {
  margin: 15px 0 10px;
  font-size: 24px;
  font-weight: 500;
  color: #262626;
}

.crop-demo-btn {
  position: relative;
}

.crop-input {
  position: absolute;
  width: 100px;
  height: 40px;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
</style>
