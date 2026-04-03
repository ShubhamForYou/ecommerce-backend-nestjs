import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  checkStatus() {
    return {
      status: 'ok',
    };
  }
}
