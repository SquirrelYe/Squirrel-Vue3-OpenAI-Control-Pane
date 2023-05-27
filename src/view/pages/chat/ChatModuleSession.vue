<template>
  <div>
    <!-- 创建会话 -->
    <div class="session boxinput" @click="handleSyncOperation('session:new')">
      <SvgIcon name="contact" size="25" style="margin-right: 10px"></SvgIcon>
      {{ $t('session.create') }}
    </div>

    <!-- 导出会话列表 -->
    <div class="session boxinput" @click="handleSyncOperation('session:save')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      <span class="iconfont icon-daochu" style="color: #fff; margin-right: 10px"></span>
      {{ $t('session.export') }}
    </div>

    <!-- 导入会话列表 -->
    <div class="session boxinput" @click="handleSyncOperation('file:import:click')">
      <span class="iconfont icon-daoru" style="color: #fff; margin-right: 10px"></span>
      {{ $t('session.import') }}
      <input type="file" ref="refOnupdateJosnArrAll" @change="e => handleSyncOperation('session:upload:all', e)" style="display: none" />
    </div>

    <!-- 清除会话列表 -->
    <div class="session boxinput" @click="handleSyncOperation('session:clear')">
      <span class="iconfont icon-qingchu" style="color: #fff; margin-right: 10px"></span>
      {{ $t('session.clear') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { saveAs } from 'file-saver';

const props = defineProps({
  sessionList: { type: Array<any>, default: () => [] },
  sessionCurrent: { type: String, default: '' },
  getMesList: { type: Function, default: () => {} },
  clearMsgList: { type: Function, default: () => {} }
});
const emits = defineEmits(['update:sessionList', 'update:sessionCurrent']);

const refOnupdateJosnArrAll = ref(null);
const curSessionList = ref(props.sessionList);
const curSessionCurrent = ref(props.sessionCurrent);

watch(() => props.sessionList, val => (curSessionList.value = val));
watch(() => curSessionList.value, val => emits('update:sessionList', val));
watch(() => props.sessionCurrent, val => emits('update:sessionCurrent', val));

// file:import:click -> 触发选择文件的弹框
// session:new -> 创建会话
// session:save -> 保存会话
// session:upload:all -> 上传会话
// session:clear -> 清除会话
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'file:import:click': {
      refOnupdateJosnArrAll.value.click();
      break;
    }
    case 'session:new': {
      // 获取当前会话长度
      const currentLen = curSessionList.value.length + 1;
      // 定义对象
      const obj = { id: currentLen, title: '', dataList: [] };
      // 先获取对话的列表
      const msgList = props.getMesList();
      // 判断当前会话是否有内容
      if (msgList.length >= 2) {
        if (curSessionCurrent.value) {
          curSessionCurrent.value = '';
          // 清除当前窗口数据
          props.clearMsgList();
        } else {
          obj.title = msgList[msgList.length - 1].msg;
          obj.dataList = msgList;
          let tempSessionList = curSessionList.value;
          tempSessionList.push(obj);
          curSessionList.value = tempSessionList.reverse();
          curSessionCurrent.value = '';
          // 清除当前窗口数据
          props.clearMsgList();
        }
      }
      break;
    }
    case 'session:save': {
      const jsonString = JSON.stringify(curSessionList.value); // 将数组转为JSON字符串
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      saveAs(blob, 'data.json');
      break;
    }
    case 'session:upload:all': {
      const file = args.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result; // 文件内容
        const parsed = JSON.parse(fileContent.toString()); // 转换为数组
        curSessionList.value = parsed;
      };
      reader.readAsText(file);
      break;
    }
    case 'session:clear': {
      curSessionList.value = [];
      break;
    }
    default:
      break;
  }
};
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
