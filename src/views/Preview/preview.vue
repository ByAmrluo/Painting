<template>
  <div class="big">
    <div class="detail-contaier">
      <div class="header">
        <h1>{{ currentArticle.title }}</h1>
        <div class="userInfo">
          <div class="avatar">
            <PopInfo :item="currentArticle">
              <template #hover>
                <img
                  :src="currentArticle.avatarUrl"
                  alt=""
                  style="width: 50px; height: 50px"
                />
              </template>
            </PopInfo>

            <div class="user">
              <h4>{{ currentArticle.username }}</h4>
              <p><span>湖南&nbsp;</span><span>设计师&nbsp;</span></p>
            </div>
          </div>
          <div class="operate">
            <button class="email" @click="handleCollect" :disabled="isPrev">
              {{ currentArticle.flag == true ? "已收藏" : "收藏" }}
            </button>
            <button class="consider" :disabled="isPrev" @click="handleFollow">
              {{ currentArticle.love ? "已关注" : "关注" }}
            </button>
          </div>
        </div>
      </div>
      <div class="content">
        <div class="contentText">
          <p>{{ currentArticle.content }}</p>
        </div>
        <div
          class="imgbox"
          v-for="item in currentArticle.filesList"
          :key="item.id"
        >
          <img :src="item.url ? item.url : item" alt="" />
          <p v-if="currentArticle.direction">雪山</p>
        </div>
      </div>
      <div class="footer">
        <div class="comment-opera">
          <div class="thumb" @click="handleHit">
            <svg
              t="1697530681602"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="2403"
              width="50"
              height="50"
              :aria-disabled="isPrev"
            >
              <path
                d="M729.6 896H426.666667c-38.4 0-72.533333-12.8-102.4-34.133333-17.066667 21.333333-38.4 34.133333-68.266667 34.133333H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333v-298.666667c0-46.933333 38.4-85.333333 85.333334-85.333333h128c72.533333 0 128-55.466667 128-128V256c0-72.533333 55.466667-128 128-128s128 55.466667 128 128v170.666667h85.333333c72.533333 0 128 55.466667 128 128v8.533333l-42.666667 213.333333c-17.066667 72.533333-68.266667 119.466667-123.733333 119.466667zM341.333333 725.333333c0 46.933333 38.4 85.333333 85.333334 85.333334h298.666666c17.066667 0 34.133333-17.066667 42.666667-51.2l42.666667-209.066667c0-21.333333-21.333333-38.4-42.666667-38.4h-128c-25.6 0-42.666667-17.066667-42.666667-42.666667V256c0-25.6-17.066667-42.666667-42.666666-42.666667s-42.666667 17.066667-42.666667 42.666667v42.666667c0 102.4-72.533333 187.733333-170.666667 209.066666V725.333333z m-170.666666-213.333333v298.666667h85.333333v-298.666667H170.666667z"
                p-id="2404"
              ></path>
            </svg>
            <h4>{{ currentArticle.hits }}</h4>
          </div>
        </div>

        <div class="tag">
          <div><a href="#">原创</a></div>
          <div><a href="#">平面设计</a></div>
          <div><a href="#">简洁</a></div>
        </div>
      </div>
      <div class="comment">
        <Comment></Comment>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { useArticleStore } from "@/stores/article";
import PopInfo from "@/components/PopInfo/Popinfo.vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import Comment from "@/components/Commment/Comment.vue";
import { useCounterStore } from "@/stores/user";
import {
  reqArticleImgs,
  reqCollectArticle,
  reqAddHit,
} from "@/api/acticle/index.ts";
import { reqAddFollow } from "@/api/user/index.ts";
import { ElMessage } from "element-plus";
import type { StarFilled } from "@element-plus/icons-vue";
const route = useRoute();
const router = useRouter();
const userStore = useCounterStore();
const articleStore = useArticleStore();
const id = ref<Number>();

