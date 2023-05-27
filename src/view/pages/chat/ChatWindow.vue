<template>
  <div class="chat-window">
    <!-- 头部展示 -->
    <div class="top">
      <el-row style="height: 70px">
        <el-col :span="chatWindowGridSpanSpan[0]">
          <div class="head-pic">
            <HeadPortrait :imgUrl="chatCompleteModelInfo.headImg"></HeadPortrait>
          </div>
        </el-col>

        <el-col :span="chatWindowGridSpanSpan[1]">
          <div class="info-detail">
            <div class="name">{{ chatCompleteModelInfo.name }}</div>
            <div class="detail" :title="chatCompleteModelInfo.detail">{{ chatCompleteModelInfo.detail }}</div>
          </div>
        </el-col>

        <!-- 头部操作区域 -->
        <el-col :span="chatWindowGridSpanSpan[2]">
          <div class="other-fun">
            <!-- 清除聊天记录 -->
            <el-tooltip class="item" effect="dark" :content="$t('chatoperation.msg_clear')" placement="top">
              <label @click="handleSyncOperation('msg:list:clear')">
                <span class="iconfont icon-qingchu"></span>
              </label>
            </el-tooltip>

            <!-- 导入聊天记录 -->
            <el-tooltip class="item" effect="dark" :content="$t('chatoperation.msg_import')" placement="top">
              <label @click="handleSyncOperation('msg:list:import:json')">
                <span class="iconfont icon-daoru"></span>
              </label>
            </el-tooltip>

            <!-- 导出聊天记录 -->
            <el-tooltip class="item" effect="dark" :content="$t('chatoperation.msg_export')" placement="top">
              <label @click="handleSyncOperation('msg:list:export:json')">
                <span class="iconfont icon-daochu"></span>
              </label>
            </el-tooltip>

            <!-- 上传文件 -->
            <el-tooltip class="item" effect="dark" :content="$t('chatoperation.msg_img_upload')" placement="top">
              <label for="imgFile">
                <span class="iconfont icon-tupian"></span>
              </label>
            </el-tooltip>

            <!-- 上传文本 -->
            <el-tooltip class="item" effect="dark" :content="$t('chatoperation.msg_file_upload')" placement="top">
              <label for="docFile">
                <span class="iconfont icon-wenben"></span>
              </label>
            </el-tooltip>

            <input type="file" name="" id="imgFile" @change="handleSendImg" accept="image/*" />
            <input type="file" name="" id="docFile" @change="handleSendFile" accept="application/*,text/*" />

            <!-- 导入当前会话内容 -->
            <input type="file" ref="refOnUpdateJosnArr" @change="e => handleSyncOperation('msg:list:import:file', e)" style="display: none" />
          </div>
        </el-col>
      </el-row>
    </div>

    <!-- 加载进度 -->
    <Loading :acqStatus="acqStatus" />

    <!-- 聊天区域 -->
    <div class="botoom" style="background-color: rgb(50, 54, 68)">
      <!-- 聊天内容区域 -->
      <div class="chat-content" ref="refChatContent" @scroll="handleOnScroll">
        <div class="chat-wrapper" v-for="item in chatList" :key="item.id">
          <!-- 渲染GPT回复 -->
          <div class="chat-chatgpt" v-if="item.uid !== 'player_fake_id'">
            <!-- 信息类型，0文字，1图片, 2文件 -->

            <!-- 渲染消息 -->
            <div class="chat-text" v-if="item.chatType == 0">
              <el-row :gutter="20">
                <el-col :span="2">
                  <SvgIcon name="chat" @click="copyToClipboardWithMessage(item.msg, '已复制')" size="22"></SvgIcon>
                </el-col>
                <el-col :span="21"> </el-col>
              </el-row>
              <Markdown :content="item.msg.trim()"></Markdown>
            </div>

            <!-- 渲染图片 -->
            <div class="chat-img" v-if="item.chatType == 1">
              <img :src="item.msg" alt="表情" v-if="item.extend.imgType == 1" style="width: 100px; height: 100px" />
              <el-image style="border-radius: 10px" :src="item.msg" :preview-src-list="srcImgList" v-else> </el-image>
            </div>

            <!-- 渲染文件 -->
            <div class="chat-img" v-if="item.chatType == 2">
              <div class="word-file">
                <FileCard :fileType="item.extend.fileType" :file="item.msg"></FileCard>
              </div>
            </div>

            <!-- 渲染信息 -->
            <div class="info-time">
              <img :src="item.headImg" alt="" />
              <span>{{ item.name }}</span>
              <span>{{ item.time }}</span>
            </div>
          </div>

          <!-- 渲染自身问题 -->

          <!-- 信息类型，0文字，1图片, 2文件 -->
          <div class="chat-me" v-else>
            <div class="chat-text" v-if="item.chatType == 0">
              <span>{{ item.msg }}</span>
            </div>
            <div class="chat-img" v-if="item.chatType == 1">
              <img :src="item.msg" alt="表情" v-if="item.extend.imgType == 1" style="width: 100px; height: 100px" />
              <el-image style="max-width: 300px; border-radius: 10px" :src="item.msg" :preview-src-list="srcImgList" v-else> </el-image>
            </div>
            <div class="chat-img" v-if="item.chatType == 2">
              <div class="word-file">
                <FileCard :fileType="item.extend.fileType" :file="item.msg"></FileCard>
              </div>
            </div>

            <!-- 自身资料展示 -->
            <div class="info-time">
              <span>{{ item.name }}</span>
              <span>{{ item.time }}</span>
              <img :src="item.headImg" alt="" />
            </div>
          </div>
        </div>
      </div>

      <!-- 输入区域 -->
      <div class="chatInputs">
        <!-- 表情 -->
        <div class="emoji boxinput" @click="handleSyncOperation('msg:operate:emoji:switch')" v-show="buttonStatus">
          <img src="/img/emoji/smiling-face.png" alt="" />
        </div>
        <!-- 录音 -->
        <div class="luyin boxinput" @click="handleAsyncOperation('msg:voice:stop')" v-if="recording" v-show="buttonStatus">
          <el-icon style="margin-top: 17%"><Microphone style="width: 25px; height: 25px" /></el-icon>
        </div>
        <div class="luyin boxinput" @click="handleAsyncOperation('msg:voice:start')" v-if="!recording" v-show="buttonStatus">
          <el-icon style="margin-top: 17%"><Mute style="width: 25px; height: 25px" /></el-icon>
        </div>

        <!-- emoji表情列表 -->
        <div class="emoji-content" v-show="buttonStatus">
          <Emoji v-show="showEmoji" @sendEmoji="handleSendEmoji" @closeEmoji="handleSyncOperation('msg:operate:emoji:switch')"></Emoji>
        </div>

        <!-- 输入框 -->
        <textarea
          id="textareaMsg"
          :placeholder="$t('placeholder.question')"
          class="inputs"
          v-autoheight
          style="z-index: 99999; min-height: 50px; max-height: 400px; max-width: 100%; min-width: 45%"
          maxlength="2048"
          rows="3"
          dir="auto"
          autocorrect="off"
          aria-autocomplete="both"
          spellcheck="false"
          autocapitalize="off"
          autocomplete="off"
          v-model="inputMsg"
          @keyup.enter="handleKeyDown"
        ></textarea>

        <!-- 发送 -->
        <div>
          <div class="send boxinput" @click="handleSendText">
            <img src="/img/emoji/rocket.png" alt="" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { saveAs } from 'file-saver';
