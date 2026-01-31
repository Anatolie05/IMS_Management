import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ImsModule } from './ims/ims.module';
import { TagsModule } from './tags/tags.module';
import { MergeModule } from './merge/merge.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // Rate limiting
    ThrottlerModule.forRoot([{
      ttl: parseInt(process.env.THROTTLE_TTL || '60', 10),
      limit: parseInt(process.env.THROTTLE_LIMIT || '10', 10),
    }]),

    // Modules
    PrismaModule,
    AuthModule,
    UsersModule,
    ImsModule,
    TagsModule,
    MergeModule,
    DashboardModule,
  ],
})
export class AppModule {}
