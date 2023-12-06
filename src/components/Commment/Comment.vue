<template>
  <div style="margin-top: 40px">
    <el-card>
      <div style="margin: 10px 0; font-size: 24px">
        {{ userStore.personalInfo.sign }}
      </div>
      <div style="border-bottom: 1px solid #ccc"></div>
      <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12)"></div>
      <!-- <div v-html="post.content"></div> -->
      <div style="border-bottom: 1px solid #ccc"></div>
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: flex-end;
          margin-top: 10px;
        "
      >
        <div style="display: flex; align-items: center; margin-right: 10px">
          <div style="width: 50px; text-align: center">
            <el-image
              :src="
                userStore.personalInfo.avatarUrl ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
              style="width: 50px; height: 50px; border-radius: 50%"
            ></el-image>
          </div>
          <span style="margin-left: 10px; margin-right: 10px; font-size: 15px">
            {{ userStore.personalInfo.username }}</span
          >
        </div>
        <div style="font-size: 15px; color: gray">
          {{ "2022-10-12" }}
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 20px">
      <div style="font-size: 18px; font-weight: bolder; margin-bottom: 10px">
        评论
      </div>
      <div>
        <el-input type="textarea" v-model="commentForm.content"></el-input>
      </div>
      <div style="text-align: right; margin-top: 10px">
        <el-button type="primary" @click="save">评论</el-button>
      </div>
    </el-card>
    <el-card style="margin-top: 20px">
      <!-- 头部 -->
      <div style="font-size: 18px; font-weight: bolder; margin-bottom: 10px">
        评论区
      </div>
      <div
        v-for="item in comments"
        :key="item.id"
        style="border-bottom: 1px solid #ccc; padding: 15px 0"
      >
        <!-- 头像 -->
        <div style="display: flex; margin-bottom: 20px">
          <div style="width: 100px; text-align: center">
            <el-image
              :src="
                item.avatar ||
                'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
              "
              style="width: 50px; height: 50px; border-radius: 50%"
            ></el-image>
          </div>
          <!-- 内容和名称  时间和功能 -->
          <div style="flex: 1; display: flex; flex-direction: column">
            <div style="font-size: 15px; display: flex; align-items: center">
              <span style="font-weight: bolder; padding-right: 5px"
                >{{ item.name }} :</span
              >
              <span>{{ item.content }}</span>
            </div>
            <div
              style="
                display: flex;
                margin-top: 8px;
                justify-content: space-between;
                align-items: center;
              "
            >
              <div style="display: flex; align-items: center">
                <i class="el-icon-time" style="padding-right: 5px"></i>
                <span style="font-size: 15px; padding-right: 5px">{{
                  item.commentTime
                }}</span>
              </div>
              <div>
                <el-button type="primary" @click="handleReply(item.id)"
                  >回复</el-button
                >
                <el-button
                  type="warning"
                  @click="del(item.id)"
                  v-if="userStore.userId === item.userId"
                  >删除</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <!-- 回复区 -->
        <div
          v-if="item.children.length > 0"
          style="position: relative; margin-left: 100px; margin-right: 120px"
        >
          <div style="padding: 10px; background-color: #f5f5f5">
            <div
              v-for="subItem in item.children"
              :key="subItem.id"
              style="display: flex; margin-top: 10px"
            >
              <div style="width: 100px; text-align: center; margin-top: 5px">
                <el-image
                  :src="
                    subItem.avatar ||
                    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                  "
                  style="width: 50px; height: 50px; border-radius: 50%"
                ></el-image>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column">
                <div style="display: flex; align-items: center">
                  <span
                    style="
                      color: #3a8ee6;
                      font-weight: bolder;
                      padding-right: 5px;
                      padding-bottom: 5px;
                    "
                    v-if="subItem.pname"
                    >@{{ subItem.pname }}
                  </span>
                </div>
                <div style="display: flex; align-items: center">
                  <span style="font-weight: bolder; padding-right: 5px"
                    >{{ subItem.name }} :</span
                  >
                  <span>{{ subItem.content }}</span>
                </div>
                <div
                  style="
                    display: flex;
                    margin-top: 10px;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgb(204, 204, 204);
                  "
                >
                  <div style="display: flex; align-items: center">
                    <i class="el-icon-time" style="padding-right: 5px"></i>
                    <span style="font-size: 15px; padding-right: 5px">{{
                      subItem.commentTime
                    }}</span>
                    <div style="margin-bottom: 2px; padding-left: 220px">
                      <el-button type="primary" @click="handleReply(subItem.id)"
                        >回复</el-button
                      >
                      <el-button
                        type="warning"
                        @click="del(subItem.id)"
                        v-if="userStore.userId === subItem.userId"
                        >删除</el-button
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>

    <el-dialog title="回复" v-model="dialogFormVisible" width="30%">
      <el-form size="small">
        <el-form-item>
          <el-input
            type="textarea"
            v-model="commentForm.contentReply"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="warning" @click="dialogFormVisible = false"
          >取 消</el-button
        >
        <el-button type="primary" @click="save">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useCounterStore } from "@/stores/user";
