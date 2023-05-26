<template>
  <Markdown class="markdown-body" :source="content" v-bind="markdownOptions" :plugins="markdownPlugins"></Markdown>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Markdown from 'vue3-markdown-it';
import MarkdownIt from 'markdown-it';
import MarkdownItHighlightjs from 'markdown-it-highlightjs';

import 'highlight.js/styles/monokai.css';

defineProps({
  content: { type: String, required: true, default: '' }
});

const markdownOptions = {
  html: true, // 启用 HTML 标签解析
  linkify: true, // 将 URL 自动转换为链接
  typographer: true, // 启用智能标点符号替换
  breaks: true // 启用回车换行
};

const markdownPlugins = [{ plugin: MarkdownIt }, { plugin: MarkdownItHighlightjs }];
</script>

<style lang="scss" scoped>
.markdown-body {
  padding: 0;
  margin: 0;
  -webkit-text-size-adjust: 100%;
  color: #24292e;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  text-align: left;
}
</style>
