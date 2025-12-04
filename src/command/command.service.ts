import { Injectable } from '@nestjs/common';
import {
  Button,
  Key,
  keyboard,
  mouse,
  Point,
  screen,
  straightTo
} from "@nut-tree-fork/nut-js";
import * as fs from "fs";
import * as path from "path"; // ✅ import đúng
import * as sharp from "sharp";
import { createWorker } from 'tesseract.js';
import axios from 'axios';
// Lấy root dự án (2 cấp trên dist)
const rootDir = path.resolve(process.cwd());
const uploadDir = path.join(rootDir, "uploads");
import { HttpsProxyAgent } from 'https-proxy-agent';
import { HttpProxyAgent } from 'http-proxy-agent';
import { SocksProxyAgent } from 'socks-proxy-agent'
import { SocketGateway } from 'src/socket/socket.gateway';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Đã tạo thư mục uploads tại:", uploadDir);
} else {
  console.log("📂 Thư mục uploads tồn tại:", uploadDir);
}



@Injectable()
export class CommandService {
  constructor(
    private readonly socketGateway: SocketGateway
  ) { }
  private isRunning = false;
  private parseProxyString(proxyStr: string) {
    // Hỗ trợ password có dấu ':' bằng cách tách giới hạn
    // proxyStr dạng: host:port:username:password (password có thể chứa :)
    const parts = proxyStr.split(':');
    if (parts.length < 4) throw new Error('Proxy string phải có dạng host:port:username:password');
    const host = parts[0];
    const port = parts[1];
    const username = parts[2];
    const password = parts.slice(3).join(':'); // gộp lại phần còn lại cho password
    return { host, port, username, password };
  }

