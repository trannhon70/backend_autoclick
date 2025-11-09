import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getTodayRangeVN } from 'src/utils';
import { Between, Repository } from 'typeorm';
import { History, StatusEnum } from './entities/history.entity';

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


}
