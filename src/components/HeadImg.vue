<template>
  <div class="head-portrait">
    <img :src="imgUrl" alt="Kevin Powell" />
  </div>
</template>

<script lang="ts" setup>
import { USER_HEAD_IMG_URL } from '@/store/mutation-types';

defineProps({
  imgUrl: { default: USER_HEAD_IMG_URL, type: String }
});
</script>

<style lang="scss" scoped>
img {
  --s: 75px; /* image size */
  --b: 3px; /* border thickness */
  --c: #255b98; /* border color */
  --cb: #a34c4c; /* background color */
  --_g: content-box no-repeat center / calc(100% / var(--f)) 100%; /* content-box: 内容区域开始显示背景图 放大后背景图大小不变 */
  --_o: calc((1 / var(--f) - 1) * var(--s) / 2 - var(--b)); /* offset 相对于原来的长度，所以放大的长度-原来的长度除以2在除以倍数 */
  --f: 0.9;
  width: var(--s);
  cursor: pointer;
  transform: scale(var(--f));
  transition: 0.45s;
  border-radius: 999px;
}
img:hover {
  --f: 1;
}
</style>
