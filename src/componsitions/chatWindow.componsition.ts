import { ref, onBeforeMount, onUnmounted, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { ElMessage } from 'element-plus';

import { animation, getNowTime, formatDateTime } from '@/utils/util';
import { AI_HEAD_IMG_URL, USER_HEAD_IMG_URL, USER_NAME } from '@/store/mutation-types';

import { OpenAICompetionAPI } from '@/api/completions.api';
import { OpenAIChatAPI } from '@/api/chat.api';
import { OpenAIEditAPI } from '@/api/edits.api';
import { OpenAIImageAPI } from '@/api/images.api';
import { OpenAIEmbeddingAPI } from '@/api/embeddings.api';
import { OpenAIAudioAPI } from '@/api/audio.api';
import { OpenAIModerationAPI } from '@/api/moderations.api';
import { OpenAIEngineAPI } from '@/api/engines.api';

import { DuckDuckGoSearchAPI } from '@/api/duckduckgo.api';

import type { Ref } from 'vue';

// 窗口数据设置
export const useWindowConfiguration = () => {
  const buttonStatus = ref(true);
  const chatWindowGridSpanSpan = ref([1, 17, 6]);

  // 监听窗口的变化
  const handleResize = () => {
    if (window.innerWidth <= 700) {
      nextTick(() => {
        document.querySelectorAll<HTMLElement>('.chat-content')[0].style.height = '93%';
        buttonStatus.value = false;
        const textareaMsg = document.getElementById('textareaMsg');
        textareaMsg.style.marginLeft = '0px';
        chatWindowGridSpanSpan.value = [14, 0, 10];
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          document.querySelectorAll<HTMLElement>('.chatInputs')[0].style.margin = '0%';
        } else {
          document.querySelectorAll<HTMLElement>('.chatInputs')[0].style.margin = '3%';
        }
      });
    } else {
      nextTick(() => {
        document.querySelectorAll<HTMLElement>('.chatInputs')[0].style.margin = '3%';
        document.querySelectorAll<HTMLElement>('.chat-content')[0].style.height = '88%';
        buttonStatus.value = true;
        chatWindowGridSpanSpan.value = [1, 17, 6];
      });
    }
  };

  onBeforeMount(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
  });

  return {
    buttonStatus,
    chatWindowGridSpanSpan
  };
};

