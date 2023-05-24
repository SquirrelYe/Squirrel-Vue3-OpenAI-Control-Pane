import { createApp } from 'vue';
import { createPinia } from 'pinia';

import ElementPlus from 'element-plus';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';

import router from '@/router';
import i18n from '@/config/i18n';
import { autoheight } from '@/directives';

import App from '@/App.vue';

import 'element-plus/dist/index.css';
import '@/style.css';

const pinia = createPinia();
const app = createApp(App);

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

app.directive('autoheight', autoheight);

app.use(router);
app.use(i18n);
app.use(ElementPlus);
app.use(pinia);

app.mount('#app');
