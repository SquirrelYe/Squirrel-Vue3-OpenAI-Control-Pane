import { createI18n } from 'vue-i18n';

import enLocale from '@/lang/en';
import zhLocale from '@/lang/zh-CN';

import elementEn from 'element-plus/lib/locale/lang/en';
import elementZh from 'element-plus/lib/locale/lang/zh-CN';

// 配置i18n
const i18n = createI18n({
  locale: localStorage.getItem('lang') || 'zh', // 从缓存中获取当前的语言类型
  messages: {
    en: { ...enLocale, ...elementEn },
    zh: { ...zhLocale, ...elementZh }
  }
});

export default i18n;
