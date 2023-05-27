import { OpenAIApi } from 'openai';

/**
 * @description OpenAI Models API 模型接口
 * @author willye
 * @time 2023.05.19 17:11:26
 */
export class OpenAIModelAPI {
  constructor(private openaiInstance: OpenAIApi) {}

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
