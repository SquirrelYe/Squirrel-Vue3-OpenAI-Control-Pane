<template>
  <svg aria-hidden="true" :class="classes" :width="props.size" :height="props.size" @click="onClickHandler">
    <use :xlink:href="symbolId" :fill="props.color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

const props = defineProps({
  prefix: { type: String, default: 'icon' },
  name: { type: String, required: true },
  color: { type: String, default: '#333' },
  size: { type: String, default: '1em' }
});
const emits = defineEmits(['click']);

const classes = computed(() => ['svg-icon']);
const symbolId = computed(() => `#${props.prefix}-${props.name}`);

const onClickHandler = (e: any) => emits('click', e);
</script>

<style lang="scss" scoped></style>
