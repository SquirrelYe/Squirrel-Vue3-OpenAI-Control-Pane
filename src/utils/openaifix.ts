/**
 * @description OpenAI API 修复接口报错的问题。
 * @author willye
 * @time 2023.05.28 14:28:48
 * @issue https://github.com/openai/openai-node/issues/75
 */
export class CustomFormData extends FormData {
  getHeaders() {
    return {};
  }
}
