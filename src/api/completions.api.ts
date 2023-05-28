import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';

/**
 * @description OpenAI Competions API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAICompetionAPI {
  private openaiInstance: OpenAIApi;
  private token: string;
  private organization: string;

  constructor(token: string, organization?: string) {
    const configuration = new Configuration({ apiKey: token, organization: organization });
    const openaiInstance = new OpenAIApi(configuration);
    this.openaiInstance = openaiInstance;
    this.token = token;
    this.organization = organization;
  }

  // OpenAI createCompletion 创建文本补全
  public createCompletion = async (body: any) => {
    const result = await this.openaiInstance.createCompletion(body);
    return result;
  };

  // OpenAI createStreamCompletion 流式创建文本补全
  public createStreamCompletion = async (body: any) => {
    return await fetch(OPENAI_PROXY_URL + '/v1/completions', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Authorization: 'Bearer ' + this.token,
        'Content-Type': 'application/json'
      }
    });
  };
}
