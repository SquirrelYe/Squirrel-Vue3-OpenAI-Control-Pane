import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';
import { CustomFormData } from '@/utils/openaifix';

/**
 * @description OpenAI Image API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAIImageAPI {
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

  // OpenAI Create Image 生成图片
  public createImage = async (body: any) => {
    const result = await this.openaiInstance.createImage(body);
    return result;
  };

  // OpenAI Create image edit 生成图片编辑
  public createImageEdit = async (image: File, prompt: string, mask?: File, n?: number, size?: string, responseFormat?: string, user?: string) => {
    const result = await this.openaiInstance.createImageEdit(image, prompt, mask, n, size, responseFormat, user);
    return result;
  };

  // OpenAI Create image variation 生成图片变体
  public createImageVariation = async (image: File, n?: number, size?: string, responseFormat?: string, user?: string) => {
    const result = await this.openaiInstance.createImageVariation(image, n, size, responseFormat, user);
    return result;
  };
}
