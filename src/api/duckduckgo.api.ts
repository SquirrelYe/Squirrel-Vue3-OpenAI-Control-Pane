import { DUCKDUCKGO_PROXY_URL } from '@/store/mutation-types';

/**
 * @description DuckDuckGo API 模型接口
 * @author willye
 * @time 2023.05.28 09:46:42
 */
export class DuckDuckGoSearchAPI {
  private max_results: number;
  private region: string = 'us-en';

  constructor(max_results: number, region?: string) {
    this.max_results = max_results;
    this.region = region || 'us-en';
  }

  // createDuckDuckGoSearch 创建DuckDuckGo搜索
  public createDuckDuckGoSearch = async (query: string) => {
    const context = 'max_results=' + this.max_results + '&q=' + query + '&region=' + this.region;
    return await fetch(DUCKDUCKGO_PROXY_URL + `/search?${context}`);
  };
}
