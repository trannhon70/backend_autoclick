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

    this.findAndScroll("dakhoatanbinh.vn")

    // await new Promise(r => setTimeout(r, 15000));
    //tắt trình duyệt
    // await keyboard.pressKey(Key.LeftControl, Key.W);
    // await keyboard.releaseKey(Key.LeftControl, Key.W);
  }

  async findAndScroll(target: string) {
    let found = false;

    for (let i = 0; i < 11 && !found; i++) {
      console.log(`🔍 Lần ${i + 1}: đang quét màn hình...`);

      // Chụp ảnh màn hình
      const image: any = await screen.grab();
      const pngBuffer = await sharp(image.data, {
        raw: {
          width: image.width,
          height: image.height,
          channels: image.channels,
        },
      }).png().toBuffer();

      // OCR
      const result: any = await recognize(pngBuffer, "eng");
      const text = result.data.text.toLowerCase();

      if (text.includes(target.toLowerCase())) {
        console.log("✅ Đã thấy chữ:", target);

        // Tìm bounding box gần nhất
        const word = result.data.words.find((w: any) =>
          w.text.toLowerCase().includes(target.toLowerCase())
        );

        if (word) {
          // Vị trí trung tâm từ
          const x = word.bbox.x0 + (word.bbox.x1 - word.bbox.x0) / 2;
          const y = word.bbox.y0 + (word.bbox.y1 - word.bbox.y0) / 2;

          // Di chuyển chuột tới vị trí đó và click
          await mouse.move(straightTo(new Point(x, y)));
          await mouse.click(Button.LEFT);

          console.log(`🖱️ Đã click vào "${target}" tại (${x}, ${y})`);
          found = true;
          break;
        }
      } else {
        console.log("⏬ Chưa thấy, scroll tiếp...");
        await mouse.scrollDown(400);
        await new Promise(r => setTimeout(r, 1000));
      }
    }

    if (!found) {
      console.log("❌ Không tìm thấy:", target);
    }
  }
}