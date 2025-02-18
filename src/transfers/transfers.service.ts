import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Transfer } from './entities/transfer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TransfersService {
    constructor(
        @InjectRepository(Transfer)
        private readonly transferRepository: Repository<Transfer>,
      ) {}
    
      async getTotalTransferred(startDate: string, endDate: string) {
        const total = await this.transferRepository
          .createQueryBuilder('transfer')
          .select('SUM(transfer.amount)', 'totalTransferred')
          .where('transfer.timestamp BETWEEN :startDate AND :endDate', { startDate, endDate })
          .getRawOne();
    
        return { totalTransferred: total?.totalTransferred || 0 };
      }
    
      async getTopAccounts(limit: number) {
        return await this.transferRepository
          .createQueryBuilder('transfer')
          .select('transfer.from', 'account')
          .addSelect('SUM(transfer.amount)', 'totalVolume')
          .groupBy('transfer.from')
          .orderBy('totalVolume', 'DESC')
          .limit(limit)
          .getRawMany();
      }
}
