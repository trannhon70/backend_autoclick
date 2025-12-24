import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Button,
  clipboard,
  Key,
  keyboard,
  mouse,
  Point,
  screen,
  straightTo,
} from '@nut-tree-fork/nut-js';
import * as sharp from 'sharp';
import { History, StatusEnum } from 'src/history/entities/history.entity';
import { SocketGateway } from 'src/socket/socket.gateway';
import { currentTimestamp } from 'src/utils';
import { createWorker } from 'tesseract.js';
import { Repository } from 'typeorm';

@Injectable()
export class CommandServiceV1 {
  constructor(
    private readonly socketGateway: SocketGateway,
    @InjectRepository(History)
    private readonly HistoryRepository: Repository<History>,
  ) {}

  async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async runV1(body: any) {
    const { keywords, domain } = body;

    const failMap: Record<string, number> = {};
    for (const keyword of keywords) {
      failMap[keyword] = 0;
    }

    console.log('🚀 Bắt đầu chạy vòng lặp vô hạn');

    while (true) {
      console.log('🔄 Bắt đầu 1 vòng keyword mới');

      for (const keyword of keywords) {
        console.log(`➡️ Keyword: "${keyword}" | fail=${failMap[keyword]}`);

        // Retry tối đa 2 lần
        while (failMap[keyword] < 2) {
          console.log(`🔥 Chạy keyword: "${keyword}"`);
          await this.socketGateway.sendToAll('start', keyword);

          const found = await this.executeOneRound(keyword, domain);
          console.log(found, 'found');

          if (found === undefined) {
            failMap[keyword]++;
            console.log(
              `❌ Không tìm thấy "${keyword}" (${failMap[keyword]}/2)`,
            );
            await this.sleep(1000);
          } else {
            console.log(`✅ Tìm thấy "${keyword}"`);
            failMap[keyword] = 0; // reset fail
            break; // sang keyword tiếp theo
          }
        }

        // Fail đủ 2 lần
        if (failMap[keyword] >= 2) {
          await this.socketGateway.sendToAll(
            'stop',
            `⚠️ Keyword "${keyword}" không tìm thấy 2 lần, tạm bỏ`,
          );
        }
      }

      // ✅ QUAN TRỌNG: RESET failMap để chạy lại từ đầu
      console.log('♻️ Reset failMap, quay lại từ đầu');
      for (const keyword of keywords) {
        failMap[keyword] = 0;
      }

      await this.socketGateway.sendToAll(
        'start',
        '🔁 Đã chạy hết keyword, reset và chạy lại từ đầu',
      );

      await this.sleep(3000);
    }
  }

  async executeOneRound(keyword: string, domain: string) {
    // 👉 1. Mở trình duyệt (ví dụ click vào ô tìm kiếm & gõ google)
    await mouse.move(straightTo(new Point(200, 1600)));
    await mouse.click(Button.LEFT);
    await keyboard.type('Google');
    await keyboard.type(Key.Enter);

    // 👉 2. Click tài khoản Google
    await mouse.move(straightTo(new Point(700, 500)));
    await mouse.click(Button.LEFT);
    // 👉 3. Mở DevTools
    await keyboard.pressKey(Key.F12);
    await keyboard.releaseKey(Key.F12);

    // 👉 4. Gõ google.com
    await mouse.move(straightTo(new Point(200, 70)));
    await mouse.click(Button.LEFT);
    await clipboard.setContent('google.com');
    await keyboard.pressKey(Key.LeftControl, Key.V);
    await keyboard.releaseKey(Key.LeftControl, Key.V);
    await keyboard.type(Key.Enter);

    await new Promise((r) => setTimeout(r, 3000));
    // 👉 5. Gõ từ khóa
    await mouse.move(straightTo(new Point(700, 450)));

    await mouse.click(Button.LEFT);
    // await keyboard.type(keyword);
    await clipboard.setContent(keyword);
    await keyboard.pressKey(Key.LeftControl, Key.V);
    await keyboard.releaseKey(Key.LeftControl, Key.V);
    await keyboard.type(Key.Enter);
    await new Promise((r) => setTimeout(r, 10000));

    // 👉 6. Scroll tìm domain
    await this.findAndScroll(domain);

    // 👉 8. Chờ một chút để chuẩn bị vòng sau
    await new Promise((r) => setTimeout(r, 2000));
  }

