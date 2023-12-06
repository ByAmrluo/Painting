<template>
  <div class="Designer">
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
      <div class="designer-box" style="position: relative">
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
                <button
                  class="toPage"
                  @click="
                    () => {
                    
                      $router.push('/mypage/' + item.userId);
                    }
                  "
                >
                  进入主页
                </button>
                <div class="count">
                  <p>
                    粉丝<span>{{ item.fans }}</span>
                  </p>
                  <p>
                    点赞<span>{{ item.hits }}</span>
                  </p>
                  <p>
                    收藏<span>{{ item.collects }}</span>
                  </p>
                </div>
              </div>
              <br />
            </div>
            <div class="right">
              <template v-for="(img, index) in item.articleList">
                <div class="img-box" v-if="index <= 3">
                  <img :src="img.img" alt="" />
                </div>
              </template>
            </div>
          </div>
        </template>
        <div
          class="demo-pagination-block"
          style="margin-top: 10px; margin-bottom: 20px"
        >
          <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageLimit"
            :background="true"
            align="bottom"
            layout=" , prev, pager, next, jumper,->,sizes,total,"
            :total="total"
            :page-sizes="[10]"
            @current-change="getUserList"
            @size-change="hangdleSizeChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import { reqDesignerList } from "@/api/acticle/index";
import { ElMessage } from "element-plus";
const designer = ref([]);
const pageNum = ref(1);
const pageLimit = ref(10);
const total = ref(0);
onMounted(async () => {
  getUserList();
});
//获取用户信息 页码每次变化会自动注入当前页面
const getUserList = async (page = 1) => {
  pageNum.value = page;
  let res = await reqDesignerList(pageNum.value, pageLimit.value);
  if (res.code == 200) {
    designer.value = res.data.records;
    total.value = res.data.total;
  } else {
    ElMessage({
      type: "error",
      message: "服务器错误！",
    });
  }
};
const hangdleSizeChange = () => {
  getUserList();
};
</script>
<style lang="scss">
.Designer {
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

  .content {
    display: flex;
    width: 80%;
    margin: 0 auto;
    min-height: 80vh;

    .designer-box {
      display: flex;
      flex-direction: column;
      padding-left: 20px;
      padding-top: 10px;
      width: 100%;
      margin: 0 auto;
      background-color: #fff;

      .toPage {
        border-radius: 5px;
        border: none;
        width: 80px;
        height: 30px;
        font-size: 12px;
        background-color: yellow;
        &:hover {
          cursor: pointer;
          background-color: orange;
        }
      }

      .designer-info {
        padding-top: 10px;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-bottom: 10px;
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
            justify-content: space-between;
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
          justify-content: flex-start;

          .img-box {
            width: 24%;
            border-radius: 10px;
            position: relative;
            margin-right: 5px;
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
