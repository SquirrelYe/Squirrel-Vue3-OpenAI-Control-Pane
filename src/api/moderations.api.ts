import { OpenAIApi } from 'openai';

/**
 * @description OpenAI Moderation API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAIModerationAPI {
  constructor(private openaiInstance: OpenAIApi) {}

  // OpenAI Create moderation 创建审查
  public createModeration = async () => {
    const result = await this.openaiInstance.createModeration({
      input: 'I want to kill them.'
    });
    return result;
  };
}
