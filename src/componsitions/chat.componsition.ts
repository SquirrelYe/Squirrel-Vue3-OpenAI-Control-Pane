import { ref, onBeforeMount, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

import { AI_HEAD_IMG_URL } from '@/store/mutation-types';
import { getModels, getFineTunesList, getFilesList } from '@/api/getData';

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

  // 获取模型列表
  const getModelList = (key: string) => {
    if (!key) return;
    getModels(key).then(modelsRes => {
      // 提取fineTunesRes集合中所有id属性值
      getFineTunesList(key).then(fineTunesRes => {
        const fineTunesIds = fineTunesRes.map(item => item.id);
        const models = modelsRes.filter(item => !fineTunesIds.includes(item.id));
        chatModelList.value = models;
        chatModelCacheList.value = models;
      });
    });
  };

  // 获取微调模型列表
  const getFineTunessList = (key: string) => {
    if (!key) return;
    getFineTunesList(key)
      .then(res => {
        fineTuningCacheList.value = res;
        if (cancelFineStatus.value == true) {
          fineTuningList.value = fineTuningCacheList.value;
        } else {
          fineTuningList.value = fineTuningCacheList.value.filter(fineTunin => fineTunin.fineTunesStatus === 'succeeded');
        }
      })
      .catch(e => {
        ElMessage.error($t('message.get_model_fail'));
      });
  };

  // 获取文件列表
  const getFileList = (key: string) => {
    if (!key) return;
    getFilesList(key)
      .then(res => {
        fileList.value = res;
        fileCacheList.value = res;
      })
      .catch(e => {
        ElMessage.error($t('message.get_files_fail'));
      });
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
