import { Controller, Get } from '@nestjs/common'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
} from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  private async _selfCheck(key: string): Promise<HealthIndicatorResult> {
    return {
      [key]: {
        status: 'up',
        uptime: new Date(process.uptime() * 1000).toISOString().substr(11, 8),
      },
    }
  }

  @Get()
  @HealthCheck()
  async index(): Promise<HealthCheckResult> {
    return this.health.check([() => this._selfCheck('application')])
  }
}
