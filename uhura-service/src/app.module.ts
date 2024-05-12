import { Module } from '@nestjs/common'
import { HealthModule } from './modules/health/health.module'
import { NoteModule } from './modules/note/note.module'

@Module({
  imports: [HealthModule, NoteModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