  private buildProxyUrl(proxyStr: string, protocol: 'http' | 'socks' = 'http'): string {
    const { host, port, username, password } = this.parseProxyString(proxyStr);
    if (protocol === 'socks') {
      // socks5://username:password@host:port
      return `socks5://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
    }
    return `http://${encodeURIComponent(username)}:${encodeURIComponent(password)}@${host}:${port}`;
  }

  private createAgents(proxyUrl: string) {
    // Tạo agent cho HTTP và HTTPS
    const httpsAgent = new HttpsProxyAgent(proxyUrl);
    const httpAgent = new HttpProxyAgent(proxyUrl);
    return { httpAgent, httpsAgent };
  }

  private async getPublicIpUsingAgent(httpAgent: any, httpsAgent: any) {
    try {
      const res = await axios.get('le.', {
        httpsAgent,
        httpAgent,
        proxy: false, // BẮT BUỘC khi dùng agent với axios
        timeout: 10000,
      });
      return res.data?.ip || null;
    } catch (err: any) {
      console.error('❌ Không thể kiểm tra IP qua proxy:', err.message);
      return null;
    }
  }

  async run(body: any) {
    const { keywords, domain, quantity } = body;
    this.isRunning = true;
    // Lặp qua từng keyword
    for (const keyword of keywords) {
      if (!this.isRunning) break;
      console.log(`🔥 Bắt đầu chạy keyword: "${keyword}"`);
      await this.socketGateway.sendToAll("start", keyword)
      // Chạy tuần tự quantity lần cho mỗi keyword
      for (let i = 0; i < quantity; i++) {

        if (!this.isRunning) {
          console.log('🛑 Dừng giữa vòng lặp nhỏ!');
          await this.socketGateway.sendToAll("stop", '🛑 Dừng giữa vòng lặp nhỏ!')
          break;
        }
        console.log(`🚀 [${keyword}] Vòng lặp ${i + 1}/${quantity}`);
        await this.socketGateway.sendToAll("start", `🚀 [${keyword}] Vòng lặp ${i + 1}/${quantity}`)
        await this.executeOneRound(keyword, domain);
      }
      await this.socketGateway.sendToAll("stop", `✅ Hoàn tất keyword: "${keyword}"`)
      console.log(`✅ Hoàn tất keyword: "${keyword}"`);

    }
    this.isRunning = false;
    console.log('🎯 Hoàn tất tất cả keyword!');
    await this.socketGateway.sendToAll("stop", `🎯 Hoàn tất tất cả keyword!`)
  }

  async stop() {
    this.isRunning = false;
    console.log('🛑 Đã yêu cầu dừng tiến trình!');
    await this.socketGateway.sendToAll("stop", `🛑 Đã yêu cầu dừng tiến trình!`)
  }

  async executeOneRound(keyword: string, domain: string) {
    // 👉 1. Mở trình duyệt (ví dụ click vào ô tìm kiếm & gõ google)
    await mouse.move(straightTo(new Point(750, 1600)));
    await mouse.click(Button.LEFT);
   
    await keyboard.type("google chrome");
    await keyboard.type(Key.Enter);
    await new Promise(r => setTimeout(r, 2000));
    // 👉 2. Click tài khoản Google
    await mouse.move(straightTo(new Point(700, 500)));
    await mouse.click(Button.LEFT);
    // 👉 3. Mở DevTools
    await keyboard.pressKey(Key.F12);
    await keyboard.releaseKey(Key.F12);

    // 👉 4. Gõ google.com
    await mouse.move(straightTo(new Point(200, 70)));
    await mouse.click(Button.LEFT);
    await keyboard.type("google.com");
    await keyboard.type(Key.Enter);


    //click sign in 
    // await mouse.move(straightTo(new Point(1060, 350)));
    // await mouse.click(Button.LEFT);
    await new Promise(r => setTimeout(r, 3000));
    // 👉 5. Gõ từ khóa
    await mouse.move(straightTo(new Point(700, 350)));

    await mouse.click(Button.LEFT);
    await keyboard.type(keyword);
    await keyboard.type(Key.Enter);
    await new Promise(r => setTimeout(r, 10000));

    // 👉 6. Scroll tìm domain
    await this.findAndScroll(domain);

    // 👉 8. Chờ một chút để chuẩn bị vòng sau
    await new Promise(r => setTimeout(r, 2000));
  }


  async findAndScroll(target: string) {
    let found = false;
    // 🧠 Khởi tạo worker 1 lần
    const worker = await createWorker({
      // logger: m => console.log(m), // 👈 optional: để debug tiến trình
    });

    await worker.load();                        // 1. Load engine
    await worker.loadLanguage('vie+eng');       // 2. Load ngôn ngữ
    await worker.initialize('vie+eng');         // 3. Khởi tạo OCR

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // đảm bảo cửa sổ được focus
    await mouse.move(straightTo(new Point(600, 400)));

    const scrollStep = 600; // pixels mỗi lần cuộn
    const postScrollWait = 1200; // ms đợi render sau mỗi lần cuộn

    for (let i = 0; i < 10 && !found; i++) {
      console.log(`🔍 Lần ${i + 1}: đang quét màn hình...`);
      await this.socketGateway.sendToAll("start", `🔍 Lần ${i + 1}: đang quét màn hình...`)
      try {
        // 📸 Chụp ảnh màn hình
        const image: any = await screen.grab();

        // 🧩 Xử lý ảnh trước OCR
        const pngBuffer = await sharp(image.data, {
          raw: { width: image.width, height: image.height, channels: image.channels },
        })
          .resize(image.width * 2, image.height * 2)
          .grayscale()
          .sharpen()
          .modulate({ brightness: 1.1 })
          .png()
          .toBuffer();

        // 🔠 OCR
        const { data } = await worker.recognize(
          pngBuffer,
          { left: 0, top: 0, width: image.width * 2, height: image.height * 2 } as any
        );
        const text = data?.text?.toLowerCase() || "";
        if (text.includes("not a robot")) {
          await this.socketGateway.sendToAll("robot", 1)
          await this.socketGateway.sendToAll("start", `not a robot`)
          // ✅ Gán cờ để dừng vòng lặp
          found = true;
          await keyboard.pressKey(Key.LeftControl, Key.W);
          await keyboard.releaseKey(Key.LeftControl, Key.W);
        }
        if (text.includes(target.toLowerCase())) {
          console.log("✅ Đã thấy chữ:", target);
          await this.socketGateway.sendToAll("start", "✅ Đã thấy chữ: " + target);
          await this.socketGateway.sendToAll("success", 1)
          if (data.words && data.words.length) {
            for (const word of data.words) {
              if (word.text.toLowerCase().includes(target)) {
                // console.log('📍 Tìm thấy từ:', word.text, word.bbox);
                const { x0, y0, x1, y1 } = word.bbox;
                const scaleX = image.width / (image.width * 2);  // = 0.5
                const scaleY = image.height / (image.height * 2); // = 0.5

                const realX0 = x0 * scaleX;
                const realY0 = y0 * scaleY;
                const realX1 = x1 * scaleX;
                const realY1 = y1 * scaleY;
                const clickX = realX0 + (realX1 - realX0) / 2;
                const clickY = realY0 + (realY1 - realY0) / 2;

                await mouse.move(straightTo(new Point(clickX, clickY)));
                await mouse.click(Button.LEFT);
                await new Promise(r => setTimeout(r, 1000)); // đợi load nội dung
                for (let i = 0; i < 10; i++) {
                  await mouse.scrollDown(400);
                  await new Promise(r => setTimeout(r, 400));
                }
                await new Promise(r => setTimeout(r, 1000)); // đợi load nội dung
                // ✅ Gán cờ để dừng vòng lặp
                found = true;
                await keyboard.pressKey(Key.LeftControl, Key.W);
                await keyboard.releaseKey(Key.LeftControl, Key.W);
                break;
              }
            }
          } else {
            console.log('⚠️ Không có words, kiểm tra lại ảnh hoặc tesseract version');
          }
        } else {
          console.log(`⤵️ Chưa thấy "${target}" — cuộn xuống ${scrollStep}px`);
          await this.socketGateway.sendToAll("start", `⤵️ Chưa thấy "${target}" — cuộn xuống ${scrollStep}px`);
          try {
            await mouse.scrollDown(scrollStep);
          } catch (e) {
            console.warn("⚠️ mouse.scrollDown lỗi, thử dùng PageDown");
            await keyboard.pressKey(Key.PageDown);
            await sleep(100);
            await keyboard.releaseKey(Key.PageDown);
          }
          await sleep(postScrollWait);
        }
      } catch (err) {
        console.error("❌ Lỗi trong lần quét:", err?.message || err);
        await mouse.scrollDown(scrollStep).catch(() => { });
        await sleep(postScrollWait);
      }
    }

    if (!found) {
      await this.socketGateway.sendToAll("error", 1);
      await this.socketGateway.sendToAll("start", "❌ Không tìm thấy: " + target);
      console.log("❌ Không tìm thấy:", target);
      console.log("⚠️ Đang tắt trình duyệt...");
      await keyboard.pressKey(Key.LeftControl, Key.W);
      await keyboard.releaseKey(Key.LeftControl, Key.W);
    }

    await worker.terminate();
  }



}

