import { debounce, throttle } from 'lodash-es';
import { ElMessage } from 'element-plus';
import i18n from '@/config/i18n';

// 防抖/节流
export { debounce, throttle };

// 下拉动画
export const animation = (obj: any, target: any, fn1?: any) => {
  // fn是一个回调函数，在定时器结束的时候添加
  // 每次开定时器之前先清除掉定时器
  clearInterval(obj.timer);
  obj.timer = setInterval(function () {
    // 步长计算公式  越来越小
    // 步长取整
    let step = (target - obj.scrollTop) / 10;
    step = step > 0 ? Math.ceil(step) : Math.floor(step);
    if (obj.scrollTop >= target) {
      clearInterval(obj.timer);
      // 如果fn1存在，调用fn
      if (fn1) {
        fn1();
      }
    } else {
      // 每30毫秒就将新的值给obj.left
      obj.scrollTop = obj.scrollTop + step;
    }
  }, 10);
};

// 判断文件类型
export const judgeFileType = (file: string) => {
  if (file == null || file == '') {
    alert(i18n.t('util_js.select'));
    return false;
  }
  if (file.lastIndexOf('.') == -1) {
    //如果不存在"."
    alert(i18n.t('util_js.path'));
    return false;
  }
  const AllImgExt = '.jpg|.jpeg|.gif|.bmp|.png|';
  const extName = file.substring(file.lastIndexOf('.')).toLowerCase(); //（把路径中的所有字母全部转换为小写）
  if (AllImgExt.indexOf(extName + '|') == -1) {
    const ErrMsg = i18n.t('util_js.notallowed') + AllImgExt + i18n.t('util_js.type') + extName;
    alert(ErrMsg);
    return false;
  }
};

// 文件类型
export const fileType = () => {
  return {
    'application/msword': 'word',
    'application/pdf': 'pdf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.ms-excel': 'excel',
    'aplication/zip': 'zpi'
  };
};

// 获取当前时间
export const getNowTime = () => {
  // 创建一个Date对象
  let date = new Date();
  // 获取年份、月份、日期、小时、分钟和秒数
  let year: any = date.getFullYear();
  let month: any = date.getMonth() + 1; // 注意月份从0开始计数
  let day: any = date.getDate();
  let hour: any = date.getHours();
  let minute: any = date.getMinutes();
  let second: any = date.getSeconds();
  // 如果月份、日期、小时、分钟或秒数小于10，需要在前面补0
  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }
  if (hour < 10) {
    hour = '0' + hour;
  }
  if (minute < 10) {
    minute = '0' + minute;
  }
  if (second < 10) {
    second = '0' + second;
  }
  // 拼接成字符串
  let currentTime = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
  // 输出结果
  return currentTime;
};

// 格式化时间
export const JCMFormatDate = (dateStr: string) => {
  let date = new Date(dateStr);
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  return `${year}/${month}/${day} ${hour}:${minute}:${second}`;
};

//将时间戳转换为正常时间
export const JCMFormatTimestamp = (timestamp: number) => {
  const date = new Date(timestamp * 1000); // 转换为Date对象
  const options: Record<string, any> = {
    // 背景时间的格式选项
    year: 'numeric', // 年份（4位数字）
    month: 'long', // 月份的全称
    day: 'numeric', // 天（数字）
    hour: 'numeric', // 小时（数字）
    minute: 'numeric', // 分钟（数字）
    second: 'numeric' // 秒钟（数字）
  };
  return date.toLocaleDateString('zh-CN', options);
};

// 复制到剪切板
export const copyToClipboard = (content: string) => {
  try {
    const aux = document.createElement('input');
    aux.setAttribute('value', content);
    document.body.appendChild(aux);
    aux.select();
    document.execCommand('copy');
    document.body.removeChild(aux);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// 复制到剪切板 + 提示
export const copyToClipboardWithMessage = (content: string, message: string) => {
  const isCopied = copyToClipboard(content);
  isCopied && ElMessage.success(message);
};

// 生成UUID
export const generateUUID = () => {
  let d = new Date().getTime();
  if (window.performance && typeof window.performance.now === 'function') {
    d += performance.now();
  }
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
};

// 是否在pc端下
export const isPc = () => {
  return navigator.userAgent.toLowerCase().indexOf(' electron/') > -1;
};
