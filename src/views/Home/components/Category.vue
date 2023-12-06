<template>
  <div class="category">
    <div class="top">
      <el-dropdown>
        <span class="el-dropdown-link">
          {{ current }}
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              v-for="item in categoryList"
              :key="item.id"
              @click="select(item.id)"
              >{{ item.name }}</el-dropdown-item
            >
            <el-dropdown-item
              @click="
                () => {
                  articleStore.Articles = articleStore.catagoryArt;
                  current = '全部';
                }
              "
              >全部</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="collect-container">
      <div
        class="picture-box"
        v-infinite-scroll="load"
        infinite-scroll-distance="1"
        :infinite-scroll-disabled="isInfinite"
      >
        <div class="img" v-for="item in articleStore.Articles" :key="item.id">
          <img
            :src="item.img"
            alt=""
            class="header"
            @click="toArtDetail(item)"
          />
          <div class="center">
            <h4>{{ item.title }}</h4>
            <div class="eye" style="margin-right: 3px">
              <span style="color: #555555; font-size: 12px; margin-right: 3px"
                >999</span
              >
              <svg
                t="1700834467310"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="4039"
                width="12"
                height="12"
              >
                <path
                  d="M832 364.8h-147.2s19.2-64 32-179.2c6.4-57.6-38.4-115.2-102.4-121.6h-12.8c-51.2 0-83.2 32-102.4 76.8l-38.4 96c-32 64-57.6 102.4-76.8 115.2-25.6 12.8-121.6 12.8-128 12.8H128c-38.4 0-64 25.6-64 57.6v480c0 32 25.6 57.6 64 57.6h646.4c96 0 121.6-64 134.4-153.6l51.2-307.2c6.4-70.4-6.4-134.4-128-134.4z m-576 537.6H128V422.4h128v480z m640-409.6l-51.2 307.2c-12.8 57.6-12.8 102.4-76.8 102.4H320V422.4c44.8 0 70.4-6.4 89.6-19.2 32-12.8 64-64 108.8-147.2 25.6-64 38.4-96 44.8-102.4 6.4-19.2 19.2-32 44.8-32h6.4c32 0 44.8 32 44.8 51.2-12.8 102.4-32 166.4-32 166.4l-25.6 83.2h243.2c19.2 0 32 0 44.8 12.8 12.8 12.8 6.4 38.4 6.4 57.6z"
                  p-id="4040"
                  fill="#bfbfbf"
                ></path>
              </svg>
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
                            @click="
                              () => $router.push(`/mypage/${item.userId}`)
                            "
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
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import { useCounterStore } from "@/stores/user";
import { reqArticleCategory } from "@/api/acticle/index";
import { useArticleStore } from "@/stores/article";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
import Popover from "@/components/Popover/Popover.vue";

const categoryList = ref([]);
const current = ref("全部");
const currentArt = ref([]);
const router = useRouter();
const route = useRoute();
const userStore = useCounterStore();
const articleStore = useArticleStore();
// 设置当前页面页码与尺寸
const pageNum = ref(1);
const pageSize = ref(12);
// 是否禁用无限滚动
const isInfinite = ref(false);
// 获取所有文章列表
const load = async () => {
  if (articleStore.Articles.length >= articleStore.total) {
    return;
  }
  await articleStore.getNewPage(pageNum.value, pageSize.value);
  pageNum.value++;
};
onMounted(async () => {
  articleStore.Articles = [];
  articleStore.total = 1;
  getCategory();

  if (route.path.includes("home")) {
    console.log(articleStore.Articles.length, articleStore.total);

    await articleStore.getNewPage(pageNum.value, pageSize.value);
    pageNum.value++;
    console.log(articleStore.Articles);
    currentArt.value = articleStore.Articles;
    return;
  }
  if (route.path.includes("mypage")) {
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
onMounted(() => {});
const getCategory = async () => {
  let res = await reqArticleCategory();
  if (res.code == 200) {
    categoryList.value = res.data;
  }
};
const select = (cId) => {
  console.log(cId);

  articleStore.Articles = articleStore.catagoryArt.filter((item) => {
    return item.categoryId == cId;
  });
  console.log("as", articleStore.Articles);
  categoryList.value.forEach((item) => {
    if (item.id == cId) {
      console.log(item.name);
      current.value = item.name;
      return;
    }
  });
  console.log(current.value);
};
onBeforeUnmount(() => {
  articleStore.Articles = [];
});
</script>
<style lang="scss" scoped>
.category {
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(246, 246, 246);
  .top {
    width: 80%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }
  .content-main {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
}
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
          width: 70%;
          color: black;
          font-size: 16px;
          margin-bottom: 5px;
          font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
            "HanHei SC", "Helvetica Neue", "Open Sans", Arial,
            "Hiragino Sans GB", 微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun,
            sans-serif, HYWenHei-GEW !important;
          overflow: hidden;
          white-space: nowrap;
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
