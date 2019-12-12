import Client = require('request');
import { environment } from '../environment';

export class MatterMostService {
  token: string;

  headers() {
    const headers = {
      'Content-Type': 'application/json'
    };
    if (this.token) {
      headers['Authorization'] = 'Bearer ' + this.token;
    }
    return headers;
  }

  static async post(url: string, headers: any, body: any): Promise<any> {
    return new Promise((resolve, reject) => {
      Client.post({
        url: url, headers: headers, json: body
      }, (error, response, body) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            console.error(response.statusCode, body);
            reject(response.statusCode);
          } else {
            resolve({status: response.statusCode, body: body, headers: response.headers});
          }
        }
      });
    });
  }

  async signIn(email: string, password: string) {
    const url = environment.matterMost.host + '/api/v4/users/login';
    const headers = this.headers();
    const body = {
      login_id: email,
      password: password,
    };
    const response = await MatterMostService.post(url, headers, body);
    this.token = response.headers.token;
  }

  async postMessage(channelId: string, message: string) {
    const url = environment.matterMost.host + '/api/v4/posts';
    const headers = this.headers();
    const body = {
      channel_id: channelId,
      message: message
    };
    await MatterMostService.post(url, headers, body);
  }
}
