<template>
  <div class="home" :class="{ 'is-pc': isPc }">
    <el-container height="100%">
      <el-aside width="100px" v-show="asideStatus">
        <Nav></Nav>
      </el-aside>

      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onBeforeMount, onMounted, onUnmounted } from 'vue';
import Nav from '@/components/Nav.vue';
import * as util from '@/utils/util';

const isPc = computed(() => util.isPc());

const asideStatus = ref(true);
const firstSize = ref(true);
const width = ref(0);

onBeforeMount(() => {
  window.addEventListener('resize', handleResize);
});

onMounted(() => {
  handleResize();
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

// 判断窗口尺寸是否小于1150px
const resize = () => {
  if (window.innerWidth <= 1150) {
    asideStatus.value = false;
  } else {
    asideStatus.value = true;
  }
};

// 监听窗口尺寸的变化
const handleResize = () => {
  if (firstSize.value) {
    resize();
    firstSize.value = false;
    width.value = window.innerWidth;
  }
  if (width.value != window.innerWidth) {
    resize();
    width.value = window.innerWidth;
  }
};
</script>

<style lang="scss" scoped>
.home {
  width: 95vw;
  height: 95vh;
  background-color: rgb(39, 42, 55);
  border-radius: 15px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.is-pc {
  width: 100vw;
  border-radius: unset;
}
</style>
