<template>
  <div class="created-container">
    <div class="left">
      <el-card>
        <ul>
          <li>上传作品</li>
        </ul>
      </el-card>
    </div>
    <div class="right">
      <div>
        <el-card>
          <h4 class="title">上传作品</h4>
        </el-card>
      </div>
      <div style="margin-top: 20px; margin-bottom: 20px">
        <el-card>
          <h4 class="title" style="margin-bottom: 20px">作品信息</h4>
          <el-form :model="ArticleParams" :rules="rules" ref="myForm">
            <el-form-item prop="title">
              <el-input
                placeholder="请输入作品名称"
                v-model="ArticleParams.title"
              />
            </el-form-item>
            <el-form-item prop="categoryId">
              <el-select
                v-model="ArticleParams.categoryId"
                class="m-2"
                placeholder="请选择作品类型"
                size="large"
                prop="categoryId"
              >
                <el-option
                  v-for="item in categoryList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="content">
              <el-input
                placeholder="作品说明"
                type="textarea"
                v-model="ArticleParams.content"
              />
            </el-form-item>
            <el-form-item prop="imgList">
              <el-upload
                v-model:file-list="ArticleParams.imgList"
                action="/api/file/uploadImg"
                list-type="picture-card"
                :multiple="true"
                :auto-upload="true"
                :on-preview="handlePictureCardPreview"
                :on-remove="handleRemove"
                :on-change="handleImgChange"
              >
                <template #tip>
                  <div class="el-upload__tip">上传作品图片（JPG/PNG）</div>
                </template>
                <el-icon>
                  <Plus />
                </el-icon>
              </el-upload>
              <el-dialog v-model="dialogVisible">
                <img w-full :src="dialogImageUrl" alt="Preview Image" />
              </el-dialog>
            </el-form-item>
            <el-form-item>
              <div style="margin-top: 20px; margin-bottom: 20px">
                <el-checkbox-group v-model="checkTag" size="small">
                  <el-checkbox-button
                    v-for="item in tag"
                    :key="item.tagName"
                    :label="item.tagName"
                  >
                    {{ item.tagName }}
                  </el-checkbox-button>
                </el-checkbox-group>
              </div>
            </el-form-item>
            <el-form-item label="上传作品封面" prop="img">
              <Cropper
                @img="handleImg"
                @deleteImg="handleDelImg"
                :fixedNumbers="[1.4, 1]"
                :cWidth="280"
                :cHeight="200"
                :borderRadius="false"
                :uploadImg="true"
              ></Cropper>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="end">
        <button class="public" @click="handleArtPush">发布</button>
        <button class="preview" @click="handleArtPre">预览</button>
      </div>
    </div>
    <el-dialog v-model="Visible" title="预览作品" width="50%">
      <div class="big">
        <div class="detail-contaier">
          <div class="header">
            <h1 style="text-align: left">{{ ArticleParams.title }}</h1>
            <div class="userInfo">
              <div class="avatar">
                <img
                  :src="userStore.avatar"
                  alt=""
                  style="width: 50px; height: 50px"
                />

                <div class="user">
                  <h4 style="text-align: left">{{ userStore.username }}</h4>
                  <p><span>湖南&nbsp;</span><span>设计师&nbsp;</span></p>
                </div>
              </div>
              <div class="operate">
                <button class="email" :disabled="true">收藏</button>
                <button class="consider" :disabled="true">关注</button>
              </div>
            </div>
          </div>
          <div class="content">
            <div class="contentText">
              <p>{{ ArticleParams.content }}</p>
            </div>
            <div
              class="imgbox"
              v-for="item in ArticleParams.imgUrls"
              :key="item.id"
            >
              <img :src="item.url ? item.url : item" alt="" />
              <p v-if="ArticleParams.direction">雪山</p>
            </div>
          </div>
          <div class="footer">
            <div class="comment-opera">
              <div class="thumb">
                <svg
                  t="1697530681602"
                  class="icon"
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2403"
                  width="50"
                  height="50"
                  :aria-disabled="true"
                >
                  <path
                    d="M729.6 896H426.666667c-38.4 0-72.533333-12.8-102.4-34.133333-17.066667 21.333333-38.4 34.133333-68.266667 34.133333H170.666667c-46.933333 0-85.333333-38.4-85.333334-85.333333v-298.666667c0-46.933333 38.4-85.333333 85.333334-85.333333h128c72.533333 0 128-55.466667 128-128V256c0-72.533333 55.466667-128 128-128s128 55.466667 128 128v170.666667h85.333333c72.533333 0 128 55.466667 128 128v8.533333l-42.666667 213.333333c-17.066667 72.533333-68.266667 119.466667-123.733333 119.466667zM341.333333 725.333333c0 46.933333 38.4 85.333333 85.333334 85.333334h298.666666c17.066667 0 34.133333-17.066667 42.666667-51.2l42.666667-209.066667c0-21.333333-21.333333-38.4-42.666667-38.4h-128c-25.6 0-42.666667-17.066667-42.666667-42.666667V256c0-25.6-17.066667-42.666667-42.666666-42.666667s-42.666667 17.066667-42.666667 42.666667v42.666667c0 102.4-72.533333 187.733333-170.666667 209.066666V725.333333z m-170.666666-213.333333v298.666667h85.333333v-298.666667H170.666667z"
                    p-id="2404"
                  ></path>
                </svg>
                <h4>{{ ArticleParams.hits }}</h4>
              </div>
            </div>

            <div class="tag">
              <div><a href="#">原创</a></div>
              <div><a href="#">平面设计</a></div>
              <div><a href="#">简洁</a></div>
            </div>
          </div>
        </div>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button
            @click="
              () => {
                Visible = false;
              }
            "
            >退出</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useCounterStore } from "@/stores/user";
