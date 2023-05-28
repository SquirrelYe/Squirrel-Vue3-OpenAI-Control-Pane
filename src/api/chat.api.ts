import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';
import { CustomFormData } from '@/utils/openaifix';

/**
 * @description OpenAI Chat API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAIChatAPI {
  private openaiInstance: OpenAIApi;
  private token: string;
  private organization: string;

  constructor(token: string, organization?: string) {
    const configuration = new Configuration({ apiKey: token, organization: organization, formDataCtor: CustomFormData });
    const openaiInstance = new OpenAIApi(configuration);
    this.openaiInstance = openaiInstance;
    this.token = token;
    this.organization = organization;
  }

  // OpenAI createChatCompletion 创建聊天补全
  public createChatCompletion = async (body: any) => {
    const result = await this.openaiInstance.createChatCompletion(body);
    return result;
  };

  // OpenAI createChatStreamCompletion 流式创建Chat Completion
  public createChatStreamCompletion = async (body: any) => {
    return await fetch(OPENAI_PROXY_URL + '/v1/chat/completions', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });
  };
}