import { useI18n } from 'vue-i18n';
// import { useRoute, useRouter } from 'vue-router';

import HeadPortrait from '@/components/HeadPortrait.vue';
import Emoji from '@/components/Emoji.vue';
import FileCard from '@/components/FileCard.vue';
import Markdown from '@/components/Markdown.vue';
import Loading from '@/components/Loading.vue';

import { copyToClipboardWithMessage } from '@/utils/util';
import { useWindowConfiguration, useChatWindowSendMessages, useChatWindowSendVoice } from '@/componsitions/chatWindow.componsition';

const { t: $t } = useI18n();
// const route = useRoute();
// const router = useRouter();

// 宏定义
const props = defineProps({
  chatModelType: Number,
  settingInfo: Object,
  chatCompleteModelInfo: Object,
  default: () => ({})
});
const emits = defineEmits(['modelCardSort', 'fineTunesCardSort']);

// DOM数据
const refChatContent = ref<HTMLElement>(null);
const refTextInput = ref<HTMLElement>(null);
const refOnUpdateJosnArr = ref<HTMLElement>(null);

// 业务Hooks
const { buttonStatus, chatWindowGridSpanSpan } = useWindowConfiguration();
const { acqStatus, inputMsg, chatList, srcImgList, showEmoji, handleKeyDown, handleSendText, handleOnScroll, handleScrollBottom, handleSendImg, handleSendFile, handleSendEmoji, handleTranslateVoice } = useChatWindowSendMessages(props, emits, refChatContent); // prettier-ignore
const { recording, handleStartRecording, handleStopRecording } = useChatWindowSendVoice(props, emits);

