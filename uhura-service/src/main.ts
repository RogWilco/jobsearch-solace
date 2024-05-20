import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as PACKAGE from 'package.json'
import { expand } from './common/core.utils'
import { GlobalExceptionFilter } from './common/filters/global.exception-filter'
import { GlobalHeadersInterceptor } from './common/interceptors/global-headers.interceptor'
import { RequestLoggingInterceptor } from './common/interceptors/request-logging.interceptor'
import { AppModule } from './modules/app.module'

async function main() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const config = app.get(ConfigService)

  app.disable('x-powered-by')
  app.useGlobalInterceptors(
    new GlobalHeadersInterceptor({
      'X-Application-Version': expand`${'name'}/${'version'}`(PACKAGE),
    }),
    new RequestLoggingInterceptor(),
  )
  app.useGlobalPipes(new ValidationPipe({ transform: true }))
  app.useGlobalFilters(new GlobalExceptionFilter())

  app.enableCors({
    origin: '*',
  })

  // Setup Swagger
  SwaggerModule.setup(
    'docs',
    app,
    SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle('Uhura Service')
        .setDescription('API documentation for the Uhura Service')
        .setVersion(PACKAGE.version)
        .addTag(
          'Auxiliary',
          'Auxiliary endpoints for health checks and other utilities',
        )
        .addTag('Notes', 'Endpoints for managing notes')
        .build(),
    ),
  )

  await app.listen(config.get('SERVICE_PORT') || 3000)
}

main()
