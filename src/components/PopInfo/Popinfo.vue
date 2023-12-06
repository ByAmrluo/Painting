<template>
  <Popover class="personal-info" placement="top" :item="item">
    <template #content>
      <div class="personal-info">
        <div class="top">
          <div class="left">
            <div class="avatar">
              <img
                :src="props.item.avatarUrl"
                alt=""
                class=".avatar"
                @click="() => $router.push(`/mypage/${props.item.userId}`)"
              />
            </div>
            <div class="detail">
              <div class="title">
                <h4 @click="() => $router.push(`/mypage/${props.item.userId}`)">
                  {{ props.item.username }}
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
      <slot name="hover"></slot>
    </template>
  </Popover>
</template>

<script lang="ts" setup>
import Popover from "@/components/Popover/Popover.vue";
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import { useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
// 接收传递过来的参数
const props = defineProps(["item"]);
onMounted(() => {
  console.log(12312312);
  console.log(props.item);
});
</script>
