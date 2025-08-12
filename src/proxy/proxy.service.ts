import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import puppeteer from 'puppeteer-extra';
import { extractUserFromRequest } from 'src/common/helpers/jwt-helper';
import { RedisService } from 'src/redis/redis.service';
import { User } from 'src/user/entities/user.entity';
import { currentTimestamp } from 'src/utils';
import { Repository } from 'typeorm';
import { Proxy } from './entities/proxy.entity';
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const AnonymizeUAPlugin = require('puppeteer-extra-plugin-anonymize-ua');

puppeteer.use(StealthPlugin());
puppeteer.use(AnonymizeUAPlugin({ stripHeadless: true, makeWindows: true }));

const testInput = 'Chào bác sĩ';

// Fake iPhone 12
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
export class ProxyService {
    private readonly logger = new Logger(ProxyService.name);
    // // URL và Proxy tương ứng
    // private urls = Array(20).fill('https://namkhoa.phongkhamdakhoathangtam.vn/phong-kham-nam-khoa-thang-tam-dia-chi-kham-chua-benh-nam-khoa-uy-tin-tai-tphcm-2813.html');
    // private proxies = [
    //     { host: '23.95.150.145', port: 6114, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '198.23.239.134', port: 6540, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '45.38.107.97', port: 6014, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '207.244.217.165', port: 6712, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '107.172.163.27', port: 6543, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '104.222.161.211', port: 6343, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '64.137.96.74', port: 6641, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '216.10.27.159', port: 6837, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '136.0.207.84', port: 6661, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    //     { host: '142.147.128.93', port: 6593, user: 'fpkkmquz', pass: 'hh4q5mpyf5g5' },
    // ];
    private isStopped = false;


    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Proxy)
        private readonly proxyRepository: Repository<Proxy>,

        private readonly jwtService: JwtService, // Inject JwtService
        private readonly redisService: RedisService,
    ) { }
    async stop() {
        this.isStopped = true;
    }
    async play(req: any, body: any) {
        this.isStopped = false;
        const { urls, time, page, chats } = body;
        const proxies = await this.proxyRepository.find();
        
        const batchSize = page;
        for (let i = 0; i < urls.length; i += batchSize) {
            if (this.isStopped) {
                console.log("⏹ Tiến trình bị dừng!");
                break;
            }

            const batch = urls.slice(i, i + batchSize);
            console.log(`🚀 Chạy batch ${i / batchSize + 1}:`, batch.length, 'page');

            await Promise.all(batch.map(async (url: any, idx: any) => {
                if (this.isStopped) return; // bỏ qua nếu đã dừng
                const proxy: any = proxies[(i + idx) % proxies.length];
                return this.runSinglePage(url, proxy, time, chats);
            }));


            // thời gian chạy lại
            await new Promise((res) => setTimeout(res, 3000));

        }
    }

    private async runSinglePage(url: string, proxy: { host: string, port: number, user_proxy?: string, pass_proxy?: string }, time: number, chats: any[]) {
        if (this.isStopped) return;
        const proxyArg = `--proxy-server=http://${proxy.host}:${proxy.port}`;

        const browser = await puppeteer.launch({
            headless: false,
            args: [
                proxyArg,
                '--no-sandbox',
                '--disable-setuid-sandbox',
                `--user-data-dir=D:\\puppeteer_profile_${Date.now()}`,
                '--use-fake-ui-for-media-stream',
                '--use-fake-device-for-media-stream',

                // Chặn WebRTC leak
                '--force-webrtc-ip-handling-policy=disable_non_proxied_udp',
                '--webrtc-ip-handling-policy=default_public_interface_only',
                '--webrtc-multiple-routes-disabled=true',
                '--disable-webrtc',
            ],
        });

        try {
            const page = await browser.newPage();
            const context = browser.defaultBrowserContext();
            await context.overridePermissions(url, []);

            // Auth proxy nếu cần
            if (proxy.user_proxy && proxy.pass_proxy) {
                await page.authenticate({
                    username: proxy.user_proxy,
                    password: proxy.pass_proxy,
                });
            }

            // Fake iPhone
            await page.emulate(iPhone12);

            // Patch WebRTC để chặn IP leak
            await page.evaluateOnNewDocument(() => {
                const origPeer = window.RTCPeerConnection || (window as any).webkitRTCPeerConnection;
                if (origPeer) {
                    window.RTCPeerConnection = function (...args) {
                        const pc = new origPeer(...args);
                        pc.createDataChannel('');
                        pc.createOffer = async function (...args) {
                            const offer = await origPeer.prototype.createOffer.apply(pc, args);
                            offer.sdp = offer.sdp.replace(/(candidate:.*\s)/g, '');
                            return offer;
                        };
                        return pc;
                    } as any;
                }
            });

            // Mở URL
            try {
                await page.goto(url, {
                    timeout: 120000,
                    waitUntil: 'domcontentloaded',
                });

                // Đợi 30 giây trước khi thao tác tiếp
                await new Promise(r => setTimeout(r, 40000));

                // Đợi iframe xuất hiện trên trang
                const iframeElementHandle = await page.waitForSelector('#LR_miniframe');

                // Lấy frame con từ iframe này
                const frame = await iframeElementHandle.contentFrame();

                if (!frame) {
                    throw new Error('Không thể lấy frame từ iframe');
                }

                // Sau đó thao tác với frame này thay vì page
                await frame.waitForSelector('#texteditor');
                await frame.waitForSelector('#sentButton');

                // Điền text vào textarea trong iframe
                for (const chat of chats) {
                    await frame.evaluate((text) => {
                        const textarea = document.querySelector('#texteditor') as HTMLTextAreaElement;
                        if (textarea) {
                            textarea.value = text;
                            textarea.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                    }, chat);

                    // Click nút gửi
                    await frame.click('#sentButton');

                    console.log(`Đã gửi: ${chat}`);

                    // Đợi 20 giây trước khi gửi tin tiếp theo
                    await new Promise(resolve => setTimeout(resolve, 20000));
                }

            } catch (err) {
                console.error(`❌ Lỗi khi vào URL:`, err.message);
            }

            // Test IP thật sự đang dùng
            const ip = await page.evaluate(() =>
                fetch('https://api.ipify.org?format=json').then(res => res.json())
            );
            console.log(`🌐 IP detect (Proxy ${proxy.host}): ${ip.ip}`);

            // Chờ tương tác
            console.log(`✅ Page loaded (Proxy ${proxy.host}): ${url}`);
            await new Promise(res => setTimeout(res, time)); // chờ 2 phút

        } catch (err) {
            console.error(`❌ Lỗi page với proxy ${proxy.host}:`, err.message);
        } finally {
            await browser.close();
        }
    }

    async create(req: any, body: any) {
        try {
            const { userId } = await extractUserFromRequest(req, this.jwtService);
            const dataRef = {
                host: body.host?.trim(),
                port: body.port?.trim(),
                user_proxy: body.user_proxy?.trim(),
                pass_proxy: body.pass_proxy?.trim(),
                userId: userId,
                created_at: currentTimestamp(),
            }
            const data = await this.proxyRepository.create(dataRef);
            return await this.proxyRepository.save(data)
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async update(req: any, body: any, param: any) {
        try {
            if (param.id) {
                return await this.proxyRepository.update({ id: param.id }, body)
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getById(req: any, param: any) {
        try {
            if (param.id) {
                return await this.proxyRepository.findOneById(param)
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async delete(req: any, param: any) {
        try {
            if (param.id) {
                return await this.proxyRepository.delete(param)
            }
        } catch (error) {
            console.log(error);
            throw error
        }
    }

    async getPaging(req: any, query: any) {
        try {
            const pageIndex = query.pageIndex ? parseInt(query.pageIndex, 10) : 1;
            const pageSize = query.pageSize ? parseInt(query.pageSize, 10) : 10;
            const search = query.search ? query.search.trim() : '';
            const skip = (pageIndex - 1) * pageSize;
            let whereCondition = '';
            const parameters: any = {};

            if (search) {
                // if (whereCondition) whereCondition += ' AND ';
                whereCondition += 'proxy.host LIKE :search';
                parameters.search = `%${search}%`;
            }

            const qb = this.proxyRepository.createQueryBuilder('proxy')
                .leftJoinAndSelect('proxy.user', 'user')
                .skip(skip)
                .take(pageSize)
                .orderBy('proxy.id', 'DESC');

            if (whereCondition) {
                qb.where(whereCondition, parameters);
            }
            const [result, total] = await qb.getManyAndCount();

            return {
                data: result,
                total: total,
                pageIndex: pageIndex,
                pageSize: pageSize,
                totalPages: Math.ceil(total / pageSize),
            };
        } catch (error) {
            console.log(error);
            throw error
        }
    }
}
