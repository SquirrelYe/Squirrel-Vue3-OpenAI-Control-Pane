<template>
  <div>
    <!-- 更改背景图片 -->
    <div class="block">
      <el-tooltip class="item" effect="dark" content="将图片的url路径填入此处即可设置聊天背景。" placement="top">
        <span class="demonstration">聊天背景</span>
      </el-tooltip>
      <input class="inputs" v-model="SettingInfo.contentImageUrl" placeholder="设置聊天界面的背景URL" style="margin-top: 10px; width: 100%; margin-left: 0px; margin-right: 0px" />
    </div>

    <!-- 切换语言 -->
    <div class="session boxinput" @click="changeLanguage" style="margin-left: 0px; margin-right: 0px; margin-top: 20px">
      <span class="iconfont icon-iconyuanbanben_fanyi" style="color: #fff; margin-right: 10px"></span>
      {{ $t('setting.Language') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t, locale } = useI18n();

const emits = defineEmits(['update:settingInfo']);
const props = defineProps({ settingInfo: { type: Object, default: () => ({}) } });

const SettingInfo = ref(props.settingInfo);

watch(props.settingInfo, val => (SettingInfo.value = val));
watch(SettingInfo, val => emits('update:settingInfo', val));

// 切换语言
const changeLanguage = () => {
  const lang = locale.value === 'zh' ? 'en' : 'zh';
  localStorage.setItem('lang', lang);
  locale.value = lang;
};
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
