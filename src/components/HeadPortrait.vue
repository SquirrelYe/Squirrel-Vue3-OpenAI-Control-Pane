<template>
  <div class="head-portrait">
    <img :src="imgUrl" alt="" />
  </div>
</template>

<script lang="ts" setup>
import { USER_HEAD_IMG_URL } from '@/store/mutation-types';

defineProps({
  imgUrl: { default: USER_HEAD_IMG_URL, type: String }
});
</script>

<style lang="scss" scoped>
.head-portrait {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgb(255, 255, 255);
  position: relative;
  &::before {
    content: '';
    width: 15px;
    height: 15px;
    z-index: 1;
    display: block;
    border-radius: 50%;
    background-color: rgb(144, 225, 80);
    position: absolute;
    right: 0;
  }
  img {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    box-sizing: border-box;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    vertical-align: middle;
  }
}
</style>
