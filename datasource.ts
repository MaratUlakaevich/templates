// datasource.ts
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';

// Если вы используете NestJS ConfigModule глобально,
// для миграций нужно будет напрямую прочитать .env файл.
// Можно использовать dotenv:
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('DATABASE_HOST'),
  port: configService.get<number>('DATABASE_PORT'),
  username: configService.get<string>('DATABASE_USER'),
  password: configService.get<string>('DATABASE_PASSWORD'),
  database: configService.get<string>('DATABASE_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*.js'], // Путь к миграциям после компиляции
  synchronize: false,
});
