<template>
  <div class="person-card" :class="{ activeCard: sessionInfo.id == current }">
    <div class="info">
      <div class="info-detail">
        <div class="detail">
          <div class="detail-content">
            {{ sessionInfo.id }}. &nbsp;
            {{ sessionInfo.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';

const props = defineProps({
  sessionInfo: { default: {}, type: Object },
  pcCurrent: { default: '', type: String }
});

const current = ref('');

watch(
  () => props.pcCurrent,
  () => isActive()
);

const isActive = () => (current.value = props.pcCurrent);
</script>

<style lang="scss" scoped>
.person-card {
  width: 100%;
  height: auto;
  border-radius: 10px;
  background-color: rgb(50, 54, 68);
  position: relative;
  margin: 0 0 25px 0;
  cursor: pointer;
  .info {
    width: auto;
    .info-detail {
      margin-top: 5px;
      .detail {
        color: #fff;
        font-size: 15px;
        .detail-content {
          padding: 10px 5px;
          text-align: left;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
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
