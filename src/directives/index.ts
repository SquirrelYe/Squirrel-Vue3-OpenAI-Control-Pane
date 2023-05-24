// 用于自适应文本框的高度
export const autoheight = {
  mounted: (el: HTMLTextAreaElement) => {
    const result = el.value;
    if (result == '') {
      el.style.height = '26px';
    } else {
      el.style.height = el.scrollHeight + 'px';
    }
  },
  updated: (el: HTMLTextAreaElement) => {
    const result = el.value;
    if (result == '') {
      el.style.height = '26px';
    } else {
      el.style.height = el.scrollHeight + 'px';
    }
  }
};
