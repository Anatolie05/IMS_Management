import { Module } from '@nestjs/common';
import { MergeService } from './merge.service';
import { MergeController } from './merge.controller';

@Module({
  controllers: [MergeController],
  providers: [MergeService],
  exports: [MergeService],
})
export class MergeModule {}
