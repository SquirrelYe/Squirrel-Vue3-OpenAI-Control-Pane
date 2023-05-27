<template>
  <div>
    <!-- 上传 -->
    <div class="fineTune boxinput" @click="handleSyncOperation('file:upload')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      <input type="file" ref="refFileInput" style="display: none" @change="e => handleAsyncOperation('file:upload:change', e)" />
      <SvgIcon name="upload" size="25" style="margin-right: 10px"></SvgIcon>
      {{ $t('file.upload') }}
    </div>

    <!-- 删除 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('file:delete')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      <span class="iconfont icon-shanchu" style="color: #fff; margin-right: 10px"></span>
      {{ $t('file.delete') }}
    </div>

    <!-- 检索文件 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('file:retrieve')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('file.retrieve') }}
    </div>

    <!-- 查看文件内容 -->
    <div class="fineTune boxinput" @click="handleAsyncOperation('file:retrieve:content')" style="margin-left: 0px; margin-right: 0px; width: 99%">
      {{ $t('file.view') }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElNotification } from 'element-plus';
import { Configuration, OpenAIApi } from 'openai';

import { copyToClipboardWithMessage } from '@/utils/util';
import { getNowTime, formatDateTime, formatTimestamp } from '@/utils/util';
import { uploadFile, deleteFile, retrieveFile } from '@/api/getData';
import { AI_HEAD_IMG_URL } from '@/store/mutation-types';

const { t: $t } = useI18n();

const emits = defineEmits(['update:settingInfo']);
const props = defineProps({
  settingInfo: { type: Object, default: () => ({}) },
  fileInfo: { type: Object, default: () => ({}) },
  defaulWidth: { type: Number, default: 70 },
  getFileList: { type: Function, default: () => {} },
  sendMsg: { type: Function, default: () => {} }
});

const SettingInfo = ref(props.settingInfo);
const refFileInput = ref(null);

watch(props.settingInfo, val => (SettingInfo.value = val));
watch(SettingInfo, val => emits('update:settingInfo', val));

// file:upload -> 上传文件
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'file:upload': {
      refFileInput.value.click();
      break;
    }
    default:
      break;
  }
};

// file:upload:change -> 上传文件变化
// file:delete -> 删除文件
// file:retrieve -> 检索文件
// file:retrieve:content -> 检索文件内容
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    case 'file:upload:change': {
      // 获取文件
      const file = args.target.files[0];
      // 验证文件类型是否为jsonl格式
      if (!file.name.endsWith('.jsonl')) {
        ElNotification.warning($t('message.valid_json'));
        return;
      }
      // 通过验证后，上传文件
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'fine-tune');
      const res = await uploadFile(formData, SettingInfo.value.openaiKey);
      copyToClipboardWithMessage(res.id, $t('index.up_file_id') + res.id + $t('index.copy'));
      // 更新文件列表
      props.getFileList(SettingInfo.value.openaiKey);
      break;
    }
    case 'file:delete': {
      if (!props.fileInfo || !props.fileInfo.fileId) ElNotification.error($t('message.only_del_file'));
      else {
        deleteFile(props.fileInfo.fileId, SettingInfo.value.openaiKey)
          .then(() => {
            ElNotification.success($t('message.del_file_succ'));
            // 更新文件列表
            props.getFileList(SettingInfo.value.openaiKey);
          })
          .catch(e => {
            ElNotification.error($t('message.del_fail'));
          });
      }
      break;
    }
    case 'file:retrieve': {
      if (!props.fileInfo || !props.fileInfo.fileId) ElNotification.error($t('message.only_file'));
      else {
        retrieveFile(props.fileInfo.fileId, SettingInfo.value.openaiKey)
          .then(res => {
            const context =
              $t('index.file_id') +
              res.id +
              '  \n' +
              $t('index.file_name') +
              res.filename +
              '  \n' +
              $t('index.file_size') +
              (res.bytes / 1024 / 1024).toFixed(2) +
              'MB \n' +
              $t('index.obj') +
              res.object +
              '  \n' +
              $t('index.status') +
              res.status +
              '  \n' +
              $t('index.status_des') +
              res.status_details +
              '  \n' +
              $t('index.target') +
              res.purpose +
              ' \n' +
              $t('index.file_time') +
              formatTimestamp(res.created_at);

            const retrieveFineTuneMsg = {
              headImg: AI_HEAD_IMG_URL,
              name: res.filename,
              time: formatDateTime(getNowTime()),
              msg: context,
              chatType: 0,
              uid: res.id
            };

            // 发送消息
            props.sendMsg(retrieveFineTuneMsg);
          })
          .catch(e => {
            ElNotification.error($t('message.fail_file'));
          });
      }
      break;
    }
    case 'file:retrieve:content': {
      if (!props.fileInfo || !props.fileInfo.fileId) ElNotification.error($t('message.only_file'));
      else {
        try {
          const configuration = new Configuration({ apiKey: SettingInfo.value.openaiKey });
          const openai = new OpenAIApi(configuration);
          const response = await openai.downloadFile(props.fileInfo.fileId);
        } catch (e) {
          ElNotification.error($t('message.openai_free'));
        }
      }
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
