<template>
  <div class="person-card" :class="{ activeCard: chatModelInfo.id == pcCurrent }">
    <div class="info">
      <HeadPortrait :imgUrl="chatModelInfo.headImg" v-show="chatModelInfo.showHeadImg" />

      <div class="info-detail">
        <div class="name">{{ chatModelInfo.name ? chatModelInfo.name.slice(0, 20) : chatModelInfo.fineTunesStatus == 'pending' ? $t('person_card.train') : $t('person_card.cancel') }}</div>
        <div class="detail">{{ chatModelInfo.lastMsg.slice(0, 22) }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import HeadPortrait from '@/components/HeadPortrait.vue';

const props = defineProps({
  chatModelInfo: { default: {}, type: Object },
  pcCurrent: { default: '', type: String }
});

const current = ref('');

watch(
  () => props.pcCurrent,
  () => isActive()
);

const isActive = () => {
  current.value = props.pcCurrent;
};
</script>

<style lang="scss" scoped>
.person-card {
  width: 100%;
  height: 80px;
  border-radius: 10px;
  background-color: rgb(50, 54, 68);
  position: relative;
  margin: 25px 0;
  cursor: pointer;
  .info {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 90%;
    transform: translate(-50%, -50%);
    overflow: hidden;
    display: flex;
    .info-detail {
      margin-top: 5px;
      margin-left: 20px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
      .name {
        color: #fff;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 5px;
      }
      .detail {
        color: #5c6675;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        font-size: 12px;
      }
    }
  }
  &:hover {
    background-color: #1d90f5;
    transition: 0.3s;
    box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
    .info {
      .info-detail {
        .detail {
          color: #fff;
        }
      }
    }
  }
}
.activeCard {
  background-color: #1d90f5;
  transition: 0.3s;
  box-shadow: 3px 2px 10px 0px rgba(0, 136, 255);
  .info {
    .info-detail {
      .detail {
        color: #fff;
      }
    }
  }
}
</style>
