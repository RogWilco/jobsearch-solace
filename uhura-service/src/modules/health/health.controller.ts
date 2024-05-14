import { Controller, Get } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import {
  HealthCheck,
  HealthCheckResult,
  HealthCheckService,
  HealthIndicatorResult,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus'

@ApiTags('Auxiliary')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
  ) {}

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
    return this.health.check([
      () => this._selfCheck('application'),
      () => this.db.pingCheck('database'),
    ])
  }
}
