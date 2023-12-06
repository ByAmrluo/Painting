<template>
  <div class="container">
    <div class="main">
      <button
        @click="appDesigner"
        class="become"
        style="box-sizing: border-box"
      >
        成为设计师
      </button>
      <button
        @click="publishAppoint"
        style="
          border-radius: 10px;
          box-sizing: border-box;
          border: 1px solid yellow;
        "
      >
        发布约稿
      </button>
      <div class="big-box">
        <div class="box" v-for="(item, index) in appointOrder" :key="item.id">
          <button
            @click="handleAccess(item.id)"
            v-if="
              userStore.personalInfo.role == 'Designer' &&
              userStore.username !== item.username
            "
          >
            接受
          </button>
          <el-tag
            style="position: absolute; top: 10px; right: 10px"
            v-if="userStore.username == item.username"
            >我</el-tag
          >
          <div class="title">
            <h4>{{ item.title }}</h4>
          </div>
          <div class="request">
            <p>{{ item.description }}</p>
          </div>
          <div class="time">
            <p>截止日期：{{ item.time ? item.time : "一周之内" }}</p>
          </div>
          <div class="footer">
            <div class="left">
              <Popover class="personal-info" placement="top">
                <template #content>
                  <div class="personal-info">
                    <div class="top">
                      <div class="left">
                        <div class="avatar">
                          <img
                            :src="item.userAvatar"
                            alt=""
                            class=".avatar"
                            @click="
                              () => $router.push(`/mypage/${item.userId}`)
                            "
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
                    :src="item.userAvatar"
                    alt=""
                    style="width: 35px; height: 35px; border-radius: 35px"
                  />
                </template>
              </Popover>

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
            <div class="right">
              <h4>{{ item.price }}￥</h4>
            </div>
          </div>
        </div>
      </div>
      <div class="demo-pagination-block" style="margin-top: 10px">
        <el-pagination
          v-model:current-page="pageNum"
          v-model:page-size="pageSize"
          :page-sizes="[2, 4, 6, 8]"
          :background="true"
          layout=" , prev, pager, next, jumper,->,sizes,total,"
          :total="total"
          @current-change="handleCurrentChange"
          @size-change="hangdleSizeChange"
        />
      </div>
    </div>

    <el-dialog
      v-model="dialogFormVisible"
      title="请填写约稿要求"
      :append-to-body="true"
    >
      <el-form :model="appointForm">
        <el-form-item label="标题">
          <el-input v-model="appointForm.title" />
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="appointForm.time"
            type="date"
            placeholder="选择日期"
            size="default"
            popper-class="datePicker"
            value-format="YYYY-MM-DD"
            :append-to-body="true"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            type="textarea"
            v-model="appointForm.description"
          ></el-input>
        </el-form-item>

        <el-form-item label="价格">
          <el-input v-model="appointForm.price"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmOrders"> 确定 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref } from "vue";
import Popover from "@/components/Popover/Popover.vue";
import { useRoute, useRouter } from "vue-router";
import { useCounterStore } from "@/stores/user";
import {
  reqAddReserve,
  reqReserveList,
  reqDrawOrder,
  reqReservePage,
  reqUploadOrder,
} from "@/api/acticle/index.ts";
import { ElMessage } from "element-plus";
const route = useRoute();
const router = useRouter();
const dialogFormVisible = ref(false);
const pageNum = ref(1);
const pageSize = ref(6);
const total = ref(0);
const userStore = useCounterStore();
// 收集发布订单参数
const appointForm = ref({
  title: "",
  description: "",
  price: "",
  time: "",
  img: "",
});
// 获取所有的订单集合
const appointOrder = ref([]);
const publishAppoint = () => {
  dialogFormVisible.value = true;
};
const handleAccess = async (id) => {
  let res = confirm("你确定接收吗？");
  if (res) {
    let res1 = await reqDrawOrder(id);
    if (res1.code == 200) {
      ElMessage({
        type: "success",
        message: "接受成功~可在个人中心查看对应订单",
      });
      getReservePage();
    }
  }
};
onMounted(async () => {
  getReservePage();
  console.log(userStore.role);
});
const getReservePage = async (page = 1) => {
  pageNum.value = page;
  let res = await reqReservePage(pageNum.value, pageSize.value);
  if (res.code == 200) {
    total.value = res.data.total;
    appointOrder.value = res.data.records.filter((item) => {
      return item.status == "待处理";
    });
  } else {
    return new Error("获取订单需求失败！");
  }
};
// 申请成为设计师
const appDesigner = () => {};
// 发布订单
const confirmOrders = async () => {
  let res = await reqAddReserve(appointForm.value);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "发布成功",
    });
    getReservePage();
    dialogFormVisible.value = false;
  } else {
    ElMessage({
      type: "error",
      message: "发布失败",
    });
  }
};
const handleCurrentChange = () => {
  getReservePage(pageNum.value);
};
const hangdleSizeChange = () => {
  getReservePage(pageNum.value);
};
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100vw;
  min-height: 90vh;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  background-color: rgb(246, 246, 246);
  font-family: "PingFang SC", "Lantinghei SC", "Microsoft YaHei", "HanHei SC",
    "Helvetica Neue", "Open Sans", Arial, "Hiragino Sans GB", 微软雅黑, STHeiti,
    "WenQuanYi Micro Hei", SimSun, sans-serif, HYWenHei-GEW !important;

  .main {
    position: relative;
    min-height: 90vh;
    display: flex;
    flex-wrap: wrap;
    width: 90%;
    background-color: #fff;
    margin: 0 auto;
    padding: 0px 40px;
    .become {
      margin-right: 130px;
      background-color: #fff;
      border: 1px solid rgb(30, 27, 27);
      background-color: #fff;
      border-radius: 10px;
      box-sizing: border-box;
      &:hover {
        border: 1px solid rgba(153, 153, 153, 0.3);
        box-sizing: border-box;
        background-color: rgba(153, 153, 153, 0.3);
      }
    }
    button {
      font-size: 14px;
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 8px 30px;
      border: none;
      background-color: yellow;
      &:hover {
        cursor: pointer;
        border: none;
        background-color: orange;
      }
    }

    .big-box {
      display: flex;
      flex-wrap: wrap;
      width: 90%;
      margin: 0 auto;
      background-color: #fff;
      margin-top: 60px;
      .box {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        border-radius: 10px;
        border: 1px solid #ccc;
        width: 49%;
        margin-right: 20px;
        height: 180px;
        margin-bottom: 20px;
        padding-left: 20px;
        padding-top: 20px;
        &:hover {
          cursor: pointer;
          background-color: rgba(246, 246, 246, 0.5);
        }
        button {
          font-size: 14px;
          position: absolute;
          top: 10px;
          right: 10px;
          padding: 5px 30px;
        }
        .title {
          h4 {
            font-size: 24px;
            font-weight: 500;
          }
        }
        p {
          font-size: 14px;
          color: rgb(85, 85, 85);
        }
        .footer {
          height: 50px;
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: nowrap;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid rgb(238, 238, 238);
          border-bottom-left-radius: 4px;
          border-bottom-right-radius: 4px;

          .left {
            display: flex;
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            align-items: center;
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
          .right {
            margin-right: 20px;
            h4 {
              font-size: 20px;
              font-weight: 600;
              color: red;
            }
          }
        }
      }
    }
    .box:nth-child(2n) {
      margin-right: 0;
    }
  }
}
</style>