// 控制预览信息
const isPrev = ref(false);
// 展示当前信息
const currentArticle = ref({
  flag: false,
  love: false,
  hit: false,
  avatarUrl: "",
  userId: "",
  username: "",
  title: "",
  img: "",
  content: "",
  createTime: "",
  categoryId: 3,
  hits: 0,
  filesList: [],
});
onMounted(async () => {
  if (
    userStore.token !== "" &&
    userStore.avatar !== "" &&
    userStore.username !== ""
  ) {
    if (route.path.includes("/detail")) {
      // 主键挂载重新获取数据
      id.value = parseInt(route.params.id);
      let res = await reqArticleImgs(Number(route.params.id));
      if (res.code == 200) {
        console.log(currentArticle.value);

        currentArticle.value = res.data;
        console.log(currentArticle.value);
      } else {
        console.log("有带你问题");
      }
    } else {
      currentArticle.value = articleStore.articleCurrent;
      currentArticle.value.filesList = articleStore.articleCurrent.imgUrls;
      isPrev.value = true;
    }
  } else {
    router.push("/home");
  }
});
// 处理收藏事件
const handleCollect = async () => {
  let res = await reqCollectArticle(route.params.id, currentArticle.value.flag);
  if (res.code == 200) {
    if (res.data == "收藏成功") {
      currentArticle.value.flag = true;
    } else {
      currentArticle.value.flag = false;
    }
  } else {
    Promise.reject(new Error(res.msg));
  }
};
const handleHit = async () => {
  let res = await reqAddHit(route.params.id, currentArticle.value.hit);
  if (res.code == 200) {
    if (res.data == "点赞成功") {
      ElMessage({
        type: "success",
        message: "点赞成功",
      });
      currentArticle.value.hit = true;
      currentArticle.value.hits++;
    } else {
      ElMessage({
        type: "success",
        message: "取消点赞成功",
      });
      currentArticle.value.hit = false;

      currentArticle.value.hits--;
    }
  } else {
    Promise.reject(new Error(res.msg));
  }
};
const handleFollow = async () => {
  let res = await reqAddFollow(
    currentArticle.value.userId,
    currentArticle.value.love
  );
  if (res.code == 200) {
    if (res.data == "关注成功") {
      currentArticle.value.love = true;
    } else {
      currentArticle.value.love = false;
    }
  } else {
    Promise.reject(new Error(res.msg));
  }
};
</script>
<style lang="scss" scoped>
.big {
  margin-top: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100vw;
  padding-bottom: 40px;
  .detail-contaier {
    overflow: hidden;
    min-width: 900px;
    max-width: 100vw;
    width: 60%;
    flex-direction: column;
    margin: 0 auto;
    display: flex;
    justify-content: start;
    align-items: center;
    .header {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: start;
      h1 {
        font-size: 30px;
        font-weight: 500px;
        font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei",
          "HanHei SC", "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB",
          微软雅黑, STHeiti, "WenQuanYi Micro Hei", SimSun, sans-serif,
          HYWenHei-GEW !important;
      }
      .userInfo {
        width: 100%;
        display: flex;
        margin-top: 60px;
        flex-direction: row;
        justify-content: space-between;
        .avatar {
          display: flex;
          align-items: center;
          width: 20%;
          img {
            margin-right: 5px;
            width: 20%;
            border-radius: 50px;
          }
          .user {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: space-evenly;
            h4 {
              font-size: 14px;
              color: rgb(51, 51, 51);
              &:hover {
                cursor: pointer;
                color: orange;
              }
            }
            p {
              font-size: 12px;
              color: rgb(136, 136, 136);
            }
          }
        }
        .operate {
          width: 40%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: flex-end;
          .email {
            width: 20%;
            height: 40px;
            font-size: 14px;
            border: 1px solid rgb(30, 27, 27);
            background-color: #fff;
            border-radius: 10px;
            &:hover {
              border: none;
              background-color: rgba(153, 153, 153, 0.3);
            }
          }
          .consider {
            width: 20%;
            height: 40px;
            border: none;
            border-radius: 10px;
            margin-left: 10px;
            font-size: 14px;
            background-color: yellow;
            &:hover {
              background-color: orange;
            }
          }
        }
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 40px;
      padding-bottom: 40px;
      width: 100%;
      .contentText {
        width: 100%;
        display: flex;
        white-space: pre-line;
        justify-content: flex-start;
        align-items: center;
        margin-bottom: 40px;
      }
      .imgbox {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        margin-bottom: 20px;
        img {
          width: 100%;
          object-fit: cover;
        }
      }
    }
    .footer {
      margin-top: 40px;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      align-items: center;
      justify-content: center;
      .comment-opera {
        display: flex;
        width: 100%;
        position: relative;
        align-items: center;
        justify-content: center;

        .thumb {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width: 150px;
          height: 90px;
          background-color: yellow;
          border-radius: 90px;
          justify-content: center;
          &:hover {
            background-color: orange;
            cursor: grab;
          }
          h4 {
            margin-top: 5px;
          }
        }
        .opera {
          display: flex;
          width: 40%;
          height: 40px;
          position: absolute;
          right: 0;
          flex-wrap: nowrap;

          .collect {
            position: absolute;
            right: 0;
            box-sizing: border-box;
            width: 20%;
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-items: center;
            height: 40px;
            font-size: 16px;
            border: 1px solid rgb(30, 27, 27);
            background-color: #fff;
            border-radius: 10px;
            &:hover {
              box-sizing: border-box;
              border: none;
              background-color: rgba(153, 153, 153, 0.3);
            }
          }
        }
      }

      .tag {
        margin-top: 20px;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        a {
          display: block;
          padding: 10px 20px;
          background-color: rgba(153, 153, 153, 0.1);
          margin-right: 10px;
          border-radius: 20px;
        }
      }
    }
    .comment {
      width: 100%;
    }
  }
}
</style>
