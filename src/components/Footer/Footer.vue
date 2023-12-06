<template>
  <div class="footer">
    <p
      @click="
        () => {
          isAcc = true;
        }
      "
    >
      下架请联系站长
    </p>
  </div>
  <el-dialog v-model="isAcc"> 邮箱：1012968001@qq.com </el-dialog>
</template>
<script ts="lang" setup>
import { ref } from "vue";
const isAcc = ref(false);
</script>
<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
  width: 100%;
  background-color: rgb(24, 23, 23);
  text-align: center;
  p {
    display: block;
    color: white;
    font-size: 16px;
    &:hover {
      cursor: pointer;
      color: red;
    }
  }
}
</style>