// 暴露函数
const getMesList = () => chatList.value;
const inputMessage = (msg: string) => (inputMsg.value = msg);
const clearMsgList = () => (chatList.value = []);
const assignmentMesList = (list: Array<any>) => (chatList.value = list);
const sendMsg = (msg: any) => {
  chatList.value.push(msg);
  handleScrollBottom();
};

defineExpose({ inputMessage, getMesList, clearMsgList, assignmentMesList, sendMsg });

// 同步操作
// msg:list:clear -> 清空当前内容
// msg:list:import:json -> 导入当前内容json
// msg:list:export:json -> 导出当前内容json
// msg:list:import:file -> 导入当前会话内容file
// msg:operate:emoji:switch -> 切换emoji表情
const handleSyncOperation = (type: string, args?: any) => {
  switch (type) {
    case 'msg:list:clear': {
      chatList.value = [];
      break;
    }
    case 'msg:list:import:json': {
      refOnUpdateJosnArr.value.click();
      break;
    }
    case 'msg:list:export:json': {
      let jsonString = JSON.stringify(chatList.value); // 将数组转为JSON字符串
      let blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      saveAs(blob, `data_${+new Date()}.json`);
      break;
    }
    case 'msg:list:import:file': {
      const file = args.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result; // 文件内容
        const parsed = JSON.parse(fileContent.toString()); // 转换为数组
        chatList.value = chatList.value.concat(parsed);
      };
      reader.readAsText(file);
      break;
    }
    case 'msg:operate:emoji:switch': {
      showEmoji.value = !showEmoji.value;
      break;
    }
    default:
      break;
  }
};

// 异步操作
// msg:voice:stop -> 停止录音
// msg:voice:start -> 开始录音
const handleAsyncOperation = async (type: string, args?: any) => {
  switch (type) {
    case 'msg:voice:stop': {
      const formData: any = await handleStopRecording();
      await handleTranslateVoice(formData);
      break;
    }
    case 'msg:voice:start': {
      await handleStartRecording();
      break;
    }
    default:
      break;
  }
};
</script>

<!-- 常规组件样式 -->
<style lang="scss" scoped>
.iconfont:hover {
  color: rgb(29, 144, 245);
  .block {
    opacity: 1;
  }
}
::v-deep {
  .el-textarea__inner {
    background-color: rgb(66, 70, 86);
    border-radius: 15px;
    border: 2px solid rgb(34, 135, 225);
    box-sizing: border-box;
    transition: 0.2s;
    font-size: 20px;
    color: #fff;
    font-weight: 100;
    width: 98%;
    height: 70px !important;
  }
}
textarea::-webkit-scrollbar {
  width: 3px;
}
textarea::-webkit-scrollbar-thumb {
  background-color: rgb(66, 70, 86);
  border-radius: 50%;
}
</style>

