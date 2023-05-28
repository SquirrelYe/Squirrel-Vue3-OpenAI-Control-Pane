import { ref, onBeforeMount, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';
import { findIndex } from 'lodash-es';

import { AI_HEAD_IMG_URL } from '@/store/mutation-types';
import { generateUUID } from '@/utils/util';
import { desp_model, desp_keys, other_desps, other_desp_keys } from '@/constants/index';

import { OpenAIModelAPI } from '@/api/models.api';
import { OpenAIFileAPI } from '@/api/files.api';
import { OpenAIFineTuneAPI } from '@/api/finetunes.api';

import type { Ref } from 'vue';

// 窗口数据设置
export const useWindowConfiguration = () => {
  const isFirstSize = ref(true);
  const isShowChatWindow = ref(true);
  const isShowModelList = ref(true);
  const isShowSetupList = ref(true);
  const isShowMainContent = ref(true);

  const windowInnerWidth = ref(0);
  const defaulWidth = ref(70); // 组件开关的宽度

  // 监听页面尺寸变化
  const resize = () => {
    if (window.innerWidth <= 1150) {
      isShowModelList.value = false;
      isShowSetupList.value = false;
      isShowChatWindow.value = true;
    } else {
      isShowModelList.value = true;
      isShowSetupList.value = true;
    }
  };

  // 监听窗口的变化
  const handleResize = () => {
    if (isFirstSize.value) {
      resize();
      isFirstSize.value = false;
      windowInnerWidth.value = window.innerWidth;
    }
    if (windowInnerWidth.value != window.innerWidth) {
      resize();
      windowInnerWidth.value = window.innerWidth;
    }
  };

  // 点击切换显示状态 - 左侧
  const handleToggleLeft = () => {
    isShowModelList.value = !isShowModelList.value;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && (isShowModelList.value || isShowSetupList.value)) {
      isShowMainContent.value = false;
      isShowSetupList.value = !isShowModelList.value;
      document.querySelectorAll<HTMLElement>('.chatSlider')[0].style.width = '100%';
    } else {
      isShowMainContent.value = true;
      document.querySelectorAll<HTMLElement>('.chatSlider')[0].style.width = '20%';
    }
  };
  // 点击切换显示状态 - 右侧
  const handleToggleRight = () => {
    isShowSetupList.value = !isShowSetupList.value;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile && (isShowModelList.value || isShowSetupList.value)) {
      isShowMainContent.value = false;
      isShowModelList.value = !isShowSetupList.value;
      document.querySelectorAll<HTMLElement>('.chatSlider')[1].style.width = '100%';
    } else {
      isShowMainContent.value = true;
      document.querySelectorAll<HTMLElement>('.chatSlider')[1].style.width = '20%';
    }
  };

  onBeforeMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    isFirstSize,
    isShowChatWindow,
    isShowModelList,
    isShowSetupList,
    isShowMainContent,
    windowInnerWidth,
    defaulWidth,
    handleToggleLeft,
    handleToggleRight
  };
};

