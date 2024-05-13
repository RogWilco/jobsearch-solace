import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database.module'
import { HealthModule } from './health/health.module'
import { NoteModule } from './note/note.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    HealthModule,
    NoteModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