import { onMounted, ref, reactive } from "vue";
import { useRoute } from "vue-router";
import {
  reqAddComment,
  reqAllComment,
  reqCommentDel,
} from "@/api/acticle/index.ts";
import { useArticleStore } from "@/stores/article";
import { ElMessage } from "element-plus";

const userStore = useCounterStore();
const articleStore = useArticleStore();
const dialogFormVisible = ref(false);
const route = useRoute();
let commentForm = ref({
  id: undefined,
  pid: null,
  userId: undefined,
  postId: 6,
  content: "",
  originId: undefined,
  username: userStore.personalInfo.username,
  avatarUrl: userStore.personalInfo.avatarUrl,
  children: [],
  pname: null,
  puserId: null,
});
const resetCommentForm = () => {
  commentForm.value = {
    id: undefined,
    pid: null,
    userId: undefined,
    postId: -1,
    content: "",
    originId: undefined,
    name: undefined,
    avatar: undefined,
    children: [],
    pname: null,
    puserId: null,
  };
};
// 对应文章的评论
let comments = ref([]);
onMounted(() => {
  console.log(dialogFormVisible.value);
  load();
  loadComments();
});
const load = async () => {
  await userStore.getUserInfoById(userStore.userId);
  console.log(userStore.personalInfo);
};
const loadComments = async () => {
  commentForm.value.postId = parseInt(route.params.id);
  let res = await reqAllComment(commentForm.value.postId);
  if (res.code == 200) {
    comments.value = res.data;
    console.log(comments.value);
  }

};

const save = async () => {


  console.log(commentForm.value);

  if (commentForm.value.contentReply) {
    commentForm.value.content = commentForm.value.contentReply;
    dialogFormVisible.value = false;
  }
  let res = await reqAddComment(commentForm.value);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "评论成功",
    });
    resetCommentForm();
    console.log(commentForm.value);

    loadComments();
  } else {
    ElMessage({
      type: "error",
      message: "评论失败",
    });
  }
  // this.$request.post("/comment/add", this.commentForm).then((res) => {
  //   if (res.code === "200") {
  //     this.$message.success("评论成功");
  //     this.commentForm = {};
  //     this.loadComments();
  //   } else {
  //     this.$message.error(res.msg);
  //   }
  // });
};
const del = async (id) => {
  let res = await reqCommentDel(id);
  if (res.code == 200) {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
    resetCommentForm();
    loadComments();
  } else {
    ElMessage({
      type: "error",
      message: "删除失败",
    });
  }

  //   this.$request.delete("/comment/delete/" + id).then((res) => {
  //     if (res.code === "200") {
  //       this.$message.success("删除成功");
  //       this.loadComments();
  //     } else {
  //       this.$message.error("删除失败");
  //     }
  //   });
};
const handleReply = (pid) => {
  commentForm.value.pid = pid;
  dialogFormVisible.value = true;
};
// export default {
//   name: "PostDetail",
//   data() {
//     return {
//       post: {},
//       comments: [],
//       commentForm: {},
//       id: this.$route.query.id,
//       user: JSON.parse(localStorage.getItem("success-user") || "{}"),
//       dialogFormVisible: false,
//     };
//   },
//   created() {
//     this.load();
//     this.loadComments();
//   },
//   methods: {
//     load() {
//       if (!this.id) {
//         return;
//       }
//       this.$request.get("/post/selectById/" + this.id).then((res) => {
//         this.post = res.data;
//       });
//     },
//     loadComments() {
//       this.commentForm.postId = this.id;
//       if (!this.id) {
//         return;
//       }
//       this.$request.get("/comment/tree/" + this.id).then((res) => {
//         this.comments = res.data;
//       });
//     },
//     goBack() {
//       // 返回上一页
//       window.history.back();
//     },
//     save() {
//       this.commentForm.postId = this.id;
//       if (!this.user.id) {
//         this.$message.warning("未登录");
//       }
//       if (this.commentForm.contentReply) {
//         this.commentForm.content = this.commentForm.contentReply;
//         this.dialogFormVisible = false;
//       }
//       this.$request.post("/comment/add", this.commentForm).then((res) => {
//         if (res.code === "200") {
//           this.$message.success("评论成功");
//           this.commentForm = {};
//           this.loadComments();
//         } else {
//           this.$message.error(res.msg);
//         }
//       });
//     },
//     del(id) {
//       this.$request.delete("/comment/delete/" + id).then((res) => {
//         if (res.code === "200") {
//           this.$message.success("删除成功");
//           this.loadComments();
//         } else {
//           this.$message.error("删除失败");
//         }
//       });
//     },
//     handleReply(pid) {
//       this.commentForm = { pid: pid };
//       this.dialogFormVisible = true;
//     },
//   },
// };
</script>

<style>
.post-detail img {
  max-width: 500px;
  max-height: 400px;
  width: auto;
  height: auto;
}
</style>
