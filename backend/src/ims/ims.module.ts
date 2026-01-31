import { Module } from '@nestjs/common';
import { ImsService } from './ims.service';
import { ImsController } from './ims.controller';

@Module({
  controllers: [ImsController],
  providers: [ImsService],
  exports: [ImsService],
})
export class ImsModule {}
