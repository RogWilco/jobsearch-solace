import { Module } from '@nestjs/common'
import { DatabaseModule } from '../database.module'
import { NoteController } from './note.controller'
import { NoteService } from './note.service'

@Module({
  imports: [DatabaseModule],
  controllers: [NoteController],
  providers: [NoteService],
})
export class NoteModule {}
