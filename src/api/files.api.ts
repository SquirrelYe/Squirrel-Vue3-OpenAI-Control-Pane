import { OpenAIApi, Configuration } from 'openai';
import { OPENAI_PROXY_URL } from '@/store/mutation-types';
import { CustomFormData } from '@/utils/openaifix';

/**
 * @description OpenAI File API 模型接口
 * @author willye
 * @time 2023.05.21 19:03:42
 */
export class OpenAIFileAPI {
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

  // OpenAI List Files 列出所有文件
  public listFiles = async () => {
    const result = await this.openaiInstance.listFiles();
    return result;
  };

  // OpenAI Create File 创建文件
  public createFile = async () => {
    const file = new File(['file.txt'], 'file.txt', { type: 'text/plain' });
    const purpose = 'fine-tune';
    const result = await this.openaiInstance.createFile(file, purpose);
    return result;
  };

  // OpenAI Delete File 删除文件
  public deleteFile = async () => {
    const fileId = 'file-1';
    const result = await this.openaiInstance.deleteFile(fileId);
    return result;
  };

  // OpenAI Retrieve File 获取文件
  public retrieveFile = async () => {
    const fileId = 'file-1';
    const result = await this.openaiInstance.retrieveFile(fileId);
    return result;
  };

  // OpenAI Retrieve file content 获取文件内容
  public downloadFile = async () => {
    const fileId = 'file-1';
    const result = await this.openaiInstance.downloadFile(fileId);
    return result;
  };
}
