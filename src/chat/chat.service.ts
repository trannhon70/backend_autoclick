import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
import { KnownDevices } from 'puppeteer'; // 👈 Lấy KnownDevices

const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin({ stripHeadless: true, makeWindows: true }));

@Injectable()
export class ChatService {
    async autoChat() {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });
        const context = browser.defaultBrowserContext();
        await context.overridePermissions("https://vnbacsionline.com", []);

        const page = await browser.newPage();

        // 📱 Lấy device iPhone 12 từ KnownDevices
        const iPhone12 = KnownDevices['iPhone 12'];
        await page.emulate(iPhone12);

        // Random timezone
        const timezones = ['America/New_York', 'Europe/London', 'Asia/Tokyo', 'Asia/Ho_Chi_Minh'];
        await page.emulateTimezone(timezones[Math.floor(Math.random() * timezones.length)]);

        // Random language
        const languages = [['en-US', 'en'], ['vi-VN', 'vi'], ['ja-JP', 'ja']];
        await page.evaluateOnNewDocument((langs) => {
            Object.defineProperty(navigator, 'languages', { get: () => langs });
        }, languages[Math.floor(Math.random() * languages.length)]);

        // Patch quyền
        await page.evaluateOnNewDocument(() => {
            const originalQuery = (window.navigator.permissions.query as any);
            window.navigator.permissions.query = (parameters: PermissionDescriptor) => {
                if (['geolocation', 'camera', 'microphone', 'notifications'].includes(parameters.name)) {
                    return Promise.resolve({ state: 'granted' } as any);
                }
                return originalQuery(parameters);
            };
        });

        await page.goto('https://vnbacsionline.com', {
            timeout: 0,
            waitUntil: 'networkidle2',
        });

        console.log('Page loaded');

        await new Promise(resolve => setTimeout(resolve, 5000));

        // Reload trang
        await page.reload({ waitUntil: 'networkidle2' });
        console.log('Page reloaded');
    }
}
