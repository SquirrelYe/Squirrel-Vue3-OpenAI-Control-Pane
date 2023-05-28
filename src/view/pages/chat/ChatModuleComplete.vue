<template>
  <div>
    <!-- 开启联网搜索，服务为：duckduckgosearch -->
    <div class="block" v-show="SettingInfo.openNet">
      <!-- 是否联网 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.online')" placement="top">
          <span class="demonstration">{{ $t('model.online_title') }}</span>
        </el-tooltip>
        <el-switch v-model="SettingInfo.openNet" :width="defaulWidth" style=""></el-switch>
      </div>

      <!-- 查询规模 -->
      <el-tooltip class="item" effect="dark" :content="$t('model.max_results_title')" placement="top">
        <span class="demonstration" style="">{{ $t('model.max_results') }}</span>
      </el-tooltip>

      <!-- 开启读文模式 -->
      <el-slider class="astrict" v-model="SettingInfo.max_results" :step="1" :min="0" :max="6"></el-slider>
    </div>

    <!-- 未开启联网搜索 -->
    <div v-show="!SettingInfo.openNet">
      <!-- 后缀 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.suffix')" placement="top">
          <span class="demonstration">{{ $t('model.suffix_title') }}</span>
        </el-tooltip>
        <input class="weitiao" v-model="SettingInfo.chat.suffix" :placeholder="$t('placeholder.suffix')" />
      </div>

      <!-- 停止Token -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.stop')" placement="top">
          <span class="demonstration" s>{{ $t('model.stop_title') }}</span>
        </el-tooltip>
        <input class="weitiao" v-model="SettingInfo.chat.stop" :placeholder="$t('placeholder.stop')" />
      </div>

      <!-- 单词重复度 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.frequency_penalty')" placement="top">
          <span class="demonstration">{{ $t('model.frequency_penalty_title') }}</span>
        </el-tooltip>
        <el-slider class="astrict" v-model="SettingInfo.chat.FrequencyPenalty" :step="0.1" :min="-2" :max="2"></el-slider>
      </div>

      <!-- 话题重复度 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.presence_penalty')" placement="top">
          <span class="demonstration">{{ $t('model.presence_penalty_title') }}</span>
        </el-tooltip>
        <el-slider class="astrict" v-model="SettingInfo.chat.PresencePenalty" :step="0.1" :min="-2" :max="2"></el-slider>
      </div>

      <!-- 最大Token数量，参考：https://platform.openai.com/tokenizer -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.max_tokens')" placement="top">
          <span class="demonstration" style="">{{ $t('model.max_tokens_title') }}</span>
        </el-tooltip>
        <el-slider class="astrict" v-model="SettingInfo.chat.MaxTokens" :step="1" :min="0" :max="2048"></el-slider>
      </div>

      <!-- 随机度 0-2 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.temperature')" placement="top">
          <span class="demonstration">{{ $t('model.temperature_title') }}</span>
        </el-tooltip>
        <el-slider class="astrict" v-model="SettingInfo.chat.Temperature" :step="0.1" :min="0" :max="2"></el-slider>
      </div>

      <!-- 保留词比例 0-1 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.top_p')" placement="top">
          <span class="demonstration" s>{{ $t('model.top_p_title') }}</span>
        </el-tooltip>
        <el-slider class="astrict" v-model="SettingInfo.chat.TopP" :step="0.1" :min="0" :max="1"></el-slider>
      </div>

      <!-- 结果规模 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.n')" placement="top">
          <span class="demonstration" s>{{ $t('model.n_title') }}</span>
        </el-tooltip>
        <input class="weitiao" v-model="SettingInfo.chat.n" :placeholder="$t('placeholder.response_count')" type="number" />
      </div>

      <!-- 流式输出 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.stream')" placement="top">
          <span class="demonstration">{{ $t('model.stream_title') }}</span>
        </el-tooltip>
        <el-switch v-model="SettingInfo.chat.stream" :width="defaulWidth" style=""></el-switch>
      </div>

      <!-- 回显词 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.echo')" placement="top">
          <span class="demonstration">{{ $t('model.echo_title') }}</span>
        </el-tooltip>
        <el-switch v-model="SettingInfo.chat.echo" :width="defaulWidth" style=""></el-switch>
      </div>

      <!-- 是否联网搜索 -->
      <div class="block">
        <el-tooltip class="item" effect="dark" :content="$t('model.online')" placement="top">
          <span class="demonstration">{{ $t('model.online_title') }}</span>
        </el-tooltip>
        <el-switch v-model="SettingInfo.openNet" :width="defaulWidth" style=""></el-switch>
      </div>
    </div>

    <!-- 开启读文模式 -->
    <div class="block">
      <el-tooltip class="item" effect="dark" content="开启读文模式" placement="top">
        <span class="demonstration">开启读文模式</span>
      </el-tooltip>
      <el-switch v-model="SettingInfo.readefile" :width="defaulWidth" style=""></el-switch>
    </div>

    <!-- <div style="height: 30px"></div> -->
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const emits = defineEmits(['update:settingInfo']);
const props = defineProps({
  settingInfo: { type: Object, default: () => ({}) },
  defaulWidth: { type: Number, default: 70 }
});

const SettingInfo = ref(props.settingInfo);

watch(props.settingInfo, val => (SettingInfo.value = val));
watch(SettingInfo, val => emits('update:settingInfo', val));
</script>

<style lang="scss" scoped>
@import url('/src/assets/styles/chat.base.css');
</style>
