<template>
  <div class="collect-container" v-if="!isEmpty">
    <div class="picture-box">
      <div class="img" v-for="item in colllectList">
        <img
          :src="item.img"
          alt=""
          class="header"
          @click="() => $router.push('/detail/' + item.id)"
        />
        <div class="center">
          <h4 @click="() => $router.push('/detail/' + item.id)">
            {{ item.title }}
          </h4>
          <p>插画</p>
          <div class="icon">
            <div>
              <el-icon style="margin-right: 5px; font-size: 18px"
                ><Star /></el-icon
              ><span>1</span>
            </div>
            <div>
              <el-icon style="margin-right: 5px; font-size: 18px"
                ><ChatLineRound /></el-icon
              ><span>1</span>
            </div>
            <div>
              <el-icon style="margin-right: 5px; font-size: 18px"
                ><ChatLineRound /></el-icon
              ><span>1</span>
            </div>
          </div>
        </div>
        <div class="footer">
          <Popover class="personal-info" placement="top">
            <template #content>
              <div class="personal-info">
                <div class="top">
                  <div class="left">
                    <div class="avatar">
                      <img
                        :src="item.avatarUrl"
                        alt=""
                        class=".avatar"
                        @click="() => $router.push(`/mypage/${item.userId}`)"
                      />
                    </div>
                    <div class="detail">
                      <div class="title">
                        <h4
                          @click="() => $router.push(`/mypage/${item.userId}`)"
                        >
                          {{ item.username }}
                        </h4>
                      </div>
                      <div class="person"><span>湖南 设计师</span></div>
                    </div>
                  </div>
                  <div class="right">
                    <a href="#">关注</a>
                  </div>
                </div>
              </div>
            </template>
            <template #hover>
              <img
                :src="item.avatarUrl"
                alt=""
                class=".avatar"
                style="width: 25px; height: 25px; border-radius: 25px"
              />
            </template>
          </Popover>

          <span>{{ item.username }}</span>
        </div>
      </div>
    </div>
  </div>
  <el-empty v-else description="什么东西都没有~快去收藏吧！">
    <a class="toHome" @click="toHome">去逛逛</a>
  </el-empty>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { reqCollectAllList } from "@/api/acticle/index";
import { useRoute, useRouter } from "vue-router";
import router from "@/router";
import Popover from "@/components/Popover/Popover.vue";
const route = useRoute();
const routr = useRouter();
// 定义封装的卡片宽高
const props = defineProps({
  cWdith: {
    type: String,
    default: "280",
  },
  HWdith: {
    type: String,
    default: "280",
  },
});
// 是否跳转至推荐页面
const isRecommend = ref(false);
const emits = defineEmits(["toRecommend"]);
// 接收收藏列表
const colllectList = ref([]);
// 控制空状态
const isEmpty = ref(false);
onMounted(async () => {
  console.log(1);
  let res = await reqCollectAllList();
  if (res.code == 200) {
    colllectList.value = res.data;
    console.log(colllectList.value);
    if (colllectList.value.length == 0) {
      isEmpty.value = true;
    }
  } else {
    return Promise.reject("失败");
  }
});
const toHome = () => {
  // 判断当前是否处于首页
  if (route.path.includes("home")) {
    isRecommend.value = true;
    emits("toRecommend", isRecommend.value);
  } else {
    router.push("/home");
  }
};
</script>
<style lang="scss" scoped>
.toHome {
  display: block;
  border: none;
  font-size: 14px;
  background-color: yellow;
  padding: 13px 35px;
  &:hover {
    cursor: pointer;
    background-color: orange;
  }
}
.collect-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;
  background-color: rgba(246, 246, 246, $alpha: 1);
  display: flex;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC",
    "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", 微软雅黑, STHeiti,
    "WenQuanYi Micro Hei", SimSun, sans-serif, HYWenHei-GEW !important;
  .picture-box {
    display: flex;
    flex-wrap: wrap;
    width: 1450px;
    margin: 0 auto;
    .img {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 280px;
      margin-right: 20px;
      height: 380px;
      margin-bottom: 10px;
      background-color: #ffffff;
      box-sizing: border-box;
      &:hover {
        cursor: pointer;
        box-shadow: 2px;
      }
      .header {
        height: 60%;
        width: 100%;
      }
      .center {
        width: 100%;
        margin-top: 10px;
        display: flex;
        margin-bottom: 15px;
        flex-direction: column;
        padding: 0 10px;
        h4 {
          width: 80%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: black;
          font-size: 1em;
          margin-bottom: 5px;
          font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
            "HanHei SC", "Helvetica Neue", "Open Sans", Arial,
            "Hiragino Sans GB", 微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun,
            sans-serif, HYWenHei-GEW !important;
          white-space: nowrap;
          text-overflow: ellipsis;
          &:hover {
            color: orange;
            cursor: pointer;
          }
        }
        p {
          color: rgb(187, 187, 187);
          font-size: 0.8em;
          margin-bottom: 5px;
          font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
            "HanHei SC", "Helvetica Neue", "Open Sans", Arial,
            "Hiragino Sans GB", 微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun,
            sans-serif, HYWenHei-GEW !important;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .icon {
          width: 100%;
          display: flex;
          justify-content: flex-start;
          align-items: center;
          div {
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: nowrap;
          }
          margin-top: 15px;
          span {
            display: flex;
            align-items: center;
            height: 18px;
            color: rgb(187, 187, 187);
            font-size: 12px;
            margin-right: 12px;
          }
          .el-icon {
            color: rgb(187, 187, 187);
          }
        }
      }
      .footer {
        display: flex;
        align-items: center;
        padding: 17px 10px;
        border-top: 1px solid rgb(238, 238, 238);
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        span {
          &:hover {
            cursor: pointer;
            color: orange;
          }
          margin-left: 0.8em;
          color: black;
          font-size: 13px;
        }
      }
    }
  }
}
</style>
