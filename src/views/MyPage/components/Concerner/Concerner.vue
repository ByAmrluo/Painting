<template>
  <div class="Designer" v-if="designer.length > 0">
    <div class="top">
      <el-dropdown>
        <span class="el-dropdown-link">
          排序方式
          <el-icon class="el-icon--right">
            <arrow-down />
          </el-icon>
        </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>作品量</el-dropdown-item>
            <el-dropdown-item>粉丝量</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="content">
      <div class="designer-box">
        <template v-for="item in designer" :key="item">
          <div class="designer-info">
            <div class="left">
              <div class="avatar">
                <img :src="item.avatarUrl" alt="" />
              </div>
              <div class="detail">
                <div class="info">
                  <h4>{{ item.username }}</h4>
                  <span>广州 设计爱好者</span>
                </div>

                <div class="count">
                  <p>
                    粉丝<span>{{ item.fans }}</span>
                  </p>
                  <p>
                    点赞<span>{{
                      item.articleList.length == 0 ? 0 : item.hits
                    }}</span>
                  </p>
                  <p>
                    收藏<span>{{ item.collects }}</span>
                  </p>
                </div>
              </div>
              <br />
            </div>
            <div class="right">
              <button class="toPage" @click="toPage(item)">进入主页</button>
              <button class="cancle" @click="cancleFollow(item.userId)">
                取消关注
              </button>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  <el-empty
    v-else
    description="什么东西都没有~快去关注吧！"
    style="background-color: #fff"
  >
    <a class="toHome" @click="() => $router.push('/home')">去逛逛</a>
  </el-empty>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { reqDesignerList } from "@/api/acticle/index";
import { reqFollowList, reqAddFollow } from "@/api/user/index.ts";
import { useRoute, useRouter } from "vue-router";
import { useCounterStore } from "@/stores/user";
import { ElMessage } from "element-plus";
const userStore = useCounterStore();
const route = useRoute();
const router = useRouter();
const designer = ref([]);
const emits = defineEmits(["isMe"]);
onMounted(() => {
  if (userStore.userId == parseInt(route.params.userid)) {
    getFollowList();
  }
});
const getFollowList = async () => {
  let res = await reqFollowList();
  if (res.code == 200) {
    console.log(res.data);
    designer.value = res.data;
    console.log("12312", designer.value);
  } else {
    console.log(res.message);
  }
};
const toPage = async (item) => {
  await router.push({
    path: "/mypage/" + item.userId,
    query: { id: item.userid },
  });
  location.reload();
};
const cancleFollow = async (id) => {
  let res = await reqAddFollow(id, true);
  if (res.data == "取消关注成功") {
    ElMessage({
      type: "success",
      message: "取消关注成功",
    });
    getFollowList();
  }
};
</script>
<style lang="scss">
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
.Designer {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(246, 246, 246);

  .top {
    width: 100%;
    height: 40px;
    margin: 0 auto;
    display: flex;
    align-items: center;
  }

  .content {
    display: flex;
    width: 100%;
    margin: 0 auto;
    padding-bottom: 40px;

    .designer-box {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      padding-top: 10px;
      width: 100%;
      margin: 0 auto;
      background-color: #fff;

      .toPage {
        width: 20%;
        height: 40px;
        border: none;
        border-radius: 10px;
        margin-left: 10px;
        font-size: 14px;
        background-color: yellow;
        margin-right: 20px;
        &:hover {
          background-color: orange;
        }
      }
      .cancle {
        width: 20%;
        height: 40px;
        font-size: 14px;
        border: 1px solid rgb(30, 27, 27);
        background-color: #fff;
        border-radius: 10px;
        margin-right: 20px;
        &:hover {
          border: none;
          background-color: rgba(153, 153, 153, 0.3);
        }
      }
      .designer-info {
        margin-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 5px;
        border-top: 1px solid rgb(238, 238, 238);
        .left {
          width: 40%;
          display: flex;
          flex-direction: row;
          align-items: center;
          width: 40%;

          .avatar {
            display: flex;
            margin-right: 10px;
            flex-direction: column;
            justify-content: flex-start;
            margin-right: 20px;

            img {
              width: 100px;
              height: 100px;
              border-radius: 100px;
            }
          }
          .detail {
            display: flex;
            height: 120px;
            max-height: 200px;
            flex-direction: column;
            justify-content: space-around;
            .info {
              display: flex;
              flex-direction: column;

              h4 {
                font-size: 18px;
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
            }

            .count {
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
        }

        .right {
          display: flex;
          flex-direction: row;
          width: 60%;
          justify-content: flex-end;
          align-items: center;
          .img-box {
            width: 24%;
            border-radius: 10px;
            position: relative;
            margin-right: 20px;
            &:hover::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              background-color: rgba(255, 255, 255, 0.1);
              border-radius: 10px;
              width: 100%;
              height: 100%;
            }

            img {
              width: 100%;
              border-radius: 10px;
              height: 150px;
            }
          }
        }
      }
    }
  }
}
</style>
