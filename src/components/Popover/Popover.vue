<template>
  <el-popover
    :placement="placement"
    :width="width"
    :trigger="trigger"
    :popper-style="style"
    :popper-class="class"
  >
    <slot name="content"> </slot>
    <template #reference>
      <slot name="hover"></slot>
    </template>
  </el-popover>
</template>
<script lang="ts" setup>
const props = defineProps({
  width: {
    type: Number,
    default: 250,
  },
  height: {
    type: Number,
    default: 200,
  },
  placement: {
    type: String,
    default: "bottom",
  },
  trigger: {
    type: String,
    default: "hover",
  },
  style: {
    type: Object || String,
    default: {},
  },
  class: {
    type: String,
    default: "",
  },
});
</script>
<style lang="scss">
.personal-info {
  width: 250px;
  height: 75px;
  display: flex;
  flex-direction: column;
  .top {
    width: 250px;
    display: flex;
    flex-direction: row;
    align-items: center;
    .left {
      width: 60%;
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      .avatar {
        margin-right: 5px;
        img {
          width: 45px;
          height: 45px;
          border-radius: 45px;
        }
      }
      .detail {
        .title {
          h4 {
            font-size: 14px;
            font-weight: bold;
            &:hover {
              cursor: pointer;
              color: orange;
            }
          }
        }
        .person {
          span {
            font-size: 12px;
          }
        }
      }
    }
    .right {
      width: 30%;

      a {
        border: none;
        padding: 4px 22px;
        background-color: yellow;
        border-radius: 5px;
        &:hover {
          background-color: orange;
        }
      }
    }
  }
}
</style>
