<template>
  <div>
    <div class="block">
      <input class="weitiao" v-model="roleSearch" :placeholder="$t('placeholder.role_name')" />
    </div>
    <div class="personList" v-for="promptInfo in promptList" :key="promptInfo.act" @click="handleRoleClick(promptInfo)">
      <RoleCard :promptInfo="promptInfo" :prCurrent="currentPrompt"></RoleCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ElNotification } from 'element-plus';
import { useI18n } from 'vue-i18n';
import RoleCard from '@/components/RoleCard.vue';

import { getRoles } from '@/api/getData';

const { t: $t } = useI18n();
const props = defineProps({
  isShowChatWindow: { type: Boolean, default: false },
  inputMessage: { type: Function, default: () => {} }
});

const currentPrompt = ref(''); // 当前点击的角色
const roleSearch = ref(''); // 当前搜索的角色
const promptList = ref([]); // 角色列表
const roleCacheList = ref([]); // 角色列表缓存

onMounted(async () => {
  try {
    const res = await getRoles();
    let data = res.data;
    promptList.value = data;
    roleCacheList.value = data;
  } catch (error) {
    ElNotification.error($t('message.get_roles_fail'));
  }
});

watch(roleSearch, newVal => {
  if (newVal) promptList.value = roleCacheList.value.filter(role => role.act.toLowerCase().includes(newVal.toLowerCase()));
  else promptList.value = roleCacheList.value;
});

const handleRoleClick = (promptInfo: any) => {
  currentPrompt.value = promptInfo.act;
  if (!props.isShowChatWindow) ElNotification.error($t('请选一个模型'));
  else props.inputMessage(promptInfo.prompt);
};
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
