import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import type { PropertyType } from '../../common/utility.types'
import type { NoteEntity } from './note.entity'
import { NoteService } from './note.service'

@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @Get()
  async getMany(): Promise<NoteEntity[]> {
    return this.noteService.getMany()
  }

  @Get(':id')
  async get(
    @Param('id') id: PropertyType<NoteEntity, 'id'>,
  ): Promise<NoteEntity> {
    return this.noteService.getOne(id)
  }

  @Post()
  async create(@Body() dto: Partial<NoteEntity>): Promise<NoteEntity> {
    return this.noteService.create(dto)
  }

  @Patch(':id')
  async update(
    @Param('id')
    id: PropertyType<NoteEntity, 'id'>,
    @Body() dto: Partial<NoteEntity>,
  ): Promise<NoteEntity> {
    return this.noteService.update({
      id,
      ...dto,
    })
  }

  @Delete(':id')
  async delete(@Param('id') id: PropertyType<NoteEntity, 'id'>): Promise<void> {
    if (!id) throw new Error('Invalid ID')

    return this.noteService.delete(id)
  }
}
