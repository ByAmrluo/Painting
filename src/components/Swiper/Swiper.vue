<template>
  <div class="page-container">
    <div class="flex nav-box">
      <ul>
        <li
          class="nav-box-item"
          :class="tabIndex === index ? 'active' : ''"
          @click="changeTab(index)"
          v-for="(item, index) in tabList"
          :key="index"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <el-carousel
      height="400px"
      direction="vertical"
      ref="carousel"
      @setActiveItem="setActiveItem"
      :interval="3000"
      @change="changeItem"
    >
      <el-carousel-item v-for="(item, index) in imgArr" :key="item">
        <img
          :src="item"
          alt=""
          style="width: 100%; height: 400px"
          @click="
            () => $router.push(`/detail/${articleStore.ArticleAll[index].id}`)
          "
        />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useArticleStore } from "@/stores/article";
const articleStore = useArticleStore();
const tabList = ref([]);
const tabIndex = ref(0);
const carousel = ref();
const imgArr = ref([
  "https://img.zcool.cn/tubelocation/43ee655714e3000c0b10008d886a.jpg?x-oss-process=image/format,webp",
  "https://web-1300736412.file.myqcloud.com/image/website/17-2581696839060448.jpg",
  "../../../public/images/cb1.png",
  "../../../public/images/cb2.jpg",
  "../../../public/images/cb3.jpg",
  "../../../public/images/cb4.png",
  "../../../public/images/cb5.jpg",
]);
const changeItem = (e) => {
  tabIndex.value = e;
};
const setActiveItem = (index) => {
  carousel.value.setActiveItem(index);
};
const changeTab = (index) => {
  if (tabIndex.value === index) {
    return;
  }
  tabIndex.value = index;
  setActiveItem(index);
};
onMounted(async () => {
  await articleStore.getAllArticle();
  tabList.value = articleStore.ArticleAll.map((item) => {
    return item.title;
  });
  if (tabList.value.length > 7) {
    tabList.value = tabList.value.slice(0, 6);
  }
});
</script>
<style lang="scss" scoped>
.page-container {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.nav-box {
  border-radius: 20px;
  height: 340px;
  width: 180px;
  position: absolute;
  top: 90px;
  right: 50px;
  z-index: 100;
  line-height: 3em;
  background-color: rgba($color: rgb(68, 68, 68), $alpha: 0.4);
}
.nav-box-item {
  overflow: hidden;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  text-align: right;
  padding: 0 0.25rem /* 20/80 */;
  transition: all 0.6s linear;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.3);
}
.active {
  color: rgba(255, 255, 255, 1);
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
