<template>
  <div class="mypage-container" style="overflow-y: scroll">
    <div class="personal-bg">
      <div class="bg">
        <img src="../../../public//images/mypage-bg.jpg" alt="" />
      </div>
      <div class="userInfo">
        <div class="userinfo-box">
          <div class="left">
            <div class="avatar">
              <PopInfo :item="userStore.personalInfo">
                <template #hover>
                  <img :src="userStore.personalInfo.avatarUrl" alt="" />
                </template>
              </PopInfo>
            </div>
            <div class="detail">
              <div class="info">
                <h4>{{ userStore.personalInfo.username }}</h4>
                <span
                  >{{ userStore.personalInfo.home }}
                  {{ userStore.personalInfo.vocation }}</span
                >
                <p style="color: rgb(67, 67, 67)">
                  {{ userStore.personalInfo.sign }}
                </p>
              </div>
              <div class="count">
                <p>
                  粉丝<span>{{ fans }}</span>
                </p>
                <p>
                  点赞<span>{{ hits }}</span>
                </p>
                <p>
                  收藏<span>{{ collects }}</span>
                </p>
              </div>
            </div>
          </div>
          <div class="right">
            <a href="#">上传作品</a>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="left">
        <div class="title">
          <h4>最近访客</h4>
        </div>
        <div class="access-detail" v-if="visitor.length > 0">
          <template v-for="(item, index) in visitor" :key="item">
            <div class="access-box" v-if="index <= 2">
              <div class="avatar">
                <img :src="item.avatarUrl" alt="" />
              </div>
              <div class="username">
                <p>{{ item.username }}</p>
              </div>

              <div class="access-time">
                <p>{{ getTime(item.browseTime) }}</p>
              </div>
            </div>
          </template>
        </div>
        <div class="empty" v-else style="width: ">
          <el-empty
            description="还没有人来访问喔~"
            style="background-color: #fff; height: 200px"
          >
          </el-empty>
        </div>
      </div>
      <div class="right">
        <div class="top-nav" @click="handleClick($event)" ref="mydiv">
          <li class="top-nav-li">
            <a href="javscript:0" data-name="Recommend">创作</a>
          </li>
          <li>
            <a href="javscript:0" data-name="information">资料</a>
          </li>
          <li>
            <a
              href="javscript:0"
              data-name="Collection"
              v-if="userStore.username == userStore.personalInfo.username"
              >收藏</a
            >
          </li>
          <li v-if="isMe">
            <a href="javscript:0" data-name="Concerner">关注</a>
          </li>

          <li style="width: 115px">
            <a
              href="javscript:0"
              data-name="MyReserve"
              v-if="userStore.username == userStore.personalInfo.username"
              >我的预约</a
            >
          </li>
          <li style="width: 115px">
            <a
              href="javscript:0"
              data-name="MyOrders"
              v-if="
                (userStore.role == 'ROLE_DESIGNER' ||
                  userStore.role == 'ROLE_ADMIN') &&
                userStore.username == userStore.personalInfo.username
              "
              >我的订单</a
            >
          </li>
        </div>
        <Transition>
          <keep-alive>
            <component :is="component" :isEmpty="isEmpty"></component>
          </keep-alive>
        </Transition>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { nextTick, ref, onMounted, shallowRef } from "vue";
import PopInfo from "@/components/PopInfo/Popinfo.vue";
import Collection from "../Home/components/Collection.vue";
import information from "@/views/MyPage/components/Information/Information.vue";
import MyOrders from "@/views/MyPage/components/MyOrders/MyOrders.vue";
import MyReserve from "@/views/MyPage/components/MyReserve/MyReserve.vue";
import Recommend from "../Home/components/Recommend.vue";
import { getTime } from "@/util/getTime.ts";
import { reqVistor, reqPostVistor } from "@/api/user/index";
import { reqUserStatic } from "@/api/acticle/index";
import { useCounterStore } from "@/stores/user";
import { useArticleStore } from "@/stores/article";
import Concerner from "@/views/MyPage/components/Concerner/Concerner.vue";
const articleStore = useArticleStore();
const isEmpty = ref(true);
import { useRoute } from "vue-router";
import { fsync } from "fs";
const userStore = useCounterStore();
const route = useRoute();
const visitor = ref([]);
const mydiv = ref();
const isMe = ref(false);
// 点赞 粉丝 收藏
const hits = ref(0);
const fans = ref(0);
const collects = ref(0);
let components: any = {
  Recommend,
  Collection,
  information,
  Concerner,
  MyOrders,
  MyReserve,
};
let component = shallowRef(Recommend);
const handleClick = (event: MouseEvent | any) => {
  if (event.target.tagName == "A") {
    let old = document.querySelector(".top-nav-li");
    if (old) {
      old.classList.remove("top-nav-li");
      old.children[0].style.color = "#999999";
    }
    nextTick(() => {
      event.target.parentNode.classList.add("top-nav-li");
      component.value = components[event.target.dataset.name];
      event.target.style.color = "black";
    });
  }
};

