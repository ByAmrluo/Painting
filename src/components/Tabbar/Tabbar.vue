<template>
  <div class="tabbar-container">
    <div class="left">
      <div class="logo">
        <img src="../../../public/images/logo.png" alt="" />
      </div>
      <div class="menu-list">
        <div class="home">
          <a href="/">首页</a>
        </div>
        <div class="home">
          <a href="/Designer">设计师</a>
        </div>
        <div class="home">
          <a href="#" @click="handleCreated($event)">创作</a>
        </div>

        <div class="home">
          <a href="/appoint">约稿</a>
        </div>
      </div>
    </div>
    <div class="right">
      <div class="search">
        <input
          type="text"
          placeholder="搜索你感兴趣的内容"
          v-model="searchTitle"
        />
        <i class="search-icon" @click="search">
          <el-icon size="30px" color="#ccc"><Search /></el-icon
        ></i>
      </div>
      <el-popover
        placement="bottom"
        :width="200"
        trigger="hover"
        style="position: relative"
        :show-arrow="false"
        :popper-style="{
          textAlign: 'center',
          width: '200px',
          borderRadius: '10px',
        }"
      >
        <div class="login-after" style="padding: 20px 0">
          <ul>
            <li style="margin-bottom: 10px; font-size: 18px">
              <span
                style="
                  color: rgb(251, 184, 59);
                  font-weight: bold;
                  font-size: 18px;
                "
                >登录</span
              >后,你将享受:
            </li>
            <hr />
            <li
              style="
                margin-bottom: 20px;
                font-size: 16px;
                font-family: '微软雅黑';
              "
            >
              <el-icon size="16px"><Comment /></el-icon>说出你的想法
            </li>
            <li
              style="
                margin-bottom: 20px;
                font-size: 16px;
                font-family: '微软雅黑';
              "
            >
              <el-icon size="16px"><CircleCheckFilled /></el-icon>收获海量灵感
            </li>
            <li style="font-size: 16px; font-family: '微软雅黑'">
              <el-icon size="16px"><UploadFilled /></el-icon>发布我的作品
            </li>
          </ul>
        </div>
        <template #reference>
          <div class="loginBox" v-if="userStore.token == ''">
            <button @click="toLogin">登录</button>
          </div>
        </template>
      </el-popover>
      <div class="register" v-if="userStore.token == ''">
        <button>注册</button>
      </div>
      <div class="user-info" v-if="userStore.token">
        <el-popover
          placement="bottom"
          :width="200"
          trigger="hover"
          style="position: relative"
          :show-arrow="false"
          :popper-style="{
            width: '200px',
            height: '150px',
            borderRadius: '10px',
          }"
        >
          <el-menu
            mode="vertical"
            class="el-menu-demo"
            :collapse="false"
            :router="true"
          >
            <el-menu-item :index="mypage">我的主页</el-menu-item>
            <el-menu-item @click="handleLogout">退出登录</el-menu-item>
          </el-menu>
          <template #reference>
            <div class="avatar">
              <img
                :src="userStore.avatar"
                alt=""
                style="height: 40px; width: 40px; border-radius: 40px"
                class="avatarImg"
              />
            </div>
          </template>
        </el-popover>

        <span>{{ userStore.username }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from "@/stores/user";
import { useRouter, useRoute } from "vue-router";
import { onMounted, ref, provide } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";

// 导入用户信息仓库
// 控制登录弹出框
const myPopover = ref();
const userStore = useCounterStore();
const router = useRouter();
const route = useRoute();
const mypage = ref("/mypage/");
// 搜索关键字
const searchTitle = ref("");
onMounted(() => {
  mypage.value = mypage.value + userStore.userId;
  console.log(userStore.avatar);
});

// 跳转登录页面
const toLogin = () => {
  // 清空用户信息
  router.push("/login");
};
const search = () => {
  if (!route.path.includes("search")) {
    router.push({
      path: "/search",
      query: { searchContent: searchTitle.value },
    });
  } else {
    router.push({
      path: "/search",
      query: { searchContent: searchTitle.value },
    });
    return;
  }
  if (searchTitle.value.trim() == "") {
    ElMessage({
      type: "warning",
      message: "请输入搜索内容！",
    });
    return;
  }
};
//退出登录
const handleLogout = () => {
  userStore.resetUserInfo();
  router.push("/home");
  console.log("123");
};
// 跳转创作界面
const handleCreated = (event) => {
  event.preventDefault();
  if (
    userStore.username !== "" &&
    userStore.avatar !== "" &&
    userStore.token !== ""
  ) {
    router.push("/add");
  } else {
    ElMessageBox.alert("请先登录", "提示", {
      // if you want to disable its autofocus
      // autofocus: false,
      confirmButtonText: "确定",
    }).then((result) => {
      router.push({ path: "/login", query: { redirect: "/add" } });
    });
  }
};
</script>
<style lang="scss" scoped>
.tabbar-container {
  align-items: center;
  flex-wrap: nowrap;
  justify-content: space-between;
  height: 100%;
  width: 100vw;
  background: yellow;
  display: flex;
  .left {
    margin-right: 200px;
    display: flex;

    align-items: center;
    justify-content: center;
  }
  .login-after {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: red;
  }
  .logo {
    img {
      width: 109px;
      height: 40px;
      margin-left: 40px;
    }
  }
  .menu-list {
    margin-left: 40px;
    display: flex;
    align-content: center;
    div {
      margin-right: 60px;
      min-width: 45px;
      width: 45px;
    }
  }
  .search {
    position: relative;
    input {
      border-radius: 10px;
      font-size: 12px;
      color: rgba(117, 108, 108, 0.65);
      width: 400px;
      height: 40px;
      border: none;
      padding-left: 10px;
    }
    input::-webkit-input-placeholder {
      font-size: 12px;
      color: #999999;
    }
    input:focus {
      border: 1px solid rgba(0, 0, 0, 0.65);
    }
    .search-icon {
      position: absolute;
      top: 5px;
      right: 10px;
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    align-items: center;
    margin-right: 40px;
    flex-wrap: nowrap;
    justify-content: center;
    width: 580px;
    .loginBox {
      margin-left: 30px;
      margin-right: 30px;
      button {
        border: none;
        background-color: transparent;
        cursor: pointer;
        font-size: 14px;
        height: 30px;
        min-width: 40px;
        font-family: "Righteous";
      }
    }
    .register {
      button {
        border-radius: 5px;
        border: none;
        font-size: 12px;
        font-family: "Righteous";
        color: rgba($color: #fffdfd, $alpha: 0.85);
        font-weight: bold;
        height: 30px;
        width: 80px;
        background-color: rgba(0, 0, 0, 1);
        cursor: pointer;
      }
    }
    .user-info {
      display: flex;
      align-items: center;
      margin-left: 40px;
      .avatarImg {
        margin-right: 10px;
      }
      span {
        font-size: 18px;
      }
      .popover-box {
        width: 100px;
        height: 300px;
      }
      .persional-menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: red;
      }
    }
  }
}
</style>