// 拉取数据设置
export const useFetchData = () => {
  const { t: $t } = useI18n();

  const fileInfo = ref<Record<string, any>>({}); // 当前点击的文件信息
  const fileList = ref<Array<any>>([]); // 文件列表
  const fileCacheList = ref<Array<any>>([]); // 文件列表缓存
  const fineTuningList = ref<Array<any>>([]); // 微调模型列表
  const fineTuningCacheList = ref<Array<any>>([]); // 微调模型缓存列表
  const chatModelList = ref<Array<any>>([]); // 模型列表
  const chatModelCacheList = ref<Array<any>>([]); // 模型列表缓存
  const sessionList = ref<Array<any>>([]); // 会话列表
  const sessionCacheList = ref<Array<any>>([]); // 会话列表缓存
  const roleList = ref<Array<any>>([]); // 角色列表

  const cancelFineStatus = ref(true); // 取消微调状态

  // 根据name查找元素的索引
  const findIndexByName = (arr: Array<any>, name: string) => findIndex(arr, item => item === name || item.name === name);

  // 获取描述
  const produceModelDesc = (model: string) => {
    const idx = findIndexByName(desp_keys, model);
    if (idx !== -1) return desp_model[model];
    else {
      let desc = '';
      for (let i = 0; i < desp_keys.length; i++) {
        const key = desp_keys[i];
        if (model.includes(key)) {
          desc += `基于语言模型${key}`;
          break;
        }
      }
      for (let i = 0; i < other_desp_keys.length; i++) {
        const key = other_desp_keys[i];
        if (model.includes(key)) {
          desc += other_desps[key];
          break;
        }
      }
      if (desc == '') desc = model + '模型';
      return desc;
    }
  };

  // 获取模型列表
  const getModelList = async (openaiKey: string, organization: string) => {
    if (!openaiKey) return;

    // ① 获取Model列表
    const modelsRes = await new OpenAIModelAPI(openaiKey, organization).listModels();
    const modelsObjs = [];
    //获取所有的模型
    [...new Set(modelsRes.data.data.map((model: any) => model.id))].sort().forEach(model_name => {
      const modelObj = {
        name: model_name,
        detail: produceModelDesc(model_name),
        lastMsg: produceModelDesc(model_name),
        id: model_name,
        headImg: AI_HEAD_IMG_URL,
        showHeadImg: true
      };
      modelsObjs.push(modelObj);
    });
    // 将gpt-3.5-turbo置顶
    const idx = findIndexByName(modelsObjs, 'gpt-3.5-turbo');
    if (idx !== -1) {
      const element = modelsObjs.splice(idx, 1)[0]; // 将idx元素删除
      modelsObjs.unshift(element); // 将idx出的元素至于列表头
    }

    // ② 获取微调模型列表
    const fineTunesRes = await new OpenAIFineTuneAPI(openaiKey, organization).listFineTunes();
    let fineTunesObjs = [];
    fineTunesRes.data.data.forEach((fineTunes: { fine_tuned_model: any; model: string; created_at: any; id: any; status: any }) => {
      const fineTunesObj = {
        img: '',
        name: fineTunes.fine_tuned_model,
        detail: '基于' + fineTunes.model + '微调创建的模型',
        lastMsg: '基于' + fineTunes.model + '微调创建的模型',
        id: fineTunes.fine_tuned_model ? fineTunes.fine_tuned_model : generateUUID(),
        headImg: AI_HEAD_IMG_URL,
        showHeadImg: true,
        createTime: fineTunes.created_at,
        fineTunesId: fineTunes.id,
        fineTunesStatus: fineTunes.status
      };
      fineTunesObjs.push(fineTunesObj);
    });
    fineTunesObjs = fineTunesObjs.sort((a, b) => b.createTime - a.createTime);

    // 提取fineTunesRes集合中所有id属性值
    const fineTunesIds = fineTunesObjs.map(item => item.id);
    const models = modelsObjs.filter(item => !fineTunesIds.includes(item.id));

    // 数据处理
    chatModelList.value = models;
    chatModelCacheList.value = models;
  };

  // 获取微调模型列表
  const getFineTunessList = async (openaiKey: string, organization: string) => {
    if (!openaiKey) return;
    const res = await new OpenAIFineTuneAPI(openaiKey, organization).listFineTunes();

    let fineTunesObjs = [];
    res.data.data.forEach((fineTunes: { fine_tuned_model: any; model: string; created_at: any; id: any; status: any }) => {
      const fineTunesObj = {
        img: '',
        name: fineTunes.fine_tuned_model,
        detail: '基于' + fineTunes.model + '微调创建的模型',
        lastMsg: '基于' + fineTunes.model + '微调创建的模型',
        id: fineTunes.fine_tuned_model ? fineTunes.fine_tuned_model : generateUUID(),
        headImg: AI_HEAD_IMG_URL,
        showHeadImg: true,
        createTime: fineTunes.created_at,
        fineTunesId: fineTunes.id,
        fineTunesStatus: fineTunes.status
      };
      fineTunesObjs.push(fineTunesObj);
    });
    fineTunesObjs = fineTunesObjs.sort((a, b) => b.createTime - a.createTime);

    fineTuningCacheList.value = fineTunesObjs;

    if (cancelFineStatus.value == true) fineTuningList.value = fineTuningCacheList.value;
    else fineTuningList.value = fineTuningCacheList.value.filter(fineTunin => fineTunin.fineTunesStatus === 'succeeded');
  };

  // 获取文件列表
  const getFileList = async (openaiKey: string, organization: string) => {
    if (!openaiKey) return;
    const res = await new OpenAIFileAPI(openaiKey, organization).listFiles();

    let fileObjs = [];
    res.data.data.forEach((file: { filename: any; id: string; bytes: number; created_at: any }) => {
      const fileObj = {
        img: '',
        name: file.filename,
        detail: '文件ID是:' + file.id + ',文件大小是:' + (file.bytes / 1024 / 1024).toFixed(2) + 'MB',
        lastMsg: '文件ID是:' + file.id + ',文件大小是:' + (file.bytes / 1024 / 1024).toFixed(2) + 'MB',
        id: file.filename,
        createTime: file.created_at,
        fileId: file.id
      };
      fileObjs.push(fileObj);
    });
    fileObjs = fileObjs.sort((a, b) => b.createTime - a.createTime);

    fileList.value = fileObjs;
    fileCacheList.value = fileObjs;
  };

  // 模型排序
  const modelCardSort = (id: string) => {
    if (typeof chatModelList.value[0] != 'undefined' && id !== chatModelList.value[0].id) {
      let nowModelInfo = null;
      for (let i = 0; i < chatModelList.value.length; i++) {
        if (chatModelList.value[i].id == id) {
          nowModelInfo = chatModelList.value[i];
          chatModelList.value.splice(i, 1);
          break;
        }
      }
      chatModelList.value.unshift(nowModelInfo);
    }
  };

  // 微调模型排序
  const fineTunesCardSort = (id: string) => {
    if (id !== fineTuningList.value[0].id) {
      let nowModelInfo = null;
      for (let i = 0; i < fineTuningList.value.length; i++) {
        if (fineTuningList.value[i].id == id) {
          nowModelInfo = fineTuningList.value[i];
          fineTuningList.value.splice(i, 1);
          break;
        }
      }
      fineTuningList.value.unshift(nowModelInfo);
    }
  };

  return {
    fileInfo,
    fileList,
    fileCacheList,
    fineTuningList,
    fineTuningCacheList,
    chatModelList,
    chatModelCacheList,
    sessionList,
    sessionCacheList,
    roleList,
    cancelFineStatus,
    getModelList,
    getFineTunessList,
    getFileList,
    modelCardSort,
    fineTunesCardSort
  };
};
