<template>
  <div class="information">
    <el-card v-if="scene == 0">
      <div class="upload-box">
        <!-- <el-upload
          class="avatar-uploader"
          action="/api/file/upload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :on-change="handleAvatarChange"
          :on-remove="handleRemove"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
        </el-upload> -->
        <Cropper
          @img="handleImg"
          :fixedNumbers="[1, 1]"
          :cWidth="140"
          :cHeight="140"
          :borderRadius="true"
          :imgShow="true"
          :previewViewer="imageUrl"
        ></Cropper>
      </div>

      <el-form label-width="75" style="margin-top: 30px">
        <el-form-item label="用户名">
          <el-input v-model="userStore.personalInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-input v-model="userStore.personalInfo.gender"></el-input>
        </el-form-item>
        <el-form-item label="签名">
          <el-input v-model="userStore.personalInfo.sign"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="userStore.personalInfo.phone"></el-input>
        </el-form-item>
        <el-form-item label="家乡">
          <el-input v-model="userStore.personalInfo.hometown"></el-input>
        </el-form-item>
        <el-form-item label="现居">
          <el-input v-model="userStore.personalInfo.home"></el-input>
        </el-form-item>
        <el-form-item label="职业">
          <el-input v-model="userStore.personalInfo.vocation"></el-input>
        </el-form-item>
        <el-form-item label="简介">
          <el-input v-model="userStore.personalInfo.resume"></el-input>
        </el-form-item>
        <el-form-item>
          <button @click="clickOk" class="confirm">确定</button>
          <button @click="clickCanel" class="cancel">取消</button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card v-if="scene == 1">
      <el-form label-width="75">
        <el-form-item label="用户名">
          <span>{{ userStore.personalInfo.username }}</span>
        </el-form-item>
        <el-form-item label="性别">
          <span>{{ userStore.personalInfo.gender }}</span>
        </el-form-item>
        <el-form-item label="签名">
          <span>{{ userStore.personalInfo.sign }}</span>
        </el-form-item>
        <el-form-item label="联系方式">
          <span>{{ userStore.personalInfo.phone }}</span>
        </el-form-item>
        <el-form-item label="家乡">
          <span>{{ userStore.personalInfo.hometown }}</span>
        </el-form-item>
        <el-form-item label="现居">
          <span>{{ userStore.personalInfo.home }}</span>
        </el-form-item>
        <el-form-item label="职业">
          <span>{{ userStore.personalInfo.vocation }}</span>
        </el-form-item>
        <el-form-item label="简介">
          <span>{{ userStore.personalInfo.resume }}</span>
        </el-form-item>
      </el-form>
      <el-form-item>
        <button
          @click="updatePersonalInfo"
          class="update"
          v-if="upadateConfirm"
        >
          修改
        </button>
      </el-form-item>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, nextTick } from "vue";
import { reqUserInfo, reqUpdateUserInfo } from "@/api/user/index";
import { useRoute } from "vue-router";
import { useCounterStore } from "@/stores/user";
import { ElMessage } from "element-plus";
import Cropper from "@/components/Cropper/Cropper.vue";
const userStore = useCounterStore();
// 控制修改用户
const upadateConfirm = ref(true);
const route = useRoute();
// 控制编辑模式与查看模式
const scene = ref(1);
// 上传头像
import type { UploadProps } from "element-plus";
const imgList = ref<any>([]);
const imageUrl = ref("");

const handleImg = (data) => {
  console.log(data);
  imageUrl.value = data;
};

onMounted(async () => {
  let userId = parseInt(route.params.userid);
  if (userId == userStore.userId) {
    upadateConfirm.value = true;
  } else {
    upadateConfirm.value = false;
  }
  imageUrl.value = userStore.personalInfo.avatarUrl;
});

const updatePersonalInfo = () => {
  scene.value = 0;
  imageUrl.value = userStore.personalInfo.avatarUrl;
};
const clickCanel = () => {
  scene.value = 1;
};
const clickOk = async () => {
  scene.value = 1;
  userStore.personalInfo.avatarUrl = imageUrl.value;
  let res = await reqUpdateUserInfo(userStore.personalInfo);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "修改成功",
    });
    imageUrl.value = userStore.personalInfo.avatarUrl;
    userStore.avatar = userStore.personalInfo.avatarUrl;
    userStore.username = userStore.personalInfo.username;
  } else {
    ElMessage({
      type: "error",
      message: "修改失败",
    });
  }
};
</script>
<style lang="scss" scoped>
// 上传头像样式
.avatar-uploader .avatar {
  width: 100px;
  height: 100px;
  display: block;
  border-radius: 100px;
}
.upload-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.update {
  padding: 10px 30px;
  background-color: yellow;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: orange;
  }
}
.confirm {
  padding: 10px 30px;
  background-color: yellow;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: orange;
  }
}
.cancel {
  padding: 10px 30px;
  margin-left: 10px;
  background-color: #fff;
  border: none;
  &:hover {
    cursor: pointer;
    background-color: orange;
  }
}
</style>
<style lang="scss">
.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
  &:hover::before {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    z-index: 1000;
    text-align: center;
    vertical-align: middle;
    content: "上传头像";
    color: #fff;
    font-size: 12px;
    width: 100px;
    height: 100px;
    border-radius: 100px;
    background-color: rgba(0, 0, 0, 0.5);
  }
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
