<template>
  <!-- svg 图标外层容器
    x-link:href 执行用哪一个图标，属性用#开头  icon+图标名 fill 图标颜色 -->
  <div class="tabbar" v-if="userStore.isTarbar">
    <Tarbar></Tarbar>
  </div>

  <router-view style="margin-bottom;: 50px"></router-view>
  <div class="footer" v-if="userStore.isLogin">
    <Footer></Footer>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from "vue-router";
import Tarbar from "@/components/Tabbar/Tabbar.vue";
import Footer from "@/components/Footer/Footer.vue";
import { useCounterStore } from "@/stores/user";
import { onMounted, ref } from "vue";
const isLogin = ref(true);
const route = useRoute();
const userStore = useCounterStore();
onMounted(() => {
  userStore.isTarbar = true;
  if (route.path.includes("/login")) {
    userStore.isLogin = false;
  }
});
</script>

<style lang="scss">
.tabbar {
  height: 65px;
}
</style>
