import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // чтобы ConfigModule был доступен во всех модулях без повторного импорта
      envFilePath: '.env', // укажите путь к вашему .env
    }),
    // Подключение TypeORM
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        database: config.get<string>('DATABASE_NAME'),
        username: config.get<string>('DATABASE_USER'),
        password: config.get<string>('DATABASE_PASSWORD'),
        // entities будут добавляться по мере создания сущностей
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [/*...*/],
        synchronize: false, // В реальных проектах не включайте synchronize на продакшене. Используйте миграции.
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
