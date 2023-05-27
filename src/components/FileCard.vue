<template>
  <div class="file-card">
    <img src="/img/fileImg/unknowfile.png" alt="" v-if="fileType == 0" />
    <img src="/img/fileImg/word.png" alt="" v-else-if="fileType == 1" />
    <img src="/img/fileImg/excel.png" alt="" v-else-if="fileType == 2" />
    <img src="/img/fileImg/ppt.png" alt="" v-else-if="fileType == 3" />
    <img src="/img/fileImg/pdf.png" alt="" v-else-if="fileType == 4" />
    <img src="/img/fileImg/zpi.png" alt="" v-else-if="fileType == 5" />
    <img src="/img/fileImg/txt.png" alt="" v-else />

    <div class="word">
      <span>{{ file.name || $t('file_card.unknown') }}</span>
      <span>{{ file.size }} Bytes</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  fileType: { default: 0, type: Number },
  file: { default: {}, type: File },
  default: { default: {}, type: Object }
});

watch(
  () => props.file,
  () => console.log(props.file)
);

onMounted(() => {
  console.log(props.file, props.fileType);
});
</script>

<style lang="scss" scoped>
.file-card {
  width: 250px;
  height: 100px;
  background-color: rgb(45, 48, 63);
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    background-color: rgb(33, 36, 54);
  }
  img {
    width: 60px;
    height: 60px;
  }
  .word {
    width: 60%;
    margin-left: 10px;
    overflow: hidden;
    span {
      width: 90%;
      display: inline-block;
      color: #fff;
      text-align: left;
    }
    span:first-child {
      font-size: 14px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    span:last-child {
      font-size: 12px;
      color: rgb(180, 180, 180);
    }
  }
}
</style>
