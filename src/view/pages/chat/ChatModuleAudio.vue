<template>
  <div>
    <!-- 语言转文字 -->
    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('audio.to_text_title')" placement="top">
        <span class="demonstration">{{ $t('audio.to_text') }}</span>
      </el-tooltip>
      <el-switch v-model="SettingInfo.translateEnglish" :width="defaulWidth" style="margin-left: 15%"></el-switch>
    </div>

    <!-- 语言 -->
    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('audio.language_title')" placement="top">
        <span class="demonstration">{{ $t('audio.language') }}</span>
      </el-tooltip>
      <div>
        <el-select v-model="SettingInfo.language" placeholder="" style="margin-top: 10px">
          <el-option v-for="item in languages" :key="item.value" :value="item.value"> </el-option>
        </el-select>
      </div>
    </div>

    <!-- 随机度 -->
    <div class="block">
      <el-tooltip class="item" effect="dark" :content="$t('audio.temperature_title')" placement="top">
        <span class="demonstration">{{ $t('audio.temperature') }}</span>
      </el-tooltip>
      <el-slider class="astrict" v-model="SettingInfo.temperatureAudio" :step="0.1" :min="0" :max="1"></el-slider>
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
// 语音定义的参数
const languages = [{ value: 'zh' }, { value: 'en' }, { value: 'fr' }, { value: 'de' }, { value: 'ja' }];

watch(props.settingInfo, val => (SettingInfo.value = val));
watch(SettingInfo, val => emits('update:settingInfo', val));
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
