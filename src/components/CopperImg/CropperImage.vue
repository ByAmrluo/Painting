<template>
  <el-dialog
    :title="title"
    :modelValue="dialogVisible"
    :show-close="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="closeDialog"
    destroy-on-close
    width="900px"
  >
    <el-row>
      <el-col :xs="24" :md="12" :style="{ height: '350px' }">
        <div class="cropper-container">
          <!-- 待上传图片 -->
          <div v-show="!options.img">
            <el-upload
              class="upload"
              ref="elUpload"
              action="#"
              :on-change="upload"
              :accept="accpetType"
              :limit="limit"
              :on-exceed="handleExceed"
              :show-file-list="false"
              :auto-upload="false"
            >
              <el-button slot="trigger" type="primary" ref="uploadBtn">
                选择图片
              </el-button>
            </el-upload>
            <div>
              请上传
              <template v-if="fileSize">
                大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>
              </template>
              <template v-if="fileType">
                格式为 <b style="color: #f56c6c">{{ fileType.join("/") }}</b>
              </template>
              的文件
            </div>
          </div>
          <!-- 已上传图片 -->
          <div v-show="options.img" class="cropper-crop">
            <vueCropper
              class="crop-box"
              ref="cropper"
              :img="options.img"
              :info="true"
              :autoCrop="options.autoCrop"
              :fixedBox="options.fixedBox"
              :canMoveBox="options.canMoveBox"
              :autoCropWidth="options.autoCropWidth"
              :autoCropHeight="options.autoCropHeight"
              :centerBox="options.centerBox"
              :fixed="options.fixed"
              :fixedNumber="options.fixedNumber"
              :canMove="options.canMove"
              :canScale="options.canScale"
              @realTime="realTime"
              :mode="options.mode"
            ></vueCropper>
            <div class="show-preview" ref="mypre">
              <div
                class="preview"
                :style="{
                  ...options.previews.div,
                }"
                ref="myPreview"
              >
                <img
                  :src="options.previews.url"
                  :style="options.previews.img"
                />
              </div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
    <br />
    <el-row>
      <el-col :lg="2" :md="2">
        <div class="reupload" @click="reupload">
          <el-button type="primary" v-show="options.img"
            >重新上传<el-icon class="el-icon--right"><Upload /></el-icon
          ></el-button>
        </div>
      </el-col>
      <el-col :lg="{ span: 1, offset: 2 }" :md="2">
        <el-button icon="Plus" @click="changeScale(1)"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button icon="Minus" @click="changeScale(-1)"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button icon="RefreshLeft" @click="rotateLeft()"></el-button>
      </el-col>
      <el-col :lg="{ span: 1, offset: 1 }" :md="2">
        <el-button icon="RefreshRight" @click="rotateRight()"></el-button>
      </el-col>
      <el-col :lg="{ span: 2, offset: 6 }" :md="2">
        <el-button type="primary" @click="getCrop()">提 交</el-button>
      </el-col>
    </el-row>

    <template #footer>
      <span class="dialog-footer">
        <div>
          <el-button @click="closeDialog">取 消</el-button>
          <!-- <el-button type="primary" @click="getCrop">确 定</el-button> -->
        </div>
      </span>
    </template>
  </el-dialog>
</template>

