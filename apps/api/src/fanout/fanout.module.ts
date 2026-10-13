import { Module } from '@nestjs/common';
import { TimelineModule } from '../timeline/timeline.module';
import { FanoutProcessor } from './fanout.processor';

@Module({
  imports: [TimelineModule],
  providers: [FanoutProcessor],
})
export class FanoutModule {}
