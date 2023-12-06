<template>
  <div class="collect-container" v-if="!props.isEmpty">
    <div
      class="picture-box"
      v-infinite-scroll="load"
      infinite-scroll-distance="1"
      :infinite-scroll-disabled="isInfinite"
      ref="myBox"
    >
      <div class="img" v-for="item in articleStore.Articles" :key="item.id">
        <img :src="item.img" alt="" class="header" @click="toArtDetail(item)" />
        <div class="center">
          <h4>{{ item.title }}</h4>
          <div class="eye">
            <span style="color: #555555; font-size: 12px">999</span>
            <el-icon size="14" color="#555555"><View></View></el-icon>
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
                @click="handleAccess(item.userId)"
              />
            </template>
          </Popover>
          <span>{{ item.username }}</span>
        </div>
      </div>
    </div>
  </div>
  <el-empty description="什么东西都没有~快去发布吧！" v-else>
    <a
      class="toHome"
      @click="
        () => {
          $router.push('/add');
        }
      "
      >去逛逛</a
    >
  </el-empty>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useCounterStore } from "@/stores/user";
import { useArticleStore } from "@/stores/article";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import Popover from "@/components/Popover/Popover.vue";
import { reqArticleNewPage } from "@/api/acticle";

const router = useRouter();
const route = useRoute();
const userStore = useCounterStore();
const myBox = ref();
const articleStore = useArticleStore();
// 设置当前页面页码与尺寸
const pageNum = ref(1);
const pageSize = ref(12);
// 是否禁用无限滚动
const isInfinite = ref(false);
// 是否开启空状态显示
let props = defineProps({
  isEmpty: {
    type: Boolean,
    default: false,
  },
});
const isEmpty = ref(false);
// 获取所有文章列表
const load = async () => {
  if (articleStore.Articles.length >= articleStore.total) {
    return;
  }
  await articleStore.getPageArticle(pageNum.value, pageSize.value);
  pageNum.value++;
};
onMounted(async () => {
  if (route.path.includes("home")) {
    console.log(props.isEmpty);
    console.log(articleStore.Articles.length, articleStore.total);
    articleStore.Articles = [];
    articleStore.total = 1;
    await articleStore.getPageArticle(pageNum.value, pageSize.value);
    pageNum.value++;
    console.log(articleStore.Articles);
    return;
  }
  if (route.path.includes("mypage")) {
    articleStore.Articles = [];
    isEmpty.value = true;
    isInfinite.value = true;
  }
});
const toArtDetail = (article: any) => {
  articleStore.articleCurrent = JSON.parse(JSON.stringify(article));
  router.push(`/detail/${article.id}`);
};
const view = ref<number>(123);
const handleAccess = (userId) => {
  router.push("/mypage/" + userId);
};
onBeforeUnmount(() => {
  articleStore.Articles = [];
});
</script>

<style lang="scss" scoped>
.collect-container {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  width: 100%;

  background-color: rgb(246, 246, 246);
  display: flex;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC",
    "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", 微软雅黑, STHeiti,
    "WenQuanYi Micro Hei", SimSun, sans-serif, HYWenHei-GEW !important;
  .picture-box {
    min-height: 600px;
    display: flex;
    flex-wrap: wrap;
    width: 1450px;
    margin: 0 auto;
    .img {
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      width: 280px;
      margin-right: 10px;
      padding-bottom: 20px;
      height: 270px;
      margin-bottom: 20px;
      background-color: #ffffff;
      &:hover {
        cursor: pointer;
      }
      .header {
        border-radius: 10px;
        height: 80%;
        width: 100%;
      }
      .center {
        width: 100%;
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        padding: 0 2px;
        padding-left: 8px;
        .eye {
          padding-right: 10px;
          display: flex;
          flex-direction: row;
          width: 26px;
          align-items: center;
          justify-content: center;
          span {
            display: block;
            height: 12px;
            width: 22px;
            margin-right: 2px;
          }
        }
        h4 {
          color: black;
          font-size: 16px;
          width: 80%;
          margin-bottom: 5px;
          font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
            "HanHei SC", "Helvetica Neue", "Open Sans", Arial,
            "Hiragino Sans GB", 微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun,
            sans-serif, HYWenHei-GEW !important;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-overflow: ellipsis;
          &:hover {
            cursor: pointer;
            color: orange;
          }
        }
        p {
          color: rgb(187, 187, 187);
          font-size: 12px;
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
        margin-top: 5px;
        display: flex;
        align-items: center;
        height: 20px;
        padding-left: 8px;
        padding-top: 10px;
        padding-bottom: 10px;
        border-bottom-left-radius: 4px;
        border-bottom-right-radius: 4px;
        span {
          margin-left: 2px;
          color: rgb(85, 85, 85);
          font-size: 13px;
          &:hover {
            cursor: pointer;
            color: orange;
          }
        }
      }
    }
  }
}
</style>
