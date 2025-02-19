import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatcherService } from './watcher/watcher.service';
import { Transfer } from './transfers/entities/transfer.entity';
import { TransfersController } from './transfers/transfers.controller';
import { TransfersService } from './transfers/transfers.service';
require('dotenv').config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: String(process.env.DB_USERNAME),
      password: String(process.env.DB_PASSWORD),
      database: 'test-project',
      entities: [__dirname + '/**/*.entity{.ts,.js}'], // Automatically load entity files
      synchronize: true, // Set to false in production to avoid auto schema sync
    }),
    TypeOrmModule.forFeature([Transfer]),
  ],
  controllers: [TransfersController],
  providers: [WatcherService, TransfersService],
})
export class AppModule {}
