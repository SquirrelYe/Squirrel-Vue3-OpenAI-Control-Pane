import base from '@/api/index';

let axios = base.axios;
let baseUrl = base.baseUrl;

// 获取角色列表
export const getRoles = () => {
  return axios({
    method: 'get',
    baseURL: `user_custom.json`,
    headers: { 'Content-Type': 'application/json' }
  });
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
