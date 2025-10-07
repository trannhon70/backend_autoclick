import { Injectable, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { execFile } from 'child_process';
import { promisify } from 'util';
import {
  mouse,
  keyboard,
  Button,
  Key,
  screen,
  straightTo,
  centerOf,
  Point,
  imageResource
} from "@nut-tree-fork/nut-js";
import * as path from "path"; // ✅ import đúng
const execFileAsync = promisify(execFile);
import { recognize } from "tesseract.js";
import * as sharp from "sharp";
import { createWorker } from 'tesseract.js';


@Injectable()
export class CommandService {
  async run(body: any) {
    // Di chuyển chuột tới ô tìm kiếm và gõ "google"
    await mouse.move(straightTo(new Point(200, 1600)));
    await mouse.click(Button.LEFT);
    await keyboard.type("google");
    await keyboard.type(Key.Enter);

    // Click vào tài khoản google
    await mouse.move(straightTo(new Point(1000, 500)));
    await mouse.click(Button.LEFT);

    // === MỞ F12 (DevTools) ===
    await keyboard.pressKey(Key.F12);
    await keyboard.releaseKey(Key.F12);

    await mouse.move(straightTo(new Point(200, 70)));
    await mouse.click(Button.LEFT);
    await keyboard.type("google.com");
    await keyboard.type(Key.Enter);

    await mouse.move(straightTo(new Point(700, 400)));
    await mouse.click(Button.LEFT);
    await keyboard.type("kham nam khoa o tphcm");
    await keyboard.type(Key.Enter);
    await new Promise(r => setTimeout(r, 5000)); // đợi load nội dung

    // Scroll xuống chậm (20 lần, mỗi lần 100px)
    for (let i = 0; i < 40; i++) {
      await mouse.scrollDown(100);
      await new Promise(r => setTimeout(r, 200));
    }

    // Scroll lên chậm (20 lần, mỗi lần 100px)
    for (let i = 0; i < 40; i++) {
      await mouse.scrollUp(100);
      await new Promise(r => setTimeout(r, 200));
    }

    this.findAndScroll("nhathuoclongchau")

    // await new Promise(r => setTimeout(r, 15000));
    //tắt trình duyệt
    // await keyboard.pressKey(Key.LeftControl, Key.W);
    // await keyboard.releaseKey(Key.LeftControl, Key.W);
  }



  async findAndScroll(target: string) {
    let found = false;

    // 🧠 Khởi tạo worker 1 lần duy nhất (nhanh hơn nhiều)
    const worker = await createWorker('vie+eng');
    await worker.setParameters({
      tessedit_pageseg_mode: "6",
      preserve_interword_spaces: "1",
    } as any);

    for (let i = 0; i < 10 && !found; i++) {
      console.log(`🔍 Lần ${i + 1}: đang quét màn hình...`);

      // 📸 Chụp ảnh màn hình
      const image: any = await screen.grab();

      // 🧠 Xử lý ảnh trước OCR
      const pngBuffer = await sharp(image.data, {
        raw: {
          width: image.width,
          height: image.height,
          channels: image.channels,
        },
      })
        .resize(image.width * 2, image.height * 2)
        .grayscale()
        .sharpen()
        .modulate({ brightness: 1.1 })
        .png()
        .toBuffer();

      // 🔠 Nhận dạng văn bản
      const result: any = await worker.recognize(
        pngBuffer,
        { left: 0, top: 0, width: image.width * 2, height: image.height * 2 } as any
      );

      const data = result.data;
      const text = data?.text?.toLowerCase() || "";
      const words = data?.words || [];
      const lines = data?.lines || [];

      console.log("📖 OCR text:", text.slice(0, 100).replace(/\n/g, " "));
      console.log("📦 words:", words.length, "| lines:", lines.length);

      if (text.includes(target.toLowerCase())) {
        console.log("✅ Đã thấy chữ:", target);

        let bbox: any = null;

        // Ưu tiên tìm trong words
        const word = words.find((w: any) =>
          w.text.toLowerCase().includes(target.toLowerCase())
        );
        if (word?.bbox) bbox = word.bbox;

        // fallback: tìm trong lines
        if (!bbox && lines.length > 0) {
          const line = lines.find((l: any) =>
            l.text.toLowerCase().includes(target.toLowerCase())
          );
          if (line?.bbox) bbox = line.bbox;
        }

        // 🎯 Nếu có tọa độ → click
        if (bbox) {
          const x = bbox.x0 + (bbox.x1 - bbox.x0) / 2;
          const y = bbox.y0 + (bbox.y1 - bbox.y0) / 2;
          console.log("📍 BBox:", bbox);

          await mouse.move(straightTo(new Point(x, y)));
          await mouse.click(Button.LEFT);
          console.log(`🖱️ Đã click vào "${target}" tại (${x}, ${y})`);
          found = true;
          break;
        } else {
          console.log("⚠️ Có text nhưng không tìm thấy bounding box cụ thể.");
          const centerX = image.width / 2;
          const centerY = image.height / 2;
          await mouse.move(straightTo(new Point(centerX, centerY)));
          await mouse.click(Button.LEFT);
          console.log("🖱️ Fallback click giữa màn hình.");
        }
      } else {
        console.log("⏬ Chưa thấy, scroll tiếp...");
        await mouse.scrollDown(400);
        await new Promise((r) => setTimeout(r, 1000));
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