import { reqArticleAdd } from "@/api/acticle/index";
import { reqArticleCategory } from "@/api/acticle/index";
import { ElMessage, type UploadProps, type UploadUserFile } from "element-plus";
import { useRouter } from "vue-router";
import { useArticleStore } from "@/stores/article";
import Cropper from "@/components/Cropper/Cropper.vue";
const dialogImageUrl = ref("");
const dislogBgUrl = ref("");
const dialogVisible = ref(false);
const dialogBgVisible = ref(false);
const userStore = useCounterStore();
const disabled = ref(false);
const router = useRouter();
let categoryList = ref([]);
const myForm = ref();
let composeBg = ref([]);
//村粗已有的spu对象
let ArticleParams = ref({
  img: "",
  userId: 0,
  title: "",
  categoryId: "",
  content: "",
  imgUrls: [],
  imgList: [],
});
// 剪裁上传参数
const cropperModel = ref(false);
const cropperName = ref("");
const imgName = ref("");
const imgVisible = ref(false);
// 获取组件实例
const clipperRef = ref();
// 引入仓库文件
const articleStore = useArticleStore();
// 控制预览窗口
const isPreview = ref(false);

const Visible = ref(false);
const resetForm = () => {
  ArticleParams.value = {
    img: "",
    userId: 0,
    title: "",
    categoryId: "",
    content: "",
    imgUrls: [],
    imgList: [],
  };
  imgList.value = [];
};
const handleDelImg = () => {
  ArticleParams.value.img = "";
  myForm.value.validateField("img");
};
const handleImg = (data) => {
  console.log(data);
  ArticleParams.value.img = data;
  myForm.value.validateField("img");
};
onMounted(async () => {
  await resetForm();
  if (userStore.token == "") {
    router.push("/home");
  }
  let res = await reqArticleCategory();
  if ((res.code = 200)) {
    console.log(res);
    categoryList.value = res.data;
    console.log(categoryList.value);
  } else {
    return;
  }
});
// 选中的biaoq
let checkTag = ref(["人文"]);
// 所有标签
const tag = ref([
  {
    tagName: "社会",
    id: 0,
  },
  {
    tagName: "科学",
    id: 1,
  },
  {
    tagName: "人文",
    id: 2,
  },
  {
    tagName: "历史",
    id: 3,
  },
]);
const ValidatorSelectId = (rule: any, value: any, callback: any) => {
  if (value.categoryId !== "") {
    callback();
  } else {
    callback(new Error("作品分类能为空！"));
  }
};
const validatorTitle = (rule: any, value: any, callback: any) => {
  if (value.length !== 0) {
    callback();
  } else {
    callback(new Error("作品名称不能为空！"));
  }
};
const validatorContent = (rule: any, value: any, callback: any) => {
  if (value.length !== 0) {
    callback();
  } else {
    callback(new Error("作品内容不能为空！"));
  }
};
const ValidatorSelectImg = (rule: any, value: any, callback: any) => {
  if (value.length !== 0) {
    callback();
  } else {
    callback(new Error("至少上传一张图片！"));
  }
};