<script>
import { getCurrentInstance } from "vue";
import { ref, reactive, onMounted, nextTick } from "vue";
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { ElMessage } from "element-plus";
import request from "@/util/request.ts"; //上传接口
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => {
        return false;
      },
    },
    title: {
      type: String,
      default: "",
    },
    cWidth: {
      type: [Number, String],
      default: "",
    },
    cHeight: {
      type: [Number, String],
      default: "",
    },
    // 图片数量限制
    limit: {
      type: Number,
      default: 5,
    },
    // 大小限制(MB)
    fileSize: {
      type: Number,
      default: 5,
    },
    // 文件类型
    fileType: {
      type: Array,
      default: () => ["png", "jpg", "jpeg"],
    },
    accpetType: {
      type: String,
      default: () => ".png,.jpg,.jpeg",
    },
    fixedNumbers: {
      type: Array,
      default: [1.2, 1],
    },
    borderRadius: {
      type: Boolean,
      default: false,
    },
  },

  components: {
    VueCropper,
  },
  setup(props, { emit }) {
    const { proxy } = getCurrentInstance();
    const cropper = ref();
    const mypre = ref();
    const uploadBtn = ref();
    const elUpload = ref();
    const options = reactive({
      img: "", // 原图文件
      autoCrop: true, // 默认生成截图框
      fixedBox: false, // 固定截图框大小
      canMoveBox: true, // 截图框可以拖动
      autoCropWidth: props.cWidth, // 截图框宽度
      autoCropHeight: props.cHeight, // 截图框高度

      // maxImgSize:,
      fixed: true, // 截图框宽高固定比例
      fixedNumber: props.fixedNumbers, // 截图框的宽高比例
      centerBox: true, // 截图框被限制在图片里面
      canMove: true, // 上传图片不允许拖动
      canScale: true, // 上传图片不允许滚轮缩放
      previews: {}, //预览数据
    });
    // vueCropper组件 裁剪配置信息

    // 实时预览

    const realTime = (data) => {
      // options.previews = data;
      let previews = data;
      let raduis = props.borderRadius ? "140px" : "0px";
      console.log(props.borderRadius);
      let h = 0.5;
      let w = 0.2;
      console.log(data);
      options.previews = {
        // width: previews.w + "px",
        // height: previews.h + "px",
        url: previews.url,
        img: previews.img,
        div: { ...previews.div, borderRadius: raduis },
        overflow: "hidden",
        margin: "0",
        zoom: h,
      };
    };
    //
    // 文件个数超出
    const handleExceed = () => {
      ElMessage.error(`上传数量不能超过 ${props.limit} 个!`);
    };
    // 读取原图
    const upload = (file, uploadFiles) => {
      //console.log(file);
      let isImg = false;
      let fileExtension = "";
      if (props.fileType.length) {
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        isImg = props.fileType.some((type) => {
          if (file.raw.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
      } else {
        isImg = file.type.indexOf("image") > -1;
      }
      if (!isImg) {
        ElMessage.error(
          `格式不正确, 请上传${props.fileType.join("/")}图片格式文件!`
        );
        return false;
      } else {
        isImg = true;
      }
      if (props.fileSize) {
        const isLt = file.size / 1024 / 1024 < props.fileSize;
        if (!isLt) {
          proxy.$modal.msgError(`上传大小不能超过 ${props.fileSize} MB!`);
          fileList.value = [];
          return false;
        }
      }

      /*
        const isIMAGE = file.raw.type === 'image/jpeg' || file.raw.type === 'image/png'
        const isLt5M = file.raw.size / 1024 / 1024 < 5
        if (!isIMAGE) {
          ElMessage.warning("请选择 jpg、png 格式的图片" );
          return false
        }
        if (!isLt5M) {
          ElMessage.warning("图片大小不能超过 5MB" );
          return false
        }
      */
      let reader = new FileReader();

      reader.readAsDataURL(file.raw);
      //console.log(reader);

      reader.onload = (e) => {
        options.img = e.target.result; // base64
      };
      elUpload.value.clearFiles(); //这里处理重新上传时，upload组件change事件错误问题
    };
    // 获取截图信息
    const getCrop = () => {
      // 获取截图的 base64 数据
      cropper.value.getCropData((data) => {});
      // 获取截图的 blob 数据
      cropper.value.getCropBlob((data) => {
        let formData = new FormData();
        //第三个参数是规定以什么为后缀，接口是根据后缀来返回地址格式的
        formData.append("file", data, "chris.jpg");
        //上传接口

        request.post("/file/uploadImg", formData).then((res) => {
          console.log("222-res", res[0]);
          emit("cropperImgMethod", res[0]);
          closeDialog();
        });
        // emit("closeCropperDialog");
        // closeDialog();
      });
    };
    // 重新上传
    const reupload = () => {
      uploadBtn.value.ref.click();
    };
    // 关闭弹框
    const closeDialog = () => {
      emit("closeCropperDialog");
      options.img = "";
    };
    /** 向左旋转 */
    const rotateLeft = () => {
      proxy.$refs.cropper.rotateLeft();
    };
    /** 向右旋转 */
    const rotateRight = () => {
      proxy.$refs.cropper.rotateRight();
    };
    /** 图片缩放 */
    const changeScale = (num) => {
      num = num || 1;
      proxy.$refs.cropper.changeScale(num);
    };

    return {
      options,
      cropper,
      uploadBtn,
      elUpload,
      realTime,
      handleExceed,
      rotateLeft,
      rotateRight,
      changeScale,
      upload,
      getCrop,
      reupload,
      closeDialog,
    };
  },
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  font-size: 14px;
  .reupload {
    color: #409eff;
    cursor: pointer;
  }
}
.cropper-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  margin-right: 10px;
  border-radius: 4px;
  .upload {
    text-align: center;
    margin-bottom: 24px;
  }
  .cropper-crop {
    width: 560px;
    height: 350px;
    position: relative;
    .crop-box {
      width: 100%;
      height: 100%;
      border-radius: 4px;
      overflow: hidden;
    }
  }
  .show-preview {
    position: absolute;
    top: 25%;
    right: -70%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .preview {
      overflow: hidden;
      background: #cccccc;
    }
  }
}
</style>
