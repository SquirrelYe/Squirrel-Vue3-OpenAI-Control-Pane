import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router';

import Chat from '@/view/pages/chat/Chat.vue';
import About from '@/view/pages/about/About.vue';
import UserInfo from '@/view/pages/profile/UserInfo.vue';

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/Chat'
    },
    {
      path: '/Chat',
      name: 'Chat',
      component: Chat
    },
    {
      path: '/About',
      name: 'About',
      component: About
    },
    {
      path: '/UserInfo',
      name: 'UserInfo',
      component: UserInfo
    }
  ]
});
