import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WatcherService } from './watcher/watcher.service';
import { Transfer } from './modules/entities/Transfers.entity';
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
    TypeOrmModule.forFeature([Transfer])
  ],
  controllers: [AppController],
  providers: [AppService, WatcherService],
})
export class AppModule {}
