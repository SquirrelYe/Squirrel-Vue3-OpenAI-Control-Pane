import { findIndex } from 'lodash-es';

import base from '@/api/index';
import { AI_HEAD_IMG_URL } from '@/store/mutation-types';
import { generateUUID } from '@/utils/util';
import { desp_model, desp_keys, other_desps, other_desp_keys } from '@/constants/index';

let axios = base.axios;
let baseUrl = base.baseUrl;

// 根据name查找元素的索引
const findIndexByName = (arr: Array<any>, name: string) => findIndex(arr, item => item === name || item.name === name);

// 获取描述
const produceModelDesc = (model: string) => {
  const idx = findIndexByName(desp_keys, model);
  if (idx !== -1) {
    return desp_model[model];
  } else {
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
    if (desc == '') {
      desc = model + '模型';
    }
    return desc;
  }
};

// 获取模型列表
export const getModels = async (token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/models`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  const modelsObj = [];
  //获取所有的模型
  const models: Array<any> = [...new Set(res.data.data.map((model: any) => model.id))].sort();
  models.forEach(model_name => {
    const modelObj = {
      name: model_name,
      detail: produceModelDesc(model_name),
      lastMsg: produceModelDesc(model_name),
      id: model_name,
      headImg: AI_HEAD_IMG_URL,
      showHeadImg: true
    };
    modelsObj.push(modelObj);
  });
  // 将gpt-3.5-turbo置顶
  const idx = findIndexByName(modelsObj, 'gpt-3.5-turbo');
  if (idx !== -1) {
    const element = modelsObj.splice(idx, 1)[0]; // 将idx元素删除
    modelsObj.unshift(element); // 将idx出的元素至于列表头
  }
  return modelsObj;
};

// 获取角色列表
export const getRoles = () => {
  return axios({
    method: 'get',
    baseURL: `user_custom.json`,
    headers: { 'Content-Type': 'application/json' }
  });
};

// 根据提示创建图像
export const createImage = async (params: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/generations`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    data: params
  });
  return res.data.data;
};

// 根据提示词编辑图像
export const createImageEdit = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/edits`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: formData
  });
  return res.data.data;
};

// 根据创建图像变体
export const createImageVariations = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/images/variations`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: formData
  });
  return res.data.data;
};

// 将音频转换为文字
export const createTranscription = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/audio/transcriptions`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: formData
  });
  return res.data;
};

// 将音频翻译成英语
export const createTranslation = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/audio/translations`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: formData
  });
  return res.data;
};

// 创建微调
export const createFineTune = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/fine-tunes`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    data: formData
  });
  return res.data;
};

// 列出微调
export const getFineTunesList = async (token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  const fineTunesObjs = [];
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
  return fineTunesObjs.sort((a, b) => b.createTime - a.createTime);
};

// 检索微调信息
export const retrieveFineTune = async (fineTuneId: string, token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes/` + fineTuneId,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

// 取消微调
export const cancelFineTune = async (fineTuneId: string, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/fine-tunes/` + fineTuneId + '/cancel',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

// 获取微调事件列表
export const getFineTuneEventsList = async (fineTuneId: string, token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/fine-tunes/` + fineTuneId + '/events',
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: fineTuneId
  });
  return res.data;
};

// 删除微调模型
export const deleteFineTuneModel = async (model: string, token: string) => {
  const res = await axios({
    method: 'delete',
    baseURL: `${baseUrl}/v1/models/` + model,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

//获取文件列表
export const getFilesList = async (token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/files`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  const fileObjs = [];
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
  return fileObjs.sort((a, b) => b.createTime - a.createTime);
};

// 删除文件
export const deleteFile = async (file: string, token: string) => {
  const res = await axios({
    method: 'delete',
    baseURL: `${baseUrl}/v1/files/` + file,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

// 上传JSONL文件
export const uploadFile = async (formData: any, token: string) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/files`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'multipart/form-data' },
    data: formData
  });
  return res.data;
};

// 检索文件
export const retrieveFile = async (file: string, token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/v1/files/` + file,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

// 检索文件内容
export const retrieveFileContent = (file: any, token: any) => {
  throw new Error('Method not implemented.');
  // return axios({
  //   method: 'get',
  //   baseURL: `${baseUrl}v1/files/`+file+`/content`,
  //   headers: {
  //     'Authorization': 'Bearer ' + token
  //   }
  // }).then(response => {
  //   const writer = fs.createWriteStream('./file.txt')
  //   response.data.pipe(writer)
  // })
};

// 检索文件内容
export const createEmbeddings = async (params: any, token: string) => {
  const response = await axios({
    method: 'post',
    baseURL: `${baseUrl}/v1/embeddings`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    data: params
  });
  return response.data;
};

// 获取账号余额信息
export const getMoneyInfo = async (token: string) => {
  const res = await axios({
    method: 'get',
    baseURL: `${baseUrl}/dashboard/billing/credit_grants`,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }
  });
  return res.data;
};

// 获取聊天信息
export const getChatMsg = async (params: any) => {
  const res = await axios({
    method: 'post',
    baseURL: `${baseUrl}/friend/chatMsg`,
    data: params
  });
  return res.data;
};
