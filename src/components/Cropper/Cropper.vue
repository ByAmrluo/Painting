<template>
  <div>
    <!-- cropper str -->
    <div
      class="imgCorpper"
      v-if="!cropperObj.imgShow"
      @click="cropperObj.openCropperView"
    >
      <el-icon><Plus /></el-icon>
    </div>
    <div
      class="imgCorpper"
      v-else
      @mouseenter="cropperObj.buttonopen"
      @mouseleave="cropperObj.buttonexit"
    >
      <div class="imgCorpperY">
        <el-image
          :src="cropperObj.previewsImgUrl"
          :zoom-rate="1.2"
          :preview-src-list="cropperObj.srcList"
          :initial-index="4"
          :style="props.borderRadius ? { borderRadius: '140px' } : '0px'"
          fit="cover"
        />
        <el-image-viewer
          ref="previewViewer"
          style="z-index: 10"
          v-if="cropperObj.showImageViewer"
          :on-close="cropperObj.closeImgView"
          @close="cropperObj.closeImgView"
          :url-list="cropperObj.srcList"
        />
        <div :class="cropperObj.showBack ? 'imgcurrent show' : 'imgcurrent'">
          <div
            class="imgBack"
            :style="props.borderRadius ? { borderRadius: '140px' } : '0px'"
          ></div>
          <div class="imgicon">
            <el-icon @click="cropperObj.showPic" style="margin-right: 20px"
              ><ZoomIn
            /></el-icon>
            <el-icon @click="cropperObj.delePic" size="30px"
              ><Delete
            /></el-icon>
          </div>
        </div>
      </div>
    </div>
    <CropperImage
      v-if="cropperObj.cVisible"
      :dialogVisible.sync="cropperObj.cVisible"
      :title="cropperObj.ctitle"
      :cWidth="props.cWidth"
      :cHeight="props.cHeight"
      :limit="1"
      :fileSize="10"
      :borderRadius="props.borderRadius"
      :fixedNumbers="props.fixedNumbers"
      :fileType="cropperObj.fileTypeList"
      @cropperImgMethod="cropperObj.cropperImgMethod"
      @closeCropperDialog="cropperObj.closeCropperView"
    ></CropperImage>
    <!-- cropper end -->
  </div>
</template>

<script setup>
// 图片上传裁剪 str
import CropperImage from "@/components/CopperImg/CropperImage.vue";
import { ref, reactive, onMounted } from "vue";
const emits = defineEmits(["img", "deleteImg"]);
const props = defineProps({
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
  imgShow: {
    type: Boolean,
    default: false,
  },
  previewViewer: {
    type: String,
    default: "",
  },
  // 是否开启表单验证
  uploadImg: {
    file: Boolean,
    default: false,
  },
});
const cropperObj = reactive({
  fileTypeList: props.fileType,
  cVisible: false, // 显示切图弹框
  ctitle: "", // 弹框标题
  imgShow: props.imgShow, //是否有图片
  previewsImgUrl: props.previewViewer,
  srcList: [], //图片预览地址数组
  showBack: false, // 预览删除图层是否展示
  showImageViewer: false, // 是否预览
  previewViewer: "",
  // 开启剪切弹框
  openCropperView: () => {
    console.log("ddds");
    cropperObj.ctitle = "图片剪切";
    cropperObj.cVisible = true;
  },
  // 关闭弹框所触发的事件
  closeCropperView: (data) => {
    cropperObj.cVisible = false;
  },
  // 剪切图地址
  cropperImgMethod: (data) => {
    emits("img", data);
    console.log(data);
    cropperObj.srcList = [];
    cropperObj.previewsImgUrl = data;
    console.log(cropperObj.previewsImgUrl);
    cropperObj.srcList = [cropperObj.previewsImgUrl];
    cropperObj.imgShow = true;
  },
  // 预览删除图层显示
  buttonopen: () => {
    cropperObj.showBack = true;
    cropperObj.srcList = [cropperObj.previewsImgUrl];
    console.log(cropperObj.previewsImgUrl);
    console.log(cropperObj.srcList);
  },
  // 预览删除图层隐藏
  buttonexit: () => {
    cropperObj.showBack = false;
  },
  // 预览展示
  showPic: () => {
    cropperObj.showImageViewer = true;
  },
  // 预览隐藏
  closeImgView: () => {
    cropperObj.showImageViewer = false;
    // previewViewer.value.showViewer = false
  },
  // 删除图片
  delePic: () => {
    if (props.uploadImg) {
      emits("deleteImg");
    }
    cropperObj.previewsImgUrl = "";
    cropperObj.srcList = [];
    cropperObj.showBack = false;
    cropperObj.imgShow = false;
  },
});
// 图片上传裁剪 end
</script>

<style lang="scss">
.imgCorpper {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  width: 148px;
  height: 148px;

  position: relative;
  border-radius: 6px;
  .el-icon {
    color: #909399;
  }
  .imgCorpperY {
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 6px;
    overflow: hidden;
    height: 100%;
    > img {
      width: 100%;
      height: 100%;
    }
    .el-image {
      width: 100%;
      height: 148px;
      max-height: 100%;
    }
    .imgcurrent {
      display: none;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      .imgBack {
        background: #00000082;
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 1;
      }
      .imgicon {
        position: absolute;
        width: 90%;
        margin: 0 5%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        z-index: 2;
        .el-icon {
          color: #fff;
          font-size: 30px;
        }
      }
    }
    > .show {
      display: block;
    }
  }
}
</style>
