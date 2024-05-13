import { Controller, Get } from '@nestjs/common'
import { NoteService, type Note } from './note.service'

@Controller()
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  get(): Note[] {
    return this.noteService.getMany()
  }
}
