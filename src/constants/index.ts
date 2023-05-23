// 模型描述
export const desp_model: Record<string, string> = {
  'gpt-3.5-turbo': 'chatgpt v3.5 所基于的模型',
  ada: '自然语言模型，OpenAI提供的最快，最便宜的模型，但性能也最差，含有ada字眼的模型都是基于ada训练而来',
  babbage: '自然语言模型，性能比ada强，价格比ada贵，规模比ada大，含有babbage字眼的模型都是基于babbage训练而来',
  curie: '自然语言模型，性能优于ada，babbage，价钱也更贵，规模更大，含有curie字眼的模型都是基于curie训练而来',
  davinci: '自然语言模型，在ada，babbage，curie和davinci中性能最优，规模最大，速度最慢，价钱最贵，含有davinci字眼的模型都是基于davinci训练而来，目前chatgpt基于davinci微调而来',
  'whisper-1': '强大的语音转换文本的模型'
};

// 其他描述
export const other_desps: Record<string, string> = {
  code: '的AI代码处理模型',
  similarity: '的AI文本相似度计算模型',
  document: '的大文档处理模型',
  text: '的文本处理模型',
  instruct: '的人工指令微调模型',
  if: '一个分支'
};

export const desp_keys = Object.keys(desp_model);
export const other_desp_keys = Object.keys(other_desps);
