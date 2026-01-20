import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): object {
    return {
      message: 'API de Transacciones Bancarias',
      version: '1.0.0',
      framework: 'NestJS 9',
      description:
        'API escalable para la gestión de transacciones bancarias con persistencia en sesión',
      documentation: '/api/docs',
    };
  }
}
