<template>
  <div class="orders-container" v-if="orderArr.length > 0">
    <div class="content">
      <div class="orders-b">
        <div class="order" v-for="(item, index) in orderArr">
          <div class="top">
            <div
              class="img"
              style="
                width: 200px;
                height: 100%;
                overflow: hidden;
                display: flex;
                align-items: center;
                border-radius: 10px;
              "
              @mouseenter="
                () => {
                  isPreBox = true;
                }
              "
              @mouseleave="
                () => {
                  isPreBox = false;
                }
              "
            >
              <el-image
                style="height: 95%"
                src="../../../../../public/images/login-lzy.jpg"
                fit="fill"
                :preview-src-list="srcList"
                ref="Img"
                title="点击查看图片"
                v-if="item.imgUrl"
              />
              <div class="block" v-else>
                <el-image>
                  <template #error>
                    <div class="image-slot">
                      <el-icon><icon-picture />暂无图片</el-icon>
                    </div>
                  </template>
                </el-image>
              </div>
              <el-image-viewer
                ref="previewViewer"
                style="z-index: 10"
                v-if="isPre"
                :on-close="closeImgView"
                @close="closeImgView"
                :url-list="srcList"
              />
              <!-- <div class="prev" v-if="isPreBox">
                <el-icon style="color: #fff; font-size: 30px" @click="onPreview"
                  ><ZoomIn
                /></el-icon>
              </div> -->
            </div>
            <div class="info">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="要求栩栩如生1111111111111111111111111111111111111111"
                placement="top-end"
              >
                <h4>{{ item.title }}</h4>
              </el-tooltip>

              <div class="description">
                <el-tooltip
                  class="box-item"
                  effect="dark"
                  :content="item.description"
                  placement="top-end"
                >
                  <p>{{ item.description }}</p>
                </el-tooltip>
              </div>
              <div class="time">
                <p>截止日期：{{ item.time }}</p>
              </div>
              <div class="status">
                <p>
                  状态：
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="待处理-已接受-已完成"
                    placement="top-start"
                  >
                    <span style="font-weight: 550">{{ item.status }}</span>
                  </el-tooltip>
                </p>
              </div>
            </div>
          </div>
          <div class="footer">
            <div class="left">
              <div class="req">
                <p>接受方：</p>
                <img
                  :src="userStore.avatar"
                  alt=""
                  style="width: 40px; height: 40px; border-radius: 40px"
                />
                <p>{{ userStore.username }}</p>
              </div>
              <div class="acc">
                <p>发送方：</p>
                <img
                  :src="item.userAvatar"
                  alt=""
                  style="width: 40px; height: 40px; border-radius: 40px"
                />
                <p>{{ item.username }}</p>
                <p
                  style="
                    display: flex;
                    justify-content: center;
                    color: rgb(136, 136, 136);
                  "
                >
                  <el-icon
                    color="rgb(136,136,136)"
                    size="14"
                    style="margin-left: 15px; margin-right: 3px"
                    ><Clock
                  /></el-icon>
                  {{ item.created }}
                </p>
              </div>
            </div>
            <div class="right">
              <h4 style="margin-right: 5px">{{ item.price }}￥</h4>
              <button class="upload">上传图片</button>
              <button class="draw">撤回</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <el-empty description="什么东西都没有~快去发布吧！" v-else>
    <a
      class="toHome"
      @click="
        () => {
          $router.push('/appoint');
        }
      "
      >去逛逛</a
    >
  </el-empty>
</template>
<script lang="ts" setup>
import type { Search } from "@element-plus/icons-vue";
import { Picture as IconPicture } from "@element-plus/icons-vue";
import { ref, onMounted } from "vue";
import { useCounterStore } from "@/stores/user";
import { useRoute, useRouter } from "vue-router";
import {
  reqAddReserve,
  reqReserveList,
  reqDrawOrder,
  reqReservePage,
  reqUploadOrder,
  reqDesOrderList,
} from "@/api/acticle/index.ts";
import { ElMessage } from "element-plus";
const Img = ref();
const isPre = ref(false);
const orderArr = ref([]);
const isPreBox = ref(false);
const userStore = useCounterStore();
const srcList = ref(["../../../../../public/images/login-lzy.jpg"]);
onMounted(() => {
  getResList();
});
const getResList = async () => {
  let res = await reqReserveList();
  if (res.code == 200) {
    orderArr.value = res.data;
  } else {
    return new Error("失败！");
  }
};
const onPreview = () => {
  isPreBox.value = false;
  isPre.value = true;
};
const closeImgView = () => {
  isPre.value = false;
  isPreBox.value = false;
  console.log(isPre.value);
};
</script>
<style lang="scss" scoped>
.orders-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;

  background-color: rgb(246, 246, 246);
  height: 1000px;
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC",
    "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", 微软雅黑, STHeiti,
    "WenQuanYi Micro Hei", SimSun, sans-serif, HYWenHei-GEW !important;
  .content {
    display: flex;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 40px;
    .orders-b {
      display: flex;
      flex-direction: column;
      padding-left: 10px;
      padding-top: 10px;
      padding-bottom: 10px;
      width: 100%;
      margin: 0 auto;
      background-color: #fff;
      .order {
        display: flex;
        height: 200px;
        width: 100%;
        flex-direction: column;
        border-bottom: 1px solid rgba(60, 60, 60, 0.3);
        padding-bottom: 20px;
        margin-bottom: 25px;
        .info {
          display: flex;
          height: 100%;
          justify-content: space-around;
          flex-direction: column;
          margin-left: 10px;
          .description {
            overflow: hidden;
            text-overflow: ellipsis;
            width: 300px;
          }
          h4 {
            font-size: 24px;
            font-weight: 500;
          }
          p {
            font-size: 16px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            color: rgb(85, 85, 85);
          }
        }
        .top {
          display: flex;
          height: 75%;
          width: 100%;
          flex-direction: row;
          margin-bottom: 5px;

          .img {
            position: relative;
            .prev {
              position: absolute;
              display: flex;
              align-items: center;
              justify-content: center;
              top: 0;
              left: 0;
              width: 200px;
              height: 100%;
              background-color: rgba(60, 60, 60, 0.3);
            }
          }
        }
        .footer {
          margin-top: 10px;
          padding-bottom: 10px;
          display: flex;
          height: 25%;
          width: 100%;
          justify-content: space-between;
          flex-direction: row;
          .left {
            display: flex;
            height: 100%;
            flex-wrap: nowrap;
            align-items: center;
            .req {
              display: flex;
              height: 100%;
              flex-wrap: nowrap;
              align-items: center;
            }
            .acc {
              display: flex;
              height: 100%;
              flex-wrap: nowrap;
              align-items: center;
            }
          }
          .right {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            margin-right: 20px;
            h4 {
              font-size: 20px;
              font-weight: 600;
              color: red;
            }
            .upload {
              width: 80px;
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
            .draw {
              width: 80px;
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
          p {
            display: block;
            &:hover {
              cursor: pointer;
              color: orange;
            }
            margin-left: 0.5em;
            color: black;
            font-size: 13px;
          }
        }
      }
    }
  }
}
.block {
  padding: 30px 0;
  text-align: center;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
  vertical-align: top;
}
.demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
.el-image {
  padding: 0 5px;
  max-width: 300px;
  max-height: 200px;
  width: 100%;
  height: 200px;
}

.image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
.image-slot .el-icon {
  font-size: 30px;
}
</style>
