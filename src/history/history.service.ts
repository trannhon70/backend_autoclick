import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTodayRangeVN } from 'src/utils';
import { Between, Repository } from 'typeorm';
import { History, StatusEnum } from './entities/history.entity';
import axios from 'axios';
@Injectable()
export class HistoryService {
  constructor(
    @InjectRepository(History)
    private readonly HistoryRepository: Repository<History>,
  ) { }

  async getAll() {
    const { start, end } = getTodayRangeVN();
    const success = await this.HistoryRepository.count({
      where: {
        status: StatusEnum.SUCCESS,
        created_at: Between(start, end)
      }
    })
    const error = await this.HistoryRepository.count({
      where: {
        status: StatusEnum.ERROR,
        created_at: Between(start, end)
      }
    })

    const robot = await this.HistoryRepository.count({
      where: {
        status: StatusEnum.ROBOT,
        created_at: Between(start, end)
      }
    })

    return {
      success, error, robot
    }
  }

  async post() {
    try {
      // const url = "https://ketoannhuy.com/wp-json/contact-form-7/v1/contact-forms/335/feedback";
      const url = "https://giaiphapthe.com/wp-json/contact-form-7/v1/contact-forms/690/feedback";

      // Tạo FormData đúng format của Contact Form 7
      const createForm = () => {
        const form = new FormData();
        form.append("_wpcf7", "690");
        form.append("_wpcf7_version", "6.1.3");
        form.append("_wpcf7_locale", "en_US");
        form.append("_wpcf7_unit_tag", "wpcf7-f690-p486-o2");
        form.append("_wpcf7_container_post", "486");

        form.append("your-name", "test");
        form.append("your-email", "test@gmail.com");
        form.append("your-number", "0123456789");
        form.append("your-location", "hồ chí minh");
        form.append("your-message", "Test API");

        return form;
      };

      const tasks = [];

      for (let i = 0; i < 50; i++) {
        tasks.push(
          axios
            .post(url, createForm(), {
              headers: { "Content-Type": "multipart/form-data" }
            })
            .catch((err) => ({
              error: true,
              message: err?.response?.data || err.message
            }))
        );
      }

      const results = await Promise.allSettled(tasks);

      results.forEach((res: any, index) => {
        console.log(res.value.data);

        // if (res.status === "rejected" || res.value?.error) {
        //   console.log(`❌ Request ${index + 1} FAILED:`, res.reason || res.value.message);
        // } else {
        //   console.log(`✅ Request ${index + 1} OK`);
        // }
      });

      console.log("Hoàn tất 50 request!");
    } catch (error) {
      console.log("Lỗi tổng:", error);
      throw error;
    }
  }



}
