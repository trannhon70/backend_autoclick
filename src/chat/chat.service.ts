import { Injectable } from '@nestjs/common';
import puppeteer from 'puppeteer-extra';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

// Chỉ bật một số evasions cần thiết
puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin({ stripHeadless: true, makeWindows: true }));

// Fake cấu hình iPhone 12
const iPhone12 = {
    name: 'iPhone 12',
    userAgent:
        'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1',
    viewport: {
        width: 390,
        height: 844,
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
        isLandscape: false,
    },
};

@Injectable()
export class ChatService {
    private urls = Array(20).fill('https://andongclinic.vn/tu-van-nam-khoa-online-mien-phi-voi-bac-si-chuyen-khoa-gioi-79.html?10300007&gad_source=1&gad_campaignid=21655283444&gbraid=0AAAAA-KzdWiw56y31NZg9Ng1K56g5OT1K&gclid=EAIaIQobChMI7e7-kbj-jgMVaOgWBR1UMxcfEAAYASADEgIi_PD_BwE'); // Danh sách URL cần mở

    async autoChat() {
        const batchSize = 3; // Số page chạy song song
        for (let i = 0; i < this.urls.length; i += batchSize) {
            const batch = this.urls.slice(i, i + batchSize);
            console.log(`🚀 Chạy batch ${i / batchSize + 1}:`, batch.length, 'page');

            await Promise.all(batch.map((url) => this.runSinglePage(url)));

            // Delay giữa các batch
            await new Promise((res) => setTimeout(res, 3000));
        }
    }

    private async runSinglePage(url: string) {
        const browser = await puppeteer.launch({
            headless: false,
            args: [
                `--user-data-dir=D:\\puppeteer_profile`, // Chuyển toàn bộ cache sang ổ D
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',
                '--no-sandbox',
                '--disable-setuid-sandbox',
            ],
        });

        try {
            const context = browser.defaultBrowserContext();
            await context.overridePermissions(url, []);

            const page = await browser.newPage();

            // Emulate iPhone 12
            await page.emulate(iPhone12);

            // Random timezone
            const timezones = [
                'America/New_York',
                'Europe/London',
                'Asia/Tokyo',
                'Asia/Ho_Chi_Minh',
            ];
            await page.emulateTimezone(
                timezones[Math.floor(Math.random() * timezones.length)],
            );

            // Random language
            const languages = [
                ['en-US', 'en'],
                ['vi-VN', 'vi'],
                ['ja-JP', 'ja'],
            ];
            await page.evaluateOnNewDocument((langs) => {
                Object.defineProperty(navigator, 'languages', { get: () => langs });
            }, languages[Math.floor(Math.random() * languages.length)]);

            // Fake deviceId khác nhau cho từng page
            await page.evaluateOnNewDocument(() => {
                const randomId = () =>
                    Math.random().toString(36).substring(2) +
                    Date.now().toString(36) +
                    Math.floor(Math.random() * 10000);

                Object.defineProperty(navigator, 'mediaDevices', {
                    value: {
                        enumerateDevices: async () => [
                            { kind: 'videoinput', label: 'HD Camera', deviceId: randomId(), groupId: randomId() },
                            { kind: 'audioinput', label: 'Microphone', deviceId: randomId(), groupId: randomId() },
                            { kind: 'audiooutput', label: 'Speaker', deviceId: randomId(), groupId: randomId() },
                        ],
                    },
                    configurable: true,
                });
            });

            // Patch quyền truy cập
            await page.evaluateOnNewDocument(() => {
                const originalQuery = (window.navigator.permissions
                    .query as any).bind(window.navigator.permissions);
                window.navigator.permissions.query = (parameters: PermissionDescriptor) => {
                    if (
                        ['geolocation', 'camera', 'microphone', 'notifications'].includes(
                            parameters.name,
                        )
                    ) {
                        return Promise.resolve({ state: 'granted' } as any);
                    }
                    return originalQuery(parameters);
                };
            });

            // Mở URL
            await page.goto(url, {
                timeout: 120000,
                waitUntil: 'domcontentloaded',
            });

            console.log(`✅ Page loaded: ${url}`);

            // Giữ page 5s rồi reload
            // await new Promise(res => setTimeout(res, 50000));
            await new Promise(res => setTimeout(res, 5 * 60 * 1000));
            await page.reload({ waitUntil: 'domcontentloaded' });
            console.log(`🔄 Page reloaded: ${url}`);

            await new Promise(res => setTimeout(res, 2000));
        } catch (err) {
            console.error('❌ Lỗi page:', err.message);
        } finally {
            await browser.close();
        }
    }
}
