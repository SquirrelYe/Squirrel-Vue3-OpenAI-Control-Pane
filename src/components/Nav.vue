<template>
  <div class="nav">
    <div class="nav-menu-wrapper">
      <ul class="menu-list">
        <li v-for="(item, index) in menuList" :key="index" :class="{ activeNav: index == current }" @click="changeMenu(index)">
          <div class="block"></div>
          <span class="iconfont" :class="item"></span>
        </li>
      </ul>
    </div>

    <div class="own-pic" @click="userInfoShow">
      <HeadImg :imgUrl="imgUrl"></HeadImg>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { USER_HEAD_IMG_URL } from '@/store/mutation-types';
import HeadPortrait from '@/components/HeadPortrait.vue';
import HeadImg from '@/components/HeadImg.vue';

const router = useRouter();
const route = useRoute();

const current = ref(0);
const menuList = ref(['icon-xinxi', 'icon-shezhi']);
const imgUrl = ref(USER_HEAD_IMG_URL);

const changeMenu = (index: number) => {
  switch (index) {
    case 0:
      router.push({ name: 'Chat' });
      break;
    case 1:
      router.push({ name: 'About' });
      break;
    default:
      router.push({ name: 'ChatHome' });
  }
  current.value = index;
};

const userInfoShow = () => {
  router.push({ name: 'UserInfo' });
};
</script>

<style lang="scss" scoped>
.nav {
  width: 100%;
  height: 90vh;
  position: relative;
  border-radius: 20px 0 0 20px;
  .nav-menu-wrapper {
    position: absolute;
    top: 40%;
    transform: translate(0, -50%);
    .menu-list {
      margin-left: 10px;

      li {
        margin: 40px 0 0 30px;
        list-style: none;
        cursor: pointer;
        position: relative;
        .block {
          background-color: rgb(29, 144, 245);
          position: absolute;
          left: -40px;
          width: 6px;
          height: 25px;
          transition: 0.5s;
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
          opacity: 0;
        }
        &:hover {
          span {
            color: rgb(29, 144, 245);
          }
          .block {
            opacity: 1;
          }
        }
      }
    }
  }
  .own-pic {
    position: absolute;
    bottom: 10%;
    margin-left: 25px;
  }
}
.activeNav {
  span {
    color: rgb(29, 144, 245);
  }
  .block {
    opacity: 1 !important;
  }
}
</style>