<!-- 内容展示区域样式 -->
<style lang="scss" scoped>
.chat-window {
  width: 100%;
  height: 100%;
  margin-left: 0px;
  position: relative;

  .top {
    &::after {
      content: '';
      display: block;
      clear: both;
    }

    .head-pic {
      float: left;
    }

    .info-detail {
      float: left;
      margin-left: 30px;

      .name {
        font-size: 20px;
        font-weight: 600;
        color: #fff;
        text-align: left;
      }

      .detail {
        color: #9e9e9e;
        text-align: left;
        font-size: 13px;
        margin-top: 2px;
        width: 450px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }

    .other-fun {
      float: right;
      margin-top: 20px;
      span {
        margin-left: 30px;
        cursor: pointer;
      }

      input {
        display: none;
      }
    }
  }

  .textarea {
    &:focus {
      outline: none;
    }
  }

  .botoom {
    width: 100%;
    height: 85vh;
    background-size: 100% 100%;
    border-radius: 20px;
    padding: 0px;
    box-sizing: border-box;
    position: relative;

    .chat-content {
      width: 100%;
      height: 85%;
      overflow-y: scroll;
      padding: 20px;
      box-sizing: border-box;
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        background-color: rgb(66, 70, 86);
        border-radius: 50%;
      }

      /* GPT回复 */
      .chat-chatgpt {
        width: 100%;
        float: left;
        margin-bottom: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-start;

        .chat-text {
          float: left;
          max-width: 90%;
          padding: 15px;
          max-width: 650px;
          border-radius: 20px 20px 20px 5px;
          background-color: #fff;
        }

        .chat-img {
          img {
            max-width: 300px;
            max-height: 200px;
            border-radius: 10px;
          }
        }

        .info-time {
          margin: 10px 0;
          color: #fff;
          font-size: 14px;
          display: flex;
          justify-content: flex-start;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 10px;
          }

          span {
            line-height: 30px;
          }

          span:last-child {
            color: rgb(101, 104, 115);
            margin-left: 10px;
            vertical-align: middle;
          }
        }
      }

      /* 用户问答 */
      .chat-me {
        width: 100%;
        float: right;
        margin-bottom: 20px;
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        align-items: flex-end;

        .chat-text {
          float: right;
          max-width: 90%;
          padding: 15px;
          border-radius: 20px 20px 5px 20px;
          background-color: #95ec69;
          color: #000;
          word-break: break-all;
        }

        .chat-img {
          img {
            max-width: 300px;
            max-height: 200px;
            border-radius: 10px;
          }
        }

        .info-time {
          margin: 10px 0;
          color: #fff;
          font-size: 14px;
          display: flex;
          justify-content: flex-end;

          img {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            vertical-align: middle;
            margin-left: 10px;
          }

          span {
            line-height: 30px;
          }

          span:first-child {
            color: rgb(101, 104, 115);
            margin-right: 10px;
            vertical-align: middle;
          }
        }
      }
    }

    .chatInputs {
      width: 100%;
      position: absolute;
      bottom: 0;
      margin: 3%;
      display: flex;
      background-color: #323644;
      border-radius: 20px;
      .boxinput {
        width: 50px;
        height: 50px;
        background-color: rgb(50, 54, 68);
        border-radius: 15px;
        border: 1px solid rgb(80, 85, 103);
        box-shadow: 0px 0px 5px 0px rgb(0, 136, 255);
        position: relative;
        cursor: pointer;

        img {
          width: 30px;
          height: 30px;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
        }
      }

      .emoji {
        transition: 0.3s;
        width: 50px;
        min-width: 50px;
      }

      .luyin {
        color: #fff;
        margin-left: 1.5%;
        font-size: 30px;
        text-align: center;
        transition: 0.3s;
        width: 50px;
        min-width: 50px;
      }

      .inputs {
        width: 95%;
        height: 50px;
        background-color: rgb(66, 70, 86);
        border-radius: 15px;
        border: 2px solid rgb(34, 135, 225);
        padding: 10px;
        box-sizing: border-box;
        transition: 0.2s;
        font-size: 16px;
        color: #fff;
        font-weight: 100;
        margin: 0 20px;

        &:focus {
          outline: none;
        }
      }

      .send {
        background-color: rgb(29, 144, 245);
        border: 0;
        transition: 0.3s;
        box-shadow: 0px 0px 5px 0px rgba(0, 136, 255);

        &:hover {
          box-shadow: 0px 0px 10px 0px rgba(0, 136, 255);
        }
      }
    }
  }
}

@media only screen and (min-width: 768px) {
  // 当屏幕宽度大于或等于768px时
  .chat-window {
    margin-left: 20px;
    .botoom {
      padding: 20px;
    }
  }
  .chat-window {
    .botoom {
      .chatInputs {
        width: 90%;
      }
    }
  }
}
</style>