// 聊天窗口发送数据
export const useChatWindowSendMessages = (props: Record<string, any>, emits: any, refChatContent: Ref<HTMLElement>) => {
  const isAutoScroll = ref(true);
  const acqStatus = ref(true);
  const updateImage = ref(null);
  const inputMsg = ref('');
  const chatList = ref([]);
  const srcImgList = ref([]);
  const showEmoji = ref(false);

  const { t: $t } = useI18n();

  // 监听键盘事件，按下回车键，没按shift键，发送信息
  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13 && !event.shiftKey) {
      handleSendText();
    }
  };

  // 监听聊天窗口滚动事件
  const handleOnScroll = () => {
    const scrollDom = refChatContent.value;
    const scrollTop = scrollDom.scrollTop;
    const offsetHeight = scrollDom.offsetHeight;
    const scrollHeight = scrollDom.scrollHeight;
    // 当滚动到底部，设置 isAutoScroll 为 true
    if (Math.ceil(scrollTop) + offsetHeight >= scrollHeight) isAutoScroll.value = true;
    // 否则，用户正在手动滑动，设置为 false，停止自动滚动
    else isAutoScroll.value = false;
  };

  // 获取窗口高度并滚动至最底层
  const handleScrollBottom = () => {
    nextTick(() => {
      if (!isAutoScroll.value) return; // 如果 isAutoScroll 为 false，不执行滚动方法
      const scrollDom = refChatContent.value;
      animation(scrollDom);
    });
  };

  // 发送文字信息
  const handleSendText = async () => {
    const dateNow = formatDateTime(getNowTime());
    const params: Record<string, any> = {};

    acqStatus.value = false;

    // 1. 打开图片开关，修改图片模式开启
    if (props.settingInfo.openChangePicture) {
      // 检查是否上传文件
      if (updateImage.value == null) {
        nextTick(() => (acqStatus.value = true));
        ElMessage.warning($t('message.edit_picture'));
        return;
      }

      // 通过验证后，上传文件
      else {
        const chatMsg = {
          headImg: USER_HEAD_IMG_URL,
          name: USER_NAME,
          time: formatDateTime(getNowTime()),
          msg: inputMsg.value,
          chatType: 0, // 信息类型，0文字，1图片
          uid: 'player_fake_id' // uid
        };

        handleSendMsg(chatMsg);

        const image = updateImage.value;
        const prompt = inputMsg.value;
        const mask = null;
        const n = props.settingInfo.n;
        const size = props.settingInfo.size;
        const responseFormat = 'url';
        const user = '';

        new OpenAIImageAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createImageEdit(image, prompt, mask, n, size, responseFormat, user).then(response => {
          for (const imgInfo of response.data.data) {
            const imgResMsg = {
              headImg: AI_HEAD_IMG_URL,
              name: props.chatCompleteModelInfo.name,
              time: formatDateTime(getNowTime()),
              msg: imgInfo.url,
              chatType: 1, // 信息类型，0文字，1图片
              extend: {
                imgType: 2 // (1表情，2本地图片)
              },
              uid: props.chatCompleteModelInfo.id //uid
            };

            handleSendMsg(imgResMsg);
            srcImgList.value.push(imgInfo.url);
          }

          updateImage.value = null;
          acqStatus.value = true;
        });

        inputMsg.value = '';

        return;
      }
    }

    // 2. 发送文本信息，聊天 or 创建图片模式
    if (inputMsg.value) {
      const chatMsg = {
        headImg: USER_HEAD_IMG_URL,
        name: USER_NAME,
        time: dateNow,
        msg: inputMsg.value,
        chatType: 0, // 信息类型，0文字，1图片
        uid: 'player_fake_id' // uid
      };
      handleSendMsg(chatMsg);

      // ① 创建图片模式
      if (props.settingInfo.openProductionPicture) {
        params.prompt = inputMsg.value;
        params.n = props.settingInfo.n;
        params.size = props.settingInfo.size;

        new OpenAIImageAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createImage(params).then(response => {
          for (let imgInfo of response.data.data) {
            let imgResMsg = {
              headImg: AI_HEAD_IMG_URL,
              name: props.chatCompleteModelInfo.name,
              time: formatDateTime(getNowTime()),
              msg: imgInfo.url,
              chatType: 1, // 信息类型，0文字，1图片
              extend: {
                imgType: 2 // (1表情，2本地图片)
              },
              uid: props.chatCompleteModelInfo.id //uid
            };

            handleSendMsg(imgResMsg);
            srcImgList.value.push(imgInfo.url);
            acqStatus.value = true;
          }
        });
      }

      // ② 如果是文字模式则进入，文本聊天
      else {
        params.model = props.chatCompleteModelInfo.id;

        // 组装Complete参数
        params.max_tokens = props.settingInfo.chat.MaxTokens;
        params.temperature = props.settingInfo.chat.Temperature;
        params.top_p = props.settingInfo.chat.TopP;
        params.n = props.settingInfo.chat.n;
        params.stream = props.settingInfo.chat.stream;
        params.stop = props.settingInfo.chat.stop;
        params.presence_penalty = props.settingInfo.chat.PresencePenalty;
        params.frequency_penalty = props.settingInfo.chat.FrequencyPenalty;

        const chatBeforResMsg = {
          headImg: AI_HEAD_IMG_URL,
          name: props.chatCompleteModelInfo.name,
          time: formatDateTime(getNowTime()),
          msg: '',
          chatType: 0, // 信息类型，0文字，1图片
          uid: props.chatCompleteModelInfo.id // uid
        };

        // 执行Chat Complete
        if (props.chatCompleteModelInfo.id === 'gpt-3.5-turbo' || props.chatCompleteModelInfo.id === 'gpt-3.5-turbo-0301') handleChatCompletion(params, chatBeforResMsg);
        // 执行普通Complete
        else {
          // 0模型，1会话，2微调，3文件
          // 选择对话模型
          if (props.settingInfo.cutSetting === 0) {
            if (props.chatCompleteModelInfo.id === 'text-davinci-003') handleCompletion(params, chatBeforResMsg);
            else {
              ElMessage.error('暂时不支持gpt-3.5-turbo、gpt-3.5-turbo-0301、text-davinci-003以外的模型聊天~');
              nextTick(() => (acqStatus.value = true));
            }
          }
          // 不是对话模型
          else handleCompletion(params, chatBeforResMsg);
        }
      }

      if (props.chatModelType == 0) emits('modelCardSort', props.chatCompleteModelInfo.id);
      if (props.chatModelType == 1) emits('fineTunesCardSort', props.chatCompleteModelInfo.id);

      inputMsg.value = '';
    }

    // 输入有误
    else {
      nextTick(() => (acqStatus.value = true));
      ElMessage.warning($t('message.msg_empty'));
    }
  };

  // 发送信息
  const handleSendMsg = (msg: any) => {
    chatList.value.push(msg);
    handleScrollBottom();
  };

  // 组装上下文数据
  const handleContextualAssemblyData = () => {
    const conversation = [];
    for (const chat of chatList.value.filter(chat => chat.chatType === 0)) {
      if (chat.uid == 'player_fake_id') conversation.push({ speaker: 'user', text: chat.msg });
      if (chat.uid == props.chatCompleteModelInfo.id) conversation.push({ speaker: 'agent', text: chat.msg });
    }
    return conversation;
  };

  // 读取流式数据
  const handleReadStream = async (reader: ReadableStreamDefaultReader<Uint8Array>, currentResLocation: number, type: string) => {
    const { done, value } = await reader.read();
    if (done) return;
    if (!chatList.value[currentResLocation].reminder) chatList.value[currentResLocation].reminder = '';

    let decoded = new TextDecoder().decode(value);
    decoded = chatList.value[currentResLocation].reminder + decoded;
    let decodedArray = decoded.split('data: ');
    let longstr = '';

    decodedArray.forEach(decoded_str => {
      try {
        decoded_str = decoded_str.trim();
        if (longstr === '') {
          JSON.parse(decoded_str);
        } else {
          decoded_str = longstr + decoded_str;
          longstr = '';
          JSON.parse(decoded_str);
        }
      } catch (e) {
        longstr = decoded_str;
        decoded_str = '';
      }

      if (decoded_str !== '') {
        if (decoded_str.trim() === '[DONE]') {
          return;
        } else {
          if (type === 'chat') {
            const response = JSON.parse(decoded_str).choices[0].delta.content ? JSON.parse(decoded_str).choices[0].delta.content : '';
            chatList.value[currentResLocation].msg = chatList.value[currentResLocation].msg + response;
            handleScrollBottom();
          } else {
            const response_1 = JSON.parse(decoded_str).choices[0].text;
            chatList.value[currentResLocation].msg = chatList.value[currentResLocation].msg + response_1;
          }
        }
      }
    });

    return handleReadStream(reader, currentResLocation, type);
  };

  // 发起Chat聊天
  const handleChatCompletion = async (params: Record<string, any>, chatBeforResMsg: Record<string, any>) => {
    let textContext = inputMsg.value;
    let itemContent: Record<string, any> = {};
    let noUrlNetMessage = '';

    // 打开联网对话，追加 DuckDuckGo 搜索结果
    // 注意：此处会将搜索结果追加到对话中，并追加Prompt（要求GPT根据给出的搜索结果进行总结，并用中文输出）
    if (props.settingInfo.openNet) {
      await new DuckDuckGoSearchAPI(props.settingInfo.max_results, 'us-en')
        .createDuckDuckGoSearch(textContext)
        .then(response => response.json())
        .then(data => {
          let netMessage = 'Web search results:  ';
          noUrlNetMessage = netMessage + '\n\n';
          for (let i = 0; i < data.length; i++) {
            netMessage += '[' + (i + 1) + '] "' + data[i].body.substring(0, 400) + '"  ';
            netMessage += 'URL:' + data[i].href + '  ';
            noUrlNetMessage += '[' + (i + 1) + '] "' + data[i].body.substring(0, 400) + '"     \n\n';
          }
          const date = new Date();
          const year = date.getFullYear();
          const month = date.getMonth() + 1;
          const day = date.getDate();
          const formattedDate = `${year}/${month}/${day}`;

          netMessage = netMessage.substring(0, 1500);
          netMessage += 'Current date:' + formattedDate + '  ';
          netMessage +=
            'Instructions: Using the provided web search results, write a comprehensive reply to the given query. ' +
            'Make sure to cite results using [[number](URL)] notation after the reference. If the provided search ' +
            'results refer to multiple subjects with the same name, write separate answers for each subject.' +
            'Query: ' +
            textContext +
            'Reply in 中文';

          itemContent = {};
          itemContent.time = formatDateTime(getNowTime());
          itemContent.msg = netMessage;
          itemContent.chatType = 0;
          itemContent.name = 'DuckDuckGo';
          itemContent.headImg = '/img/logo/duckduckgo.png';
          itemContent.uid = props.chatCompleteModelInfo.id;
          chatList.value.push(itemContent);

          const conversation = handleContextualAssemblyData();
          params.messages = conversation.map(item => {
            return {
              role: item.speaker === 'user' ? 'user' : 'assistant',
              content: item.text
            };
          });

          noUrlNetMessage += ' 您的问题: ' + textContext;
          itemContent.msg = noUrlNetMessage;
        });
    }

    // 未开启联网对话，组装上下文数据
    else {
      let conversation = handleContextualAssemblyData();
      params.messages = conversation.map(item => {
        return { role: item.speaker === 'user' ? 'user' : 'assistant', content: item.text };
      });
    }

    // 新增一个空的消息，占位，内容需要等待OpenAI返回
    handleSendMsg(chatBeforResMsg);

    // 获取当前消息的位置
    const currentResLocation = chatList.value.length - 1;

    // 发起请求，获取OpenAI返回的消息
    try {
      // 开启流式对话
      if (props.settingInfo.chat.stream) {
        const response = await new OpenAIChatAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createChatStreamCompletion(params);
        if (response.ok) {
          const reader = response.body.getReader();
          handleReadStream(reader, currentResLocation, 'chat');
        } else throw new Error('网络不稳定或key余额不足，请重试或更换key');
      }

      // 关闭流式对话
      else {
        const response = await new OpenAIChatAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createChatCompletion(params);
        if (response.status === 200) {
          const content = response.data.choices[0].message.content; // 获取"content"字段的值
          let decodedArray = content.split('');
          decodedArray.forEach((decoded: string) => (chatList.value[currentResLocation].msg = chatList.value[currentResLocation].msg + decoded));
        } else throw new Error('网络不稳定或key余额不足，请重试或更换key');
      }
    } catch (error) {
      // 异常捕获，填充展示
      const content = error.message;
      let decodedArray = content.split('');
      decodedArray.forEach((decoded: any) => (chatList.value[currentResLocation].msg = chatList.value[currentResLocation].msg + decoded));
    }

    acqStatus.value = true;
  };

  // 发起普通对话
  const handleCompletion = async (params: Record<string, any>, chatBeforResMsg: Record<string, any>) => {
    params.suffix = props.settingInfo.chat.suffix;
    params.echo = props.settingInfo.chat.echo;
    params.prompt = inputMsg.value;

    // 新增一个空的消息
    handleSendMsg(chatBeforResMsg);
    // 获取当前消息的位置
    const currentResLocation = chatList.value.length - 1;

    try {
      const response = await new OpenAICompetionAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createStreamCompletion(params);
      if (response.status === 404) {
        ElMessage.error($t('message.model_del'));
        return;
      } else if (response.status === 200) {
        const reader = response.body.getReader();
        handleReadStream(reader, currentResLocation, 'completion');
      } else throw new Error('网络不稳定或key余额不足，请重试或更换key');
    } catch (error) {
      // 异常捕获，填充展示
      const content = error.message;
      let decodedArray = content.split('');
      decodedArray.forEach((decoded: any) => (chatList.value[currentResLocation].msg = chatList.value[currentResLocation].msg + decoded));
    } finally {
      nextTick(() => (acqStatus.value = true));
    }
  };

  // 发送本地图片
  const handleSendImg = async (e: any) => {
    acqStatus.value = false;

    //获取文件
    const file = e.target.files[0];

    // 验证文件类型是否为PNG格式
    if (file.type !== 'image/png') {
      ElMessage.warning($t('message.valid_png'));
      nextTick(() => {
        acqStatus.value = true;
      });
      return;
    }

    // 验证文件大小是否小于4MB
    if (file.size > 4 * 1024 * 1024) {
      ElMessage.warning($t('message.less_4M'));
      nextTick(() => {
        acqStatus.value = true;
      });
      return;
    }

    if (props.settingInfo.openChangePicture) {
      updateImage.value = file;
      ElMessage.info($t('message.upload_complete'));
      e.target.files = null;
      nextTick(() => {
        acqStatus.value = true;
      });
      return;
    }

    const chatMsg: Record<string, any> = {
      headImg: USER_HEAD_IMG_URL,
      name: USER_NAME,
      time: formatDateTime(getNowTime()),
      msg: '',
      chatType: 1, // 信息类型，0文字，1图片, 2文件
      extend: {
        imgType: 2 // (1表情，2本地图片)
      },
      uid: 'player_fake_id'
    };

    if (!e || !window.FileReader) return; // 看是否支持FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file); // 关键一步，在这里转换的
    reader.onloadend = function () {
      chatMsg.msg = this.result; //赋值
      srcImgList.value.push(chatMsg.msg);
    };

    handleSendMsg(chatMsg);

    const response = await new OpenAIImageAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createImageVariation(file, props.settingInfo.n, props.settingInfo.size);
    for (const imgInfo of response.data.data) {
      const imgResMsg = {
        headImg: AI_HEAD_IMG_URL,
        name: props.chatCompleteModelInfo.name,
        time: formatDateTime(getNowTime()),
        msg: imgInfo.url,
        chatType: 1, // 信息类型，0文字，1图片
        extend: {
          imgType: 2 // (1表情，2本地图片)
        },
        uid: props.chatCompleteModelInfo.id // uid
      };
      handleSendMsg(imgResMsg);
      srcImgList.value.push(imgInfo.url);
    }

    acqStatus.value = true;
    e.target.files = null;
  };

  // 发送文件
  const handleSendFile = (e: any) => {
    const dateNow = formatDateTime(getNowTime());

    let chatMsg: Record<string, any> = {
      headImg: USER_HEAD_IMG_URL,
      name: USER_NAME,
      time: dateNow,
      msg: '',
      chatType: 2, // 信息类型，0文字，1图片, 2文件
      extend: {
        fileType: '' // (1word，2excel，3ppt，4pdf，5zpi, 6txt)
      },
      uid: 'player_fake_id'
    };

    let files = e.target.files[0]; // 文件名
    chatMsg.msg = files;

    if (files) {
      switch (files.type) {
        case 'application/msword':
        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          chatMsg.extend.fileType = 1;
          break;
        case 'application/vnd.ms-excel':
        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          chatMsg.extend.fileType = 2;
          break;
        case 'application/vnd.ms-powerpoint':
        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
          chatMsg.extend.fileType = 3;
          break;
        case 'application/pdf':
          chatMsg.extend.fileType = 4;
          break;
        case 'application/zip':
        case 'application/x-zip-compressed':
          chatMsg.extend.fileType = 5;
          break;
        case 'text/plain':
          chatMsg.extend.fileType = 6;
          break;
        default:
          chatMsg.extend.fileType = 0;
      }

      handleSendMsg(chatMsg);

      e.target.files = null;
    }
  };

  // 发送Emoji
  const handleSendEmoji = (emoji: string) => {
    const dateNow = formatDateTime(getNowTime());

    let chatMsg = {
      headImg: USER_HEAD_IMG_URL,
      name: USER_NAME,
      time: dateNow,
      msg: emoji,
      chatType: 1, // 信息类型，0文字，1图片
      extend: {
        imgType: 1 // (1表情，2本地图片)
      },
      uid: 'player_fake_id'
    };

    showEmoji.value = !showEmoji.value;

    handleSendMsg(chatMsg);
  };

  // 翻译/转录语音
  const handleTranslateVoice = async (result: any) => {
    const { file, model, temperature, responseFormat } = result;

    // 打开语言转文字
    if (props.settingInfo.translateAudio) {
      const response = await new OpenAIAudioAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createTranslation(file, model, '', responseFormat, temperature);
      inputMsg.value = response.data.text || (response.data as any); // 此处的返回值有BUG，需要等待OpenAI修复
    }

    // 音频转录为其他语言
    else {
      const language = props.settingInfo.language;
      const response = await new OpenAIAudioAPI(props.settingInfo.openaiKey, props.settingInfo.organization).createTranscription(file, model, '', responseFormat, temperature, language);
      inputMsg.value = response.data.text || (response.data as any); // 此处的返回值有BUG，需要等待OpenAI修复
    }
  };

  return {
    isAutoScroll,
    acqStatus,
    updateImage,
    inputMsg,
    chatList,
    srcImgList,
    showEmoji,
    handleKeyDown,
    handleOnScroll,
    handleScrollBottom,
    handleSendMsg,
    handleSendText,
    handleSendImg,
    handleSendFile,
    handleSendEmoji,
    handleTranslateVoice
  };
};

