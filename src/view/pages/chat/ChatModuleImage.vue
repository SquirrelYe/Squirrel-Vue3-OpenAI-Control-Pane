<template>
  <div>
    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('image.production_title')" placement="top">
        <span class="demonstration">{{ $t('image.production') }}</span>
      </el-tooltip>
      <el-switch v-model="SettingInfo.openProductionPicture" :width="defaulWidth" style=""></el-switch>
    </div>

    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('image.change_title')" placement="top">
        <span class="demonstration">{{ $t('image.change') }}</span>
      </el-tooltip>
      <el-switch v-model="SettingInfo.openChangePicture" :width="defaulWidth" style=""></el-switch>
    </div>

    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('image.size_title')" placement="top">
        <span class="demonstration">{{ $t('image.size') }}</span>
      </el-tooltip>
      <div>
        <el-select v-model="SettingInfo.size" placeholder="请选择" style="margin-top: 10px">
          <el-option v-for="item in imgSizes" :key="item.value" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>

    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('image.count_title')" placement="top">
        <span class="demonstration">{{ $t('image.count') }}</span>
      </el-tooltip>
      <el-slider class="astrict" v-model="SettingInfo.n" :step="1" :min="-1" :max="10"></el-slider>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emits = defineEmits(['update:settingInfo']);
const props = defineProps({
  settingInfo: { type: Object, default: () => ({}) },
  defaulWidth: { type: Number, default: 70 }
});

const SettingInfo = ref(props.settingInfo);
// 图片大小参数列表
const imgSizes = [{ value: '256x256' }, { value: '512x512' }, { value: '1024x1024' }];

watch(props.settingInfo, val => (SettingInfo.value = val));
watch(SettingInfo, val => emits('update:settingInfo', val));
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
