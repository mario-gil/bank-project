import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): object {
    return this.appService.getHello();
  }

  @Get('health')
  health(): object {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      message: 'API de Transacciones Bancarias - NestJS 9',
      endpoints: {
        transactions: '/transactions',
        health: '/health',
      },
    };
  }
}
