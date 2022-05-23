import axios from 'axios';

export class ApiRepository {
  private async request(
    requestType: string,
    url: string,
    payload?: any,
    headers?: any
  ): Promise<any> {
    const isGetRequest = requestType === 'get';
    const config = { headers } as any;

    try {
      const { data } = await axios[requestType](
        ...(!isGetRequest ? [url, payload, config] : [url, config])
      );

      return data;
    } catch (error) {
      const { message = 'Internal Server Error', response = {} as any } = error;
      const { statusText } = response;
      const errorMessage = statusText || message;

      throw new Error(errorMessage);
    }
  }

  public getRequest(url: string, payload?: any, headers?: any): Promise<any> {
    return this.request('get', url, payload, headers);
  }

  public postRequest(url: string, body: any, headers?: any): Promise<any> {
    return this.request('post', url, body, headers);
  }
}