onMounted(async () => {
  isEmpty.value = true;
  if (userStore.userId == parseInt(route.params.userid)) {
    isMe.value = true;
  }
  // 移除样式
  let old = document.querySelector(".top-nav-li");
  if (old) {
    old.classList.remove("top-nav-li");
    old.children[0].style.color = "#999999";
  }
  mydiv.value.firstChild.classList.add("top-nav-li");
  mydiv.value.firstChild.firstChild.style.color = "black";
  let userId = parseInt(route.params.userid);
  // 获取访客信息
  let res = await reqVistor(userId);
  if (res.code == 200) {
    // visitor.value = res.data;
    // 去除重复的访客信息
    if (res.data.length > 0) {
      visitor.value = res.data.reduce((prev, item) => {
        if (!prev.find((obj) => obj.username == item.username)) {
          prev.push(item);
        }
        return prev;
      }, []);
    } else {
      visitor.value = [];
      console.log("vistor", visitor.value);
    }
  }

  // 获取用户基本资料
  await userStore.getUserInfoById(userId);
  if (userId !== userStore.userId) {
    await reqPostVistor(userId);
  }
  // 获取用户已上传的作品列表包括点赞收藏
  let res2 = await reqUserStatic(route.params.userid);
  if (res2.code == 200) {
    isEmpty.value = false;

    articleStore.Articles = res2.data.articleList;
    if (articleStore.Articles.length <= 0) isEmpty.value = true;
    hits.value = res2.data.hits;
    fans.value = res2.data.fans;
    collects.value = res2.data.collects;
    articleStore.Articles.map((item) => {
      item.avatarUrl = res2.data.avatarUrl;
      item.username = res2.data.username;
    });
  } else {
    console.log("Error");
  }
});
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
.mypage-container {
  display: flex;
  flex-direction: column;
  width: 100vw;

  justify-content: center;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(244, 244, 244);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif !important;
  .personal-bg {
    width: 100%;
    height: 500px;
    .bg {
      width: 100%;
      height: 60%;
      overflow: hidden;
    }
    .userInfo {
      width: 100%;
      height: 40%;
      background-color: #fff;
      .userinfo-box {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 80%;
        height: 100%;
        margin: 0 auto;
        justify-content: space-between;
        .left {
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 40%;
        }
        .avatar {
          margin-right: 10px;

          img {
            width: 140px;
            height: 140px;
            border-radius: 140px;
          }
        }

        .detail {
          display: flex;
          height: 115px;
          max-height: 200px;
          flex-direction: column;
          justify-content: space-between;
          .info {
            flex: 0.8;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            h4 {
              font-size: 30px;
              font-weight: 400;
              margin-bottom: 10px;
            }

            span {
              color: rgb(143, 137, 137);
              font-size: 12px;

              margin-bottom: 5px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            p {
              color: rgb(143, 137, 137);
              font-size: 14px;

              margin-bottom: 5px;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }

          .count {
            flex: 0.2;
            display: flex;
            width: 100%;
            align-items: center;

            p {
              display: flex;
              height: 18px;
              align-items: center;
              color: rgb(150, 145, 145);
              font-size: 14px;
              margin-bottom: 5px;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-right: 20px;
              span {
                display: flex;
                height: px;
                color: rgb(29, 29, 29);
                font-size: 24px;
                align-items: center;
                font-weight: 500;
                margin-bottom: 5px;
                white-space: nowrap;
                text-overflow: ellipsis;
                margin-left: 4px;
              }
            }
          }
        }
        .right {
          a {
            display: block;
            border: none;
            padding: 20px 40px;
            background-color: yellow;
            &:hover {
              background-color: orange;
            }
          }
        }
      }
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    width: 90%;
    padding: 0 20px;
    margin: 0 auto;
    .left {
      display: flex;
      margin-top: 20px;
      flex-direction: column;
      justify-content: center;
      align-content: flex-start;
      height: fit-content;
      border-radius: 5px;
      width: 300px;
      padding-top: 20px;
      padding-left: 20px;
      padding-bottom: 20px;
      margin-left: 15px;
      background-color: rgb(255, 255, 255);
      .title {
        margin-bottom: 22px;
        h4 {
          color: black;
          font-weight: 600;
          font-size: 14px;
        }
      }
      .access-detail {
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: wrap;
        .access-box {
          width: 25%;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-wrap: wrap;
          justify-content: flex-start;
          margin-right: 10px;
        }
        .access-box:last-child {
          margin-right: 0;
        }
        .avatar {
          width: 54px;
          margin-bottom: 3px;
          img {
            width: 54px;
            height: 54px;
            border-radius: 54px;
          }
        }
        .username {
          width: 54px;
          display: flex;
          justify-content: center;
          overflow: hidden;
          text-overflow: ellipsis;
          p {
            justify-content: center;
            color: rgb(0, 0, 0);
            font-size: 12px;
            margin-bottom: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .access-time {
          width: 54px;
          height: fit-content;
          display: flex;
          justify-content: center;
          overflow: hidden;
          text-overflow: ellipsis;
          p {
            justify-content: center;
            color: rgb(150, 145, 145);
            font-size: 12px;
            margin-bottom: 5px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .right {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      display: flex;
      width: 70%;
      .top-nav {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 65px;
        width: 100%;
        background-color: #fff;
        margin-bottom: 20px;
        .top-nav-li {
          border-bottom: 1px solid black;
        }

        li {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 80px;
          height: 65px;
          a {
            display: block;
            padding: 23px 23px;
            color: #999999;
            letter-spacing: 2px;
          }

          &:hover {
            a {
              padding: 23px 23px;
              color: black;
            }
          }
        }
      }
      .comment-box {
        display: flex;
        flex-direction: column;
        width: 100%;
      }
    }
  }
}
</style>
