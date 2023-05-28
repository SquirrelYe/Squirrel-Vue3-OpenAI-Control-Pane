import axios from 'axios';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';

// 全局参数，自定义参数可在发送请求时设置
axios.defaults.timeout = 300 * 1000 * 1000; // 超时时间ms
axios.defaults.withCredentials = false;

// 请求时的拦截
// 回调里面不能获取错误信息
axios.interceptors.request.use(
  config => config,
  error => {
    // 当请求异常时做一些处理
    console.log('请求异常：' + JSON.stringify(error));
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => response,
  error => {
    console.log('响应出错：' + error);
    return Promise.reject(error);
  }
);

const base = {
  axios: axios,
  baseUrl: OPENAI_PROXY_URL
};

export default base;
