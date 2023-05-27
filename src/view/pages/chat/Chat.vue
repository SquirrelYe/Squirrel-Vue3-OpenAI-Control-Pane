<template>
  <div class="chatHome">
    <!-- 操作左侧折叠展示 -->
    <div class="top-left" @click="handleToggleLeft">
      <SvgIcon v-show="!isShowModelList" name="switch-left" size="30"></SvgIcon>
      <SvgIcon v-show="isShowModelList" name="switch-right" size="30"></SvgIcon>
    </div>

    <!-- 操作右侧折叠展示 -->
    <div class="top-right" @click="handleToggleRight">
      <SvgIcon v-show="!isShowSetupList" name="switch-right" size="30"></SvgIcon>
      <SvgIcon v-show="isShowSetupList" name="switch-left" size="30"></SvgIcon>
    </div>

    <!-- 左侧操作区域 -->
    <div class="chatSlider" style="width: 20%" v-show="isShowModelList">
      <div class="title" style="text-align: center">
        <h2>OpenAI Control Panel Vue3</h2>
      </div>

      <div class="online-person" style="margin-top: 5%">
        <!-- 选择操作模块 -->
        <el-row :gutter="24">
          <el-col :span="6">
            <div class="setting" style="text-align: center">
              <span class="" @click="sessionClick" :class="{ whiteText: cutSetting === 1 }">{{ $t('session.title') }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="setting" style="text-align: center">
              <span class="" @click="modelClick" :class="{ whiteText: cutSetting === 0 }">{{ $t('model.title') }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="setting" style="text-align: center">
              <span class="" @click="fineTuningClick" :class="{ whiteText: cutSetting === 2 }">{{ $t('slightly.title.whole') }}</span>
            </div>
          </el-col>
          <el-col :span="6">
            <div class="setting" style="text-align: center">
              <span class="" @click="fileClick" :class="{ whiteText: cutSetting === 3 }">{{ $t('file.title') }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 模型操作 -->
        <div v-show="cutSetting == 0">
          <input class="inputs" v-model="modelSearch" style="margin-top: 10px" :placeholder="$t('placeholder.model_name')" />
          <div class="s-wrapper" style="padding-left: 0; margin-top: 15px">
            <div class="personList" v-for="chatModel in chatModelList" :key="chatModel.id" @click="clickPerson(chatModel)">
              <ModelCard :chatModelInfo="chatModel" :modelCurrent="modelCurrent"></ModelCard>
            </div>
          </div>
        </div>

        <!-- 会话 -->
        <div v-show="cutSetting == 1">
          <!-- <input class="inputs" v-model="sessionSearch" style="margin-top: 10px" :placeholder="$t('placeholder.session_name')" /> -->
          <div class="s-wrapper" style="padding-left: 0">
            <div v-for="sessionInfo in sessionList" :key="sessionInfo.id" @click="clickSession(sessionInfo)">
              <Session :sessionInfo="sessionInfo" :modelCurrent="sessionCurrent"></Session>
            </div>
          </div>
        </div>

        <!-- 微调 -->
        <div v-show="cutSetting == 2">
          <input class="inputs" v-model="fineTuningSearch" style="margin-top: 10px" :placeholder="$t('placeholder.slightly_name')" />
          <div class="s-wrapper">
            <div class="personList" v-for="fineTuningInfo in fineTuningList" :key="fineTuningInfo.id" @click="clickFineTuning(fineTuningInfo)">
              <ModelCard :chatModelInfo="fineTuningInfo" :modelCurrent="finetuneModelCurrent"></ModelCard>
            </div>
          </div>
        </div>

        <!-- 文件 -->
        <div v-show="cutSetting == 3">
          <input class="inputs" v-model="fileSearch" style="margin-top: 10px" :placeholder="$t('placeholder.file_name')" />
          <div class="s-wrapper">
            <div class="personList" v-for="(fileInfo, index) in fileList" :key="index" @click="clickFile(fileInfo)">
              <File :fileInfo="fileInfo" :modelCurrent="fileCurrent"></File>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间对话区域 -->
    <div class="chatContainer">
      <!-- 对话展示区域 -->
      <div v-if="isShowChatWindow" v-show="isShowMainContent">
        <ChatWindow ref="refChatWindow" :chatCompleteModelInfo="chatCompleteModelInfo" :settingInfo="SettingInfo" :chatModelType="chatModelType" @modelCardSort="modelCardSort"></ChatWindow>
      </div>

      <!-- 非对话展示区域 -->
      <div class="showIcon" v-else>
        <SvgIcon name="ai-chip" size="200"></SvgIcon>
      </div>
    </div>

    <!-- 右侧操作区域 -->
    <div class="chatSlider" v-show="isShowSetupList">
      <!-- 输入OpenAI Key区域 -->
      <el-card shadow="hover" class="inputKey" style="line-height: 120%; text-align: center">
        <div>
          <input
            class="inputs"
            v-model="SettingInfo.openaiKey"
            @focusout="getModelList(SettingInfo.openaiKey)"
            :placeholder="$t('placeholder.openai_key')"
            type="password"
            auto-complete="new-password"
            autocomplete="new-password"
            style="width: 100%; margin-left: 0px; margin-right: 0px"
          />
        </div>
      </el-card>

      <!-- 模块详细操作区域 -->
      <div class="online-person">
        <!-- 顶部模块分类 -->
        <el-row :gutter="20">
          <el-col :span="6" v-for="(setting, index) in getSettings" :key="index">
            <span class="setting" @click="SettingStatus = index" :class="{ active: SettingStatus === index }"> {{ setting.name }} </span>
          </el-col>
        </el-row>

        <!-- 下部详细操作区域 -->
        <div class="s-wrapper" style="height: 75vh">
          <!-- 对话设置 -->
          <el-collapse-transition>
            <ChatModuleComplete v-if="SettingStatus == 0" v-model:settingInfo="SettingInfo" :defaulWidth="defaulWidth" />
          </el-collapse-transition>

          <!-- 图片设置 -->
          <el-collapse-transition>
            <ChatModuleImage v-if="SettingStatus == 1" v-model:settingInfo="SettingInfo" :defaulWidth="defaulWidth" />
          </el-collapse-transition>

          <!-- 音频设置 -->
          <el-collapse-transition>
            <ChatModuleAudio v-if="SettingStatus == 2" v-model:settingInfo="SettingInfo" :defaulWidth="defaulWidth" />
          </el-collapse-transition>

          <!-- 微调 -->
          <el-collapse-transition>
            <ChatModuleFineTune
              v-if="SettingStatus == 3"
              :defaulWidth="defaulWidth"
              v-model:settingInfo="SettingInfo"
              v-model:cancelFineStatus="cancelFineStatus"
              v-model:fineTuningList="fineTuningList"
              v-model:fineTuningCacheList="fineTuningCacheList"
              :getFineTunessList="getFineTunessList"
              :sendMsg="sendMsg"
            />
          </el-collapse-transition>

          <!-- 文件 -->
          <el-collapse-transition>
            <ChatModuleFile v-if="SettingStatus == 4" v-model:settingInfo="SettingInfo" :defaulWidth="defaulWidth" :fileInfo="fileInfo" :getFileList="getFileList" :sendMsg="sendMsg" />
          </el-collapse-transition>

          <!-- 会话 -->
          <el-collapse-transition>
            <ChatModuleSession v-if="SettingStatus == 5" v-model:sessionList="sessionList" v-model:sessionCurrent="sessionCurrent" :getMesList="getMesList" :clearMsgList="clearMsgList" />
          </el-collapse-transition>

          <!-- 角色 -->
          <el-collapse-transition>
            <ChatModuleRole v-if="SettingStatus == 6" :isShowChatWindow="isShowChatWindow" :inputMessage="inputMessage" />
          </el-collapse-transition>

          <!-- 界面设置 -->
          <el-collapse-transition>
            <ChatModuleSetting v-if="SettingStatus == 7" v-model:settingInfo="SettingInfo" />
          </el-collapse-transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useI18n } from 'vue-i18n';

import ModelCard from '@/components/ModelCard.vue';
import Session from '@/components/Session.vue';
import File from '@/components/File.vue';

import ChatWindow from '@/view/pages/chat/ChatWindow.vue';
import ChatModuleComplete from '@/view/pages/chat/ChatModuleComplete.vue';
import ChatModuleImage from '@/view/pages/chat/ChatModuleImage.vue';
import ChatModuleAudio from '@/view/pages/chat/ChatModuleAudio.vue';
import ChatModuleFineTune from '@/view/pages/chat/ChatModuleFineTune.vue';
import ChatModuleFile from '@/view/pages/chat/ChatModuleFile.vue';
import ChatModuleSession from '@/view/pages/chat/ChatModuleSession.vue';
import ChatModuleRole from '@/view/pages/chat/ChatModuleRole.vue';
import ChatModuleSetting from '@/view/pages/chat/ChatModuleSetting.vue';

import { AI_HEAD_IMG_URL } from '@/store/mutation-types';
import { useWindowConfiguration, useFetchData } from '@/componsitions/chat.componsition';

const { t: $t } = useI18n();

// 业务Hooks
const { isShowChatWindow, isShowModelList, isShowSetupList, isShowMainContent, defaulWidth, handleToggleLeft, handleToggleRight } = useWindowConfiguration();
const { fileInfo, fileList, fileCacheList, fineTuningList, fineTuningCacheList, chatModelList, chatModelCacheList, sessionList, sessionCacheList, roleList, cancelFineStatus, getModelList, getFineTunessList, getFileList, modelCardSort, fineTunesCardSort } = useFetchData(); // prettier-ignore

// DOM定义
const refChatWindow = ref(null);

// 参数定义
const fileSearch = ref('');
const sessionSearch = ref(''); // 暂时不打开
const modelSearch = ref(''); // 模型搜索数据
const fineTuningSearch = ref(''); // 微调搜索数据

const chatModelType = ref(0); // 0是默认模型，1是微调模型

const SettingStatus = ref(0); // 0对话，1图片，2音频，3微调，4文件，5会话，6角色，7界面
const cutSetting = ref(1); // 0对话，1图片，2音频，3微调，4文件，5会话，6角色，7界面

// 全部的设置参数
const SettingInfo = ref({
  cutSetting: 1,
  openaiKey: import.meta.env.VITE_APP_OPENAI_API_KEY,
  readefile: false, // TODO: 未实现
  translateEnglish: false,
  openProductionPicture: false,
  openChangePicture: false,
  temperatureAudio: 0,
  contentImageUrl: '',

  n: 1,
  size: '256x256',
  language: 'zh',

  chat: {
    suffix: '',
    MaxTokens: 1000,
    Temperature: 1,
    TopP: 1,
    n: 1,
    stream: true,
    echo: false,
    stop: '',
    FrequencyPenalty: 0,
    PresencePenalty: 0
  },
  openNet: false,
  max_results: 3,

  fineTunes: {
    training_file: '',
    model: 'curie',
    n_epochs: 4,
    prompt_loss_weight: 0.01,
    suffix: '',
    validation_file: '',
    batch_size: 1,
    learning_rate_multiplier: 1,
    compute_classification_metrics: false,
    classification_betas: '',
    classification_positive_class: ''
  }
});

const fileCurrent = ref(''); // 当前点击的文件
const modelCurrent = ref(''); // 当前点击的模型
const finetuneModelCurrent = ref(''); // 当前点击的微调模型
const sessionCurrent = ref(''); // 当前点击的会话

const chatCompleteModelInfo = ref({}); // 当前窗口的对话模型信息，默认为：gpt-3.5-turbo
const fineTuningInfo = ref({}); // 当前窗口的微调模型信息

// 计算属性，兼容I18N
const getSettings = computed(() => {
  return [
    { name: $t('model.talk'), active: true },
    { name: $t('image.title'), active: false },
    { name: $t('audio.title'), active: false },
    { name: $t('slightly.title.abbreviation'), active: false },
    { name: $t('file.title'), active: false },
    { name: $t('session.title'), active: false },
    { name: $t('role.title'), active: false },
    { name: $t('setting.title'), active: false }
  ];
});
const defaultModel = computed(() => {
  return {
    name: 'ChatGPT',
    detail: $t('index.detail'),
    lastMsg: $t('index.lastMsg'),
    id: 'gpt-3.5-turbo',
    headImg: AI_HEAD_IMG_URL,
    showHeadImg: true
  };
});

// 初始化数据
onMounted(() => {
  if (SettingInfo.value.openaiKey) getModelList(SettingInfo.value.openaiKey);
  chatCompleteModelInfo.value = defaultModel.value;
});

// 监听属性
watch(
  () => [modelSearch.value, sessionSearch.value, fineTuningSearch.value, fileSearch.value],
  ([oldModelSearch, oldSessionSearch, oldFineTuningSearch, oldFileSearch], [newModelSearch, newSessionSearch, newFineTuningSearch, newFileSearch]) => {
    // Model变化
    if (newModelSearch !== oldModelSearch) {
      if (chatModelList.value) chatModelList.value = chatModelCacheList.value.filter(model => model.id.includes(newModelSearch));
      else chatModelList.value = chatModelCacheList.value;
    }
    // 微调变化
    if (newFineTuningSearch !== oldFineTuningSearch) {
      if (fineTuningList.value.length) {
        if (!cancelFineStatus.value) fineTuningList.value = fineTuningCacheList.value.filter(finetune => finetune.fineTunesStatus === 'succeeded').filter(finetune => finetune.id.includes(newFineTuningSearch)); // prettier-ignore
        else fineTuningList.value = fineTuningCacheList.value.filter(finetune => finetune.id.includes(newFineTuningSearch));
      } else {
        if (!cancelFineStatus.value) fineTuningList.value = fineTuningCacheList.value.filter(finetune => finetune.fineTunesStatus === 'succeeded');
        else fineTuningList.value = fineTuningCacheList.value;
      }
    }
    // 文件变化
    if (newFileSearch !== oldFileSearch) {
      if (fileList.value) fileList.value = fileCacheList.value.filter(model => model.id.includes(newFileSearch));
      else fileList.value = fileCacheList.value;
    }
    // 会话变化
    // if (newSessionSearch !== oldSessionSearch) {
    //   sessionCacheList.value = sessionList.value;
    //   if (sessionList.value) sessionList.value = sessionCacheList.value.filter(model => model.title.includes(newSessionSearch));
    //   else sessionList.value = sessionCacheList.value;
    // }
  }
);

watch(
  () => SettingInfo.value,
  (newSettingInfo, oldSettingInfo) => {
    if (newSettingInfo.openaiKey !== oldSettingInfo.openaiKey) {
      if (newSettingInfo.openChangePicture) SettingInfo.value.openProductionPicture = false;
      if (newSettingInfo.openProductionPicture) SettingInfo.value.openChangePicture = false;
      if (newSettingInfo.fineTunes.batch_size) SettingInfo.value.fineTunes.batch_size = Number(newSettingInfo.fineTunes.batch_size);
      if (newSettingInfo.fineTunes.validation_file) SettingInfo.value.fineTunes.validation_file = newSettingInfo.fineTunes.validation_file;
      if (newSettingInfo.fineTunes.learning_rate_multiplier) SettingInfo.value.fineTunes.learning_rate_multiplier = Number(newSettingInfo.fineTunes.learning_rate_multiplier);
    }
  },
  { deep: true }
);

// 常规DOM子组件事件封装
const sendMsg = (msg: any) => refChatWindow.value.sendMsg(msg); // 发送信息
const inputMessage = (msg: any) => refChatWindow.value.inputMessage(msg); // 输入信息
const getMesList = (msg: any) => refChatWindow.value.getMesList(msg); // 获取消息
const clearMsgList = () => refChatWindow.value.clearMsgList(); // 清除消息
const assignmentMesList = (msg: any) => refChatWindow.value.assignmentMesList(msg); // 设置消息

// 数据初始化
const clearCurrent = () => {
  // 清除当前选择的模型微调模型
  finetuneModelCurrent.value = '';
  // 清除当前选择的模型
  modelCurrent.value = '';
  // 清除当前选择的会话
  sessionCurrent.value = '';
  // 清除当前选择的文件
  fileCurrent.value = '';
};
// 模型列表被点击
const modelClick = () => {
  clearCurrent();
  getModelList(SettingInfo.value.openaiKey);
  // 清除被点击的微调对象
  fineTuningInfo.value = {};
  SettingStatus.value = 0;
  cutSetting.value = 0;
  SettingInfo.value.cutSetting = 0;
};
// 会话列表被点击
const sessionClick = () => {
  // 清除当前点击的状态
  clearCurrent();
  SettingStatus.value = 5;
  cutSetting.value = 1;
  SettingInfo.value.cutSetting = 1;
  chatCompleteModelInfo.value = defaultModel.value;
};
// 微调模型列表被点击
const fineTuningClick = () => {
  clearCurrent();
  SettingStatus.value = 3;
  cutSetting.value = 2;
  SettingInfo.value.cutSetting = 2;
  // 获取微调模型列表
  getFineTunessList(SettingInfo.value.openaiKey);
};
// 文件列表被点击
const fileClick = () => {
  clearCurrent();
  // 清除被点击的微调对象
  fineTuningInfo.value = {};
  SettingStatus.value = 4;
  cutSetting.value = 3;
  SettingInfo.value.cutSetting = 3;
  // 获取微调模型列表
  getFileList(SettingInfo.value.openaiKey);
};

// 模型被点击
const clickPerson = (info: any) => {
  chatModelType.value = 0;
  // 传入当前聊天窗口信息
  chatCompleteModelInfo.value = info;
  // 设置当前被点击的模型id
  modelCurrent.value = info.id.toString();
};
// 会话被点击
const clickSession = (info: any) => {
  sessionCurrent.value = info.id.toString();
  assignmentMesList(info.dataList);
};
// 微调模型被点击
const clickFineTuning = (info: any) => {
  chatModelType.value = 1;
  // 传入当前聊天窗口信息
  chatCompleteModelInfo.value = info;
  // 设置当前被点击的对象
  fineTuningInfo.value = info;
  // 设置当前选着的微调模型id
  finetuneModelCurrent.value = info.id;
};
// 文件被点击
const clickFile = (info: any) => {
  chatCompleteModelInfo.value = {
    name: info.id,
    detail: info.detail,
    lastMsg: info.lastMsg,
    id: info.id
  };
  fileCurrent.value = info.fileId;
  fileInfo.value = info;
};
</script>

<!-- Chat页面基础样式 -->
<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>

<!-- 顶部折叠布局 -->
<style lang="scss" scoped>
.top-left,
.top-right {
  position: absolute;
  top: 5px;
  cursor: pointer;
}

.top-left {
  left: 5px;
}

.top-right {
  right: 5px;
}
</style>

<!-- 主要布局样式 -->
<style lang="scss" scoped>
.chatHome {
  display: flex;
  /* 左右两边操作区域样式 */
  .chatSlider {
    width: 20%;
    .title {
      color: #fff;
      padding-left: 10px;
    }
    .online-person {
      .onlin-text {
        margin-left: 20%;
        padding-left: 10px;
        color: rgb(176, 178, 189);
      }
      .s-wrapper {
        padding-left: 10px;
        height: calc(100vh - 250px);
        margin-top: 10px;
        overflow: hidden;
        overflow-y: scroll;
        box-sizing: border-box;
        &::-webkit-scrollbar {
          width: 0;
          height: 0;
          display: none;
        }
      }
    }
  }

  /* 中间聊天区域样式 */
  .chatContainer {
    flex: 1;
    padding-right: 0px;

    .showIcon {
      position: absolute;
      top: calc(50% - 150px);
      left: calc(50% - 50px);
      .icon-snapchat {
        width: 300px;
        height: 300px;
        font-size: 300px;
      }
    }
  }
}

@media only screen and (min-width: 768px) {
  // 当屏幕宽度大于或等于768px时
  .chatHome {
    .chatContainer {
      padding-right: 30px;
    }
  }
}
</style>
