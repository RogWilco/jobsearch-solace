import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import * as PACKAGE from 'package.json'
import { expand } from './common/core.utils'
import { GlobalHeadersInterceptor } from './common/interceptors/global-headers.interceptor'
import { AppModule } from './modules/app.module'

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.disable('x-powered-by')

  app.useGlobalInterceptors(
    new GlobalHeadersInterceptor({
      'X-Application-Version': expand`${'name'}/${'version'}`(PACKAGE),
    }),
  )

  await app.listen(config.get('SERVICE_PORT') || 3000)
}

main()
