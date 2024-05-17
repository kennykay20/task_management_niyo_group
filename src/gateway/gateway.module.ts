import { Module } from '@nestjs/common';
import { EventGatewayService } from './gateway.service';

@Module({
  providers: [EventGatewayService],
  exports: [EventGatewayService],
})
export class EventGatewayModule {}
