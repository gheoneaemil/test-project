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
    
      async getTotalTransferred(startDate: string, endDate: string): Promise<string | 0> {
        try {
          const total = await this.transferRepository
            .createQueryBuilder('transfer')
            .select('SUM(CAST(transfer.amount AS NUMERIC))', 'totalTransferred')
            .where('transfer.createdAt BETWEEN :startDate AND :endDate', { 
              startDate: new Date(startDate), 
              endDate: new Date(endDate) 
            }).getRawOne();
            
          return total?.totalTransferred || 0;
        } catch(err) {
          console.error(err);
          return 0;
        }
      }
    
      async getTopAccounts(limit: number) {
        try {
          return await this.transferRepository
            .createQueryBuilder('transfer')
            .select('transfer.from', 'account')
            .addSelect('SUM(transfer.amount)', 'totalVolume')  // Alias for SUM
            .groupBy('transfer.from')
            .orderBy('SUM(transfer.amount)', 'DESC')  // Use the expression directly in ORDER BY
            .limit(limit)
            .getRawMany();
        } catch(err) {
          console.error(err);
          return [];
        }
      }
}
