import { Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  // Danh sách proxy: http://username:password@host:port
  private readonly proxies: string[] = [
    'http://user:pass@proxy1:port',
    'http://user:pass@proxy2:port',
    'http://user:pass@proxy3:port',
  ];

  private getRandomProxy(): string {
    const proxy = this.proxies[Math.floor(Math.random() * this.proxies.length)];
    this.logger.debug(`Using proxy: ${proxy}`);
    return proxy;
  }

  async get(url: string, options?: any) {
    const proxy = this.getRandomProxy();
    const agent = new HttpsProxyAgent(proxy);

    const instance: AxiosInstance = axios.create({
      httpsAgent: agent,
      proxy: false, // bắt buộc khi dùng custom agent
      timeout: 10000,
      headers: {
        'User-Agent': 'NestJS-ProxyBot',
        ...(options?.headers || {}),
      },
    });

    return instance.get(url);
  }

  async post(url: string, data: any, options?: any) {
    const proxy = this.getRandomProxy();
    const agent = new HttpsProxyAgent(proxy);

    const instance: AxiosInstance = axios.create({
      httpsAgent: agent,
      proxy: false,
      timeout: 10000,
      headers: {
        'User-Agent': 'NestJS-ProxyBot',
        ...(options?.headers || {}),
      },
    });

    return instance.post(url, data);
  }
}
