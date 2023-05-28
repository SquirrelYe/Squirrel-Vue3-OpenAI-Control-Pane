import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';
import { CustomFormData } from '@/utils/openaifix';

/**
 * @description OpenAI Models API 模型接口
 * @author willye
 * @time 2023.05.19 17:11:26
 */
export class OpenAIModelAPI {
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

  // OpenAI List Models 列出所有模型
  public listModels = async () => {
    const result = await this.openaiInstance.listModels();
    return result;
  };

  // OpenAI Retrieve a Model 获取模型信息
  public retrieveModel = async (modelId: string) => {
    const result = await this.openaiInstance.retrieveModel(modelId, {});
    return result;
  };
}