// 创建表单验证规则
const rules = {
  title: [
    {
      //required配置表单是否必填 message错误的提示信息 trigger 触发校验的时机
      // required: true, message: '用户名不能为空！', trigger: 'blur'
      trigger: "change",
      required: true,
      validator: validatorTitle,
    },
  ],
  content: [
    {
      //required配置表单是否必填 message错误的提示信息 trigger 触发校验的时机
      // required: true, message: '用户名不能为空！', trigger: 'blur'
      trigger: "change",
      required: true,
      validator: validatorContent,
    },
  ],
  categoryId: [
    {
      trigger: "change",
      validator: ValidatorSelectId,
      required: true,
    },
  ],
  imgList: [{ required: true, validator: ValidatorSelectImg, trigger: "blur" }],
  img: [
    {
      required: true,
      validator: ValidatorSelectImg,
      trigger: "blur",
    },
  ],
};
const imgList = ref<any>([]);

// 处理预览事件
const handleArtPre = async () => {
  await myForm.value.validate();
  ArticleParams.value.imgUrls = ArticleParams.value.imgList.map((item) => {
    return item.response[0];
  });
  Visible.value = true;
};
// 图片上传移除
const handleRemove: UploadProps["onRemove"] = (uploadFile, uploadFiles) => {
  console.log(uploadFile, uploadFiles);
  myForm.value.validateField("imgList");
};
// 图片上传预览
const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
  console.log(uploadFile);
};
// 图片上传选择
const handleImgChange: UploadProps["onChange"] = (uploadFile) => {
  myForm.value.validateField("imgList");
};

// 添加文章
const handleArtPush = async () => {
  await myForm.value.validate();
  ArticleParams.value.imgUrls = ArticleParams.value.imgList.map((item) => {
    return item.response[0];
  });
  ArticleParams.value.userId = userStore.userId;
  let res = await reqArticleAdd(ArticleParams.value);
  if ((res.code = 200)) {
    ElMessage({
      type: "success",
      message: "发布成功！",
    });
    router.push("/home");
  } else {
    return Promise.reject(new Error("失败！"));
  }
};
const value = ref("插画");
</script>
<style lang="scss">
.upload-list-cover {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  padding: 0 40px;
  align-items: center;
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  transition: opacity 1s;
}
.cover_icon {
  font-size: 30px;
}
.upload-btn {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-wrap: wrap;
  flex-wrap: wrap;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid #cccccc;
  border-radius: 5px;
  overflow: hidden;
  box-shadow: 0 0 1px #cccccc;
}
.upload-btn:hover {
  border: 1px solid #69b7ed;
}
.upload-btn i {
  margin: 5px;
}

.left {
  display: flex;
  justify-items: center;
  height: fit-content;
  li {
    width: 200px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(255, 196, 0);
    &:hover {
      cursor: pointer;
      background-color: rgb(255, 196, 0);
    }
  }
}
.end {
  .public,
  .preview {
    height: 40px;
    width: 120px;
  }
  .public {
    background-color: rgb(250, 226, 8);
    border: none;
    margin-right: 20px;
    &:hover {
      background-color: rgb(255, 196, 0);
    }
  }
  .preview {
    background-color: #fff;
    border: none;
    margin-right: 20px;
    &:hover {
      background-color: rgb(255, 196, 0);
    }
  }
}

.tabbar {
  height: 65px;
}
.created-container {
  display: flex;
  margin: 0 auto;
  margin-top: 10px;
  width: 1200px;
  max-width: 1500px;
  .left {
    flex: 1;
    margin-right: 50px;
  }
  .right {
    flex: 3;
  }
}
</style>
<style lang="scss" scoped>
a {
  color: rgb(65, 65, 65);
  text-decoration: none;
}
.BrandForm {
  margin: 0 auto;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
}
.big {
  margin-top: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 90%;
  padding-bottom: 40px;
  .detail-contaier {
    overflow: hidden;

    width: 100%;
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
