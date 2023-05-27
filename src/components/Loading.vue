<template>
  <div v-show="!acqStatus">
    <div class="line"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps({ acqStatus: { type: Boolean, required: true, default: false } });
</script>

<style lang="scss" scoped>
.line {
  position: relative;
  width: 94%;
  margin-left: 2%;
  height: 2px;
  background: linear-gradient(to right, red, yellow, green);
  animation: shrink-and-expand 2s ease-in-out infinite;
}
.line::before,
.line::after {
  content: '';
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  background: inherit;
}

.line::before {
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  left: 0;
  transform-origin: left;
  animation: shrink-left 2s ease-in-out infinite;
}

.line::after {
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
  right: 0;
  transform-origin: right;
  animation: shrink-right 2s ease-in-out infinite;
}

@keyframes shrink-and-expand {
  0%,
  100% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(0);
  }
}

@keyframes shrink-left {
  0%,
  50% {
    transform: scaleX(1);
  }

  50.1%,
  100% {
    transform: scaleX(0);
  }
}

@keyframes shrink-right {
  0%,
  50% {
    transform: scaleX(1);
  }

  50.1%,
  100% {
    transform: scaleX(0);
  }
}
</style>
