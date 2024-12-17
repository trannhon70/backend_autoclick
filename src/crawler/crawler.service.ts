import { Injectable } from '@nestjs/common';
import { CreateCrawlerDto } from './dto/create-crawler.dto';
import { UpdateCrawlerDto } from './dto/update-crawler.dto';
import axios from 'axios';
import * as cheerio from 'cheerio';
import * as puppeteer from 'puppeteer';

@Injectable()
export class CrawlerService {
  async crawlWebsite(url: string): Promise<any> {
    const browser = await puppeteer.launch({
      headless: false, // Chạy không cần GUI
      executablePath: '/usr/bin/chromium-browser',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-extensions',
        '--disable-gpu',
      ],
    });

    
  
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
    console.log(page, 'page');
    console.log(url, 'url');

  
    // try {
    //   // Mở URL với timeout
     
  
    //   // Cuộn trang trong vòng 5 giây
    //   const startTime = Date.now();
    //   while (Date.now() - startTime < 5000) {
    //     try {
    //       await page.evaluate(() => {
    //         window.scrollBy(0, window.innerHeight);
    //       });
    //       await new Promise((resolve) => setTimeout(resolve, 500));
    //     } catch (scrollError) {
    //       console.error('Error during scrolling:', scrollError);
    //       break;
    //     }
    //   }
  
    //   console.log('Crawl completed successfully');
    // } catch (error) {
    //   console.error('Error during crawling:', error);
    //   throw new Error('Failed to crawl data');
    // } finally {
    //   await browser.close(); // Đảm bảo đóng trình duyệt
    // }
  }
  
  create(createCrawlerDto: CreateCrawlerDto) {
    return 'This action adds a new crawler';
  }

  findAll() {
    return `This action returns all crawler`;
  }

  findOne(id: number) {
    return `This action returns a #${id} crawler`;
  }

  update(id: number, updateCrawlerDto: UpdateCrawlerDto) {
    return `This action updates a #${id} crawler`;
  }

  remove(id: number) {
    return `This action removes a #${id} crawler`;
  }
}
