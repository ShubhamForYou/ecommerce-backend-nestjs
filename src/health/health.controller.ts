import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  healthService: HealthService;

  constructor(healthService: HealthService) {
    this.healthService = healthService;
  }

  @Get('status')
  check() {
    return this.healthService.checkStatus();
  }
}
