<template>
  <div class="setting">
    <el-container> </el-container>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

const isShowProfile = ref(false);

onMounted(() => {
  setTimeout(() => {
    isShowProfile.value = true;
  }, 100);
});
</script>

<style>
.transition-box {
  text-align: center;
  margin-top: 5%;
  color: #f2f6fc;
  font-size: 30px;
}
h1 {
  color: aliceblue;
  font-size: 80px;
}
a {
  text-decoration: none;
  color: #67c23a;
}
</style>
