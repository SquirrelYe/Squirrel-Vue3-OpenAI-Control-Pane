import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';
import { CustomFormData } from '@/utils/openaifix';

/**
 * @description OpenAI Audio API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAIAudioAPI {
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

  // OpenAI Create transcription 创建音频转录
  public createTranscription = async (file: File, model: string, prompt?: string, responseFormat?: string, temperature?: number, language?: string) => {
    const result = await this.openaiInstance.createTranscription(file, model, prompt, responseFormat, temperature, language);
    return result;
  };

  // OpenAI Create translation 创建音频翻译
  public createTranslation = async (file: File, model: string, prompt?: string, responseFormat?: string, temperature?: number) => {
    const result = await this.openaiInstance.createTranslation(file, model, prompt, responseFormat, temperature);
    return result;
  };
}
