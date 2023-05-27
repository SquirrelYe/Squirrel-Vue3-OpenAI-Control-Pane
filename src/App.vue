<template>
  <Home @mousedown="windowMove(true)" @mouseup="windowMove(false)"></Home>
</template>

<script lang="ts" setup>
import Home from '@/view/Home.vue';
import { isPc } from '@/utils/util';

const windowMove = (canMove: boolean) => {
  if (isPc()) {
    import('electron').then(({ ipcRenderer }) => {
      ipcRenderer.send('window-move-open', canMove ?? false);
    });
  }
};
</script>

<style lang="scss">
.iconfont {
  font-family: 'iconfont' !important;
  font-style: normal;
  font-size: 25px;
  vertical-align: middle;
  color: rgb(117, 120, 137);
  transition: 0.3s;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
* {
  padding: 0;
  margin: 0;
  font-family: 'SSFY';
  font-size: 14px;
}
#app {
  width: 100vw;
  height: 100vh;
  background: url('/img/bj.png') no-repeat;
  background-size: cover;
  position: absolute;
}
::-webkit-scrollbar {
  display: none;
}
</style>
