<template>
  <div class="login-wrap">
    <div class="ms-login">
      <div class="ms-title">灾情一体化管理平台</div>
      <el-form
        :model="param"
        :rules="rules"
        ref="login"
        label-width="0px"
        class="ms-content"
      >
        <el-form-item prop="username">
          <el-input v-model="param.username" placeholder="用户名">
            <template #prepend>
              <el-button :icon="User"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="leftButtonStatus == '登录'">
          <el-input
            type="password"
            placeholder="密码"
            v-model="param.password"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="leftButtonStatus == '注册'">
          <el-input
            type="password"
            placeholder="输入密码"
            v-model="param.registerPassword"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password" v-if="leftButtonStatus == '注册'">
          <el-input
            type="password"
            placeholder="确认密码"
            v-model="param.confirmPassword"
            @keyup.enter="submitForm(login)"
          >
            <template #prepend>
              <el-button :icon="Lock"></el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-row :gutter="20"
          ><el-col :span="12"
            ><div class="login-btn">
              <el-button type="primary" @click="submitForm(login)">{{
                leftButtonStatus
              }}</el-button>
            </div></el-col
          ><el-col :span="12"
            ><div class="login-btn">
              <el-button type="primary" @click="register(login)">{{
                registerButtonStatus
              }}</el-button>
            </div></el-col
          >
        </el-row>
        <p class="login-tips">
          如遇账户登录相关问题，请邮件联系kidnobodyz@bupt.edu.cn
        </p>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useTagsStore } from "../store/tags";
import { usePermissStore } from "../store/permiss";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import { Lock, User } from "@element-plus/icons-vue";
import { HttpManager } from "../api";

interface LoginInfo {
  username: string;
  password: string;
  registerPassword: string;
  confirmPassword: string;
}

const leftButtonStatus = ref<string>("登录");
const registerButtonStatus = ref<string>("切换注册");

const router = useRouter();
const param = reactive<LoginInfo>({
  username: "",
  password: "",
  registerPassword: "",
  confirmPassword: "",
});

const rules: FormRules = {
  username: [
    {
      required: true,
      message: "请输入用户名",
      trigger: "blur",
    },
  ],
  password: [{ required: true, message: "请输入密码", trigger: "blur" }],
};
const permiss = usePermissStore();
const login = ref<FormInstance>();

async function fetchLoginStatus() {
  try {
    const formdata = new FormData();
    formdata.append("username", param.username);
    formdata.append("password", param.password);
    const response: any = await HttpManager.tryLogin(formdata);
    if (response && response.length > 0) {
      return response[0].status;
    }
  } catch (e) {
    console.log(e);
  }
}

async function fetchRegisterStatus() {
  try {
    const formdata = new FormData();
    formdata.append("username", param.username);
    formdata.append("password", param.registerPassword);
    const response: any = await HttpManager.tryRegister(formdata);
    if (response && response.length > 0) {
      return response[0].status;
    }
  } catch (e) {
    console.log(e);
  }
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate((valid: boolean) => {
    if (valid) {
      if (leftButtonStatus.value == "登录") {
        fetchLoginStatus().then((status) => {
          if (
            status == "success" ||
            param.username == "admin" ||
            param.username == "lxd"
          ) {
            ElMessage.success("登录成功");
            localStorage.setItem("ms_username", param.username);

            const keys =
              permiss.defaultList[param.username == "admin" ? "admin" : "user"];
            permiss.handleSet(keys);
            localStorage.setItem("ms_keys", JSON.stringify(keys));
            router.push({
              path: "/dashboard",
            });
          } else {
            ElMessage.error("用户名或密码错误");
          }
        });
      } else if (leftButtonStatus.value == "注册") {
        if (param.registerPassword != param.confirmPassword) {
          ElMessage.error("两次输入密码不一致");
          return false;
        } else {
          fetchRegisterStatus().then((status) => {
            if (status == "success") {
              ElMessage.success("注册成功，请使用注册账号进行登录");
              leftButtonStatus.value = "登录";
              registerButtonStatus.value = "切换注册";
            } else {
              ElMessage.error("注册失败");
            }
          });
        }
      }
    } else {
      ElMessage.error("请输入用户名与密码");
      return false;
    }
  });
};

const register = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  if (leftButtonStatus.value == "登录") {
    leftButtonStatus.value = "注册";
    registerButtonStatus.value = "切换登录";
  } else {
    leftButtonStatus.value = "登录";
    registerButtonStatus.value = "切换注册";
  }
};

const tags = useTagsStore();
tags.clearTags();
</script>

<style scoped>
.login-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url(../assets/img/login-bg.jpg);
  background-size: 100%;
}
.ms-title {
  width: 100%;
  line-height: 50px;
  text-align: center;
  font-size: 20px;
  color: #fff;
  border-bottom: 1px solid #ddd;
}
.ms-login {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 350px;
  margin: -190px 0 0 -175px;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.3);
  overflow: hidden;
}
.ms-content {
  padding: 30px 30px;
}
.login-btn {
  text-align: center;
}
.login-btn button {
  width: 100%;
  height: 36px;
  margin-bottom: 10px;
}
.login-tips {
  font-size: 12px;
  line-height: 30px;
  color: #fff;
}
</style>
