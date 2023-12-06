<template>
  <!-- 顶部导航栏 -->

  <div class="swipe">
    <Swiper></Swiper>
  </div>

  <div class="content">
    <div class="top-nav" @click="handleClick($event)" ref="mydiv">
      <li class="top-nav-li">
        <a href="#" data-name="Recommend">推荐</a>
      </li>
      <li><a href="#" data-name="Category">分类</a></li>
      <li><a href="#" data-name="New">最新</a></li>
      <li><a href="#" data-name="Collection">收藏</a></li>
    </div>
    <div class="content-main">
      <component :is="component" @toRecommend="handleToRecommend"></component>
    </div>
  </div>
</template>

<script lang="ts" setup>
import Swiper from "@/components/Swiper/Swiper.vue";
import Recommend from "../Home/components/Recommend.vue";
import Category from "./components/Category.vue";
import Collection from "./components/Collection.vue";
import Like from "./components/Like.vue";
import New from "./components/New.vue";
import { nextTick, ref, onMounted, shallowRef } from "vue";
import { useCounterStore } from "@/stores/user";
const userStore = useCounterStore();
// 盒子状态
const mytarbar = ref();
const mydiv = ref();
const ishow = ref(false);

let components: any = {
  Recommend,
  Category,
  Collection,
  Like,
  New,
};
let component = shallowRef(Recommend);
onMounted(() => {
  userStore.isTarbar = true;
  component = shallowRef(Recommend);
  // 初始化列表样式
  let old = document.querySelector(".top-nav-li");
  let topNav = document.querySelector(".top-nav");
  if (old) {
    old.classList.remove("top-nav-li");
    old.children[0].style.color = "#999999";
  }
  topNav?.firstChild.classList.add("top-nav-li");

  mydiv.value.firstChild.firstChild.style.color = "black";
});
const handleClick = (event: MouseEvent | any) => {
  if (event.target.tagName == "A") {
    let old = document.querySelector(".top-nav-li");
    if (old) {
      old.classList.remove("top-nav-li");
      old.children[0].style.color = "#999999";
    }
    nextTick(() => {
      component.value = components[event.target.dataset.name];
      event.target.parentNode.classList.add("top-nav-li");
      event.target.style.color = "black";
    });
  }
};
const handleToRecommend = (isRecommend: boolean) => {
  if (isRecommend == true) {
    let old = document.querySelector(".top-nav-li");
    if (old) {
      old.classList.remove("top-nav-li");
      old.children[0].style.color = "#999999";
    }
    mydiv.value.firstChild.classList.add("top-nav-li");
    mydiv.value.firstChild.firstChild.style.color = "black";
    console.log(mydiv.value.firstChild);

    component.value = components.Recommend;
    console.log(component.value);
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  background-color: white;
  z-index: -1;
  .content-main {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }

  .top-nav {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 65px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
    .top-nav-li {
      border-bottom: 1px solid black;
    }

    li {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 80px;
      height: 65px;

      a {
        display: block;
        padding: 23px 23px;
        color: #999999;
        letter-spacing: 2px;
      }

      &:hover {
        a {
          padding: 23px 23px;
          color: black;
        }
      }
    }
  }
}
</style>
