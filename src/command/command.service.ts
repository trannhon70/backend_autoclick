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

// Lấy root dự án (2 cấp trên dist)
const rootDir = path.resolve(process.cwd());
const uploadDir = path.join(rootDir, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📂 Đã tạo thư mục uploads tại:", uploadDir);
} else {
  console.log("📂 Thư mục uploads tồn tại:", uploadDir);
}



@Injectable()
export class CommandService {
  async run(body: any) {
    const { keyword, domain, quantity } = body;

    for (let i = 0; i < quantity; i++) {
      console.log(`🚀 Bắt đầu vòng lặp ${i + 1}/${quantity}`);
      await this.executeOneRound(keyword, domain);
    }

    console.log("🎯 Hoàn tất tất cả các vòng lặp!");
    return
  }

  async executeOneRound(keyword: string, domain: string) {
    // 👉 1. Mở trình duyệt (ví dụ click vào ô tìm kiếm & gõ google)
    await mouse.move(straightTo(new Point(200, 1600)));
    await mouse.click(Button.LEFT);
    await keyboard.type("google");
    await keyboard.type(Key.Enter);

    // 👉 2. Click tài khoản Google
    await mouse.move(straightTo(new Point(650, 750)));
    await mouse.click(Button.LEFT);

    // 👉 3. Mở DevTools
    await keyboard.pressKey(Key.F12);
    await keyboard.releaseKey(Key.F12);

    // 👉 4. Gõ google.com
    await mouse.move(straightTo(new Point(200, 70)));
    await mouse.click(Button.LEFT);
    await keyboard.type("google.com");
    await keyboard.type(Key.Enter);
    await new Promise(r => setTimeout(r, 3000));

    // 👉 5. Gõ từ khóa
    await mouse.move(straightTo(new Point(700, 400)));
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

        if (text.includes(target.toLowerCase())) {
          console.log("✅ Đã thấy chữ:", target);

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
      console.log("❌ Không tìm thấy:", target);
      console.log("⚠️ Đang tắt trình duyệt...");
      await keyboard.pressKey(Key.LeftControl, Key.W);
      await keyboard.releaseKey(Key.LeftControl, Key.W);
    }

    await worker.terminate();
  }



}