  async findAndScroll(target: any) {
    let found = false;
    const worker = await createWorker({});

    await worker.load(); // 1. Load engine
    await worker.loadLanguage('vie+eng'); // 2. Load ngôn ngữ
    await worker.initialize('vie+eng'); // 3. Khởi tạo OCR

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    // đảm bảo cửa sổ được focus
    await mouse.move(straightTo(new Point(600, 400)));

    const scrollStep = 600; // pixels mỗi lần cuộn
    const postScrollWait = 1200; // ms đợi render sau mỗi lần cuộn

    for (let i = 0; i < 4 && !found; i++) {
      console.log(`🔍 Lần ${i + 1}: đang quét màn hình...`);
      await this.socketGateway.sendToAll(
        'start',
        `🔍 Lần ${i + 1}: đang quét màn hình...`,
      );
      try {
        // 📸 Chụp ảnh màn hình
        const image: any = await screen.grab();

        // 🧩 Xử lý ảnh trước OCR
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

        // 🔠 OCR
        const { data } = await worker.recognize(pngBuffer, {
          left: 0,
          top: 0,
          width: image.width * 2,
          height: image.height * 2,
        } as any);
        const text = data?.text?.toLowerCase() || '';
        if (text.includes('not a robot')) {
          await this.socketGateway.sendToAll('robot', 1);
          await this.socketGateway.sendToAll('start', `not a robot`);
          await this.HistoryRepository.save({
            created_at: currentTimestamp(),
            status: StatusEnum.ROBOT,
          });
          // ✅ Gán cờ để dừng vòng lặp
          found = true;
          await keyboard.pressKey(Key.LeftControl, Key.W);
          await keyboard.releaseKey(Key.LeftControl, Key.W);
        }

        const isMatch = target.some((t) => text.includes(t.toLowerCase()));
        if (isMatch) {
          console.log('✅ Đã thấy chữ:', target);
          await this.socketGateway.sendToAll(
            'start',
            '✅ Đã thấy chữ: ' + target,
          );
          await this.socketGateway.sendToAll('success', 1);
          await this.HistoryRepository.save({
            created_at: currentTimestamp(),
            status: StatusEnum.SUCCESS,
          });
          if (data.words && data.words.length) {
            for (const word of data.words) {
              if (word.text.toLowerCase().includes(target)) {
                // console.log('📍 Tìm thấy từ:', word.text, word.bbox);
                const { x0, y0, x1, y1 } = word.bbox;
                const scaleX = image.width / (image.width * 2); // = 0.5
                const scaleY = image.height / (image.height * 2); // = 0.5

                const realX0 = x0 * scaleX;
                const realY0 = y0 * scaleY;
                const realX1 = x1 * scaleX;
                const realY1 = y1 * scaleY;
                const clickX = realX0 + (realX1 - realX0) / 2;
                const clickY = realY0 + (realY1 - realY0) / 2;

                await mouse.move(straightTo(new Point(clickX, clickY)));
                await mouse.click(Button.LEFT);
                await new Promise((r) => setTimeout(r, 700)); // đợi load nội dung
                for (let i = 0; i < 10; i++) {
                  await mouse.scrollDown(400);
                  await new Promise((r) => setTimeout(r, 400));
                }
                await new Promise((r) => setTimeout(r, 1000)); // đợi load nội dung
                // ✅ Gán cờ để dừng vòng lặp
                found = true;
                await keyboard.pressKey(Key.LeftControl, Key.LeftShift, Key.W);
                await keyboard.releaseKey(
                  Key.LeftControl,
                  Key.LeftShift,
                  Key.W,
                );
                break;
              }
            }
          } else {
            console.log(
              '⚠️ Không có words, kiểm tra lại ảnh hoặc tesseract version',
            );
          }
        } else {
          console.log(`⤵️ Chưa thấy "${target}" — cuộn xuống ${scrollStep}px`);
          await this.socketGateway.sendToAll(
            'start',
            `⤵️ Chưa thấy "${target}" — cuộn xuống ${scrollStep}px`,
          );
          try {
            if (i === 1) {
              await keyboard.pressKey(Key.End);
              await new Promise((res) => setTimeout(res, 1500)); // giữ End
              await keyboard.releaseKey(Key.End);
            } else if (i >= 2) {
              await mouse.scrollUp(scrollStep);
            } else {
              await mouse.scrollDown(scrollStep);
            }
          } catch (e) {
            console.warn('⚠️ mouse.scrollDown lỗi, thử dùng PageDown');
            await keyboard.pressKey(Key.PageDown);
            await sleep(100);
            await keyboard.releaseKey(Key.PageDown);
          }
          await sleep(postScrollWait);
        }
      } catch (err) {
        console.error('❌ Lỗi trong lần quét:', err?.message || err);
        await mouse.scrollDown(scrollStep).catch(() => {});
        await sleep(postScrollWait);
      }
    }

    if (!found) {
      await this.socketGateway.sendToAll('error', 1);
      await this.socketGateway.sendToAll(
        'start',
        '❌ Không tìm thấy: ' + target,
      );
      await this.HistoryRepository.save({
        created_at: currentTimestamp(),
        status: StatusEnum.ERROR,
      });
      console.log('❌ Không tìm thấy:', target);
      console.log('⚠️ Đang tắt trình duyệt...');
      await keyboard.pressKey(Key.LeftControl, Key.W);
      await keyboard.releaseKey(Key.LeftControl, Key.W);
    }

    await worker.terminate();
  }
}