// 聊天窗口语言操作
export const useChatWindowSendVoice = (props: Record<string, any>, emits: any) => {
  const recorder = ref<MediaRecorder>();
  const recording = ref(false);
  const audioChunks = ref([]);

  const { t: $t } = useI18n();

  // 开始录音
  const handleStartRecording = () => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(stream => {
        recorder.value = new MediaRecorder(stream);
        recorder.value.addEventListener('dataavailable', event => {
          audioChunks.value.push(event.data);
        });
        recording.value = true;
        recorder.value.start();
        // 在这里使用录音器
        ElMessage.success($t('message.start_recording'));
      })
      .catch(error => {
        ElMessage.error($t('message.fail_audio'));
        console.log(error);
      });
  };

  // 停止录音
  const handleStopRecording = () => {
    return new Promise(resolve => {
      recorder.value.stop();
      recording.value = false;

      recorder.value.ondataavailable = event => {
        const blob = new Blob([event.data], { type: 'audio/wav' });
        const file = new File([blob], 'recording.wav', { type: 'audio/wav', lastModified: Date.now() });

        resolve({
          file,
          model: 'whisper-1',
          temperature: props.settingInfo.temperatureAudio,
          responseFormat: 'text'
        });
      };

      ElMessage.success($t('message.end_recording'));
    });
  };

  return {
    recorder,
    recording,
    handleStopRecording,
    handleStartRecording
  };
};
