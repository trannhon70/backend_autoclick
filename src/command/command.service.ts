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


async function detectBoxFromImage(filePath: string) {
  const image = sharp(filePath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  let minX = info.width, minY = info.height, maxX = 0, maxY = 0;

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const [r, g, b] = [data[idx], data[idx + 1], data[idx + 2]];
      // nếu pixel màu đỏ mạnh (đường viền)
      if (r > 200 && g < 100 && b < 100) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
}
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


  }



  async findAndScroll(target: string) {
    let found = false;

    // Khởi tạo worker 1 lần
    const worker = await createWorker('vie+eng');
    await worker.setParameters({
      tessedit_pageseg_mode: "3",
      preserve_interword_spaces: "1",
    } as any);

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // optional: click vào giữa màn hình để đảm bảo cửa sổ được focus (nếu cần)
    await mouse.move(straightTo(new Point(600, 400)));

    const scrollStep = 600; // pixels mỗi lần cuộn (tùy chỉnh)
    const postScrollWait = 1200; // ms đợi render sau mỗi lần cuộn

    for (let i = 0; i < 10 && !found; i++) {
      console.log(`🔍 Lần ${i + 1}: đang quét màn hình...`);

      try {
        // Chụp ảnh màn hình
        const image: any = await screen.grab();

        // Xử lý ảnh trước OCR
        const pngBuffer = await sharp(image.data, {
          raw: { width: image.width, height: image.height, channels: image.channels },
        })
          .resize(image.width * 2, image.height * 2)
          .grayscale()
          .sharpen()
          .modulate({ brightness: 1.1 })
          .png()
          .toBuffer();

        // OCR
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

          // tìm bbox
          let bbox: any = null;
          const word = words.find((w: any) => w.text.toLowerCase().includes(target.toLowerCase()));
          if (word?.bbox) bbox = word.bbox;

          if (!bbox && lines.length > 0) {
            const line = lines.find((l: any) => l.text.toLowerCase().includes(target.toLowerCase()));
            if (line?.bbox) bbox = line.bbox;
          }

          // chụp lại ảnh full để annotate
          const screenshotBuffer = await sharp(image.data, {
            raw: { width: image.width, height: image.height, channels: image.channels },
          }).png().toBuffer();

          let noteText = bbox ? `Found: ${target}` : `Found text but no bbox`;
          console.log(bbox, 'bbox');

          const svgOverlay = bbox
            ? `<svg width="${image.width}" height="${image.height}">
               <rect x="${bbox.x0}" y="${bbox.y0}" width="${bbox.x1 - bbox.x0}" height="${bbox.y1 - bbox.y0}"
                 stroke="red" stroke-width="5" fill="none"/>
               <text x="${bbox.x0}" y="${bbox.y0 - 10}" fill="red" font-size="32" font-weight="bold">${noteText}</text>
             </svg>`
            : `<svg width="${image.width}" height="${image.height}">
               <circle cx="${image.width / 2}" cy="${image.height / 2}" r="50"
                 stroke="yellow" stroke-width="5" fill="none"/>
               <text x="${image.width / 2 - 100}" y="${image.height / 2 - 60}" fill="yellow"
                 font-size="32" font-weight="bold">${noteText}</text>
             </svg>`;

          const annotatedBuffer = await sharp(screenshotBuffer)
            .composite([{ input: Buffer.from(svgOverlay), top: 0, left: 0 }])
            .toBuffer();

          const filename = `found_${target.replace(/\s+/g, "_")}_${Date.now()}.png`;
          const filepath = path.resolve(uploadDir, filename);

          try {
            await sharp(annotatedBuffer).toFile(filepath);

            const bbox = await detectBoxFromImage(filepath);

            // bbox từ ảnh đã resize OCR (ví dụ: resize 2x)
            const scaleX = image.width / (image.width * 2); // = 0.5 nếu resize 2x
            const scaleY = image.height / (image.height * 2); // = 0.5

            const realX = bbox.x * scaleX;
            const realY = bbox.y * scaleY;
            const realWidth = bbox.width * scaleX;
            const realHeight = bbox.height * scaleY;

            const centerX = realX + realWidth / 2;
            const centerY = realY + realHeight / 2;

            console.log(`📍 Tọa độ trung tâm thật trên màn hình: (${centerX}, ${centerY})`);

            await mouse.move(straightTo(new Point(centerX, centerY)));
            await mouse.click(Button.LEFT);

            // đợi 10s trước khi đóng tab
            await new Promise(r => setTimeout(r, 10000));
            await keyboard.pressKey(Key.LeftControl, Key.W);
            await keyboard.releaseKey(Key.LeftControl, Key.W);

            console.log("✅ Hoàn tất click và đóng tab");
          } catch (err: any) {
            console.error("❌ Lỗi:", err?.message || err);
          }

          found = true;
          break;
        }
        else {
          // Nếu chưa tìm thấy → cuộn xuống 1 bước và đợi render rồi lặp lại
          console.log(`⤵️  Chưa thấy "${target}" — sẽ cuộn xuống ${scrollStep}px và quét lại.`);
          try {
            await mouse.scrollDown(scrollStep);
          } catch (e) {
            console.warn("⚠️ mouse.scrollDown lỗi (thử phím PageDown):", e?.message || e);
            try {
              // fallback: dùng PageDown
              await keyboard.pressKey(Key.PageDown);
              await sleep(100);
              await keyboard.releaseKey(Key.PageDown);
            } catch (ee) {
              console.warn("⚠️ fallback PageDown cũng thất bại:", ee?.message || ee);
            }
          }
          await sleep(postScrollWait); // đợi trang render
        }
      } catch (err) {
        console.error("❌ Lỗi trong lần quét:", err?.message || err);
        // dù lỗi vẫn cố gắng cuộn để thử vùng khác
        try {
          await mouse.scrollDown(scrollStep);
        } catch (e) { /* ignore */ }
        await sleep(postScrollWait);
      }
    } // end for

    if (!found) {
      console.log("❌ Không tìm thấy:", target);
      console.log("⚠️ Đang tắt trình duyệt...");
      await keyboard.pressKey(Key.LeftControl, Key.W);
      await keyboard.releaseKey(Key.LeftControl, Key.W);
    }

    await worker.terminate();
  }


}

