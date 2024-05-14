import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import type { PropertyType } from '../../common/utility.types'
import { NoteGetDto, NotePatchDto, NotePostDto } from './note.dtos'
import { NoteEntity } from './note.entity'
import { NoteService } from './note.service'

@ApiBadRequestResponse({
  description: 'Invalid request',
})
@ApiInternalServerErrorResponse({
  description: 'Internal server error',
})
@ApiTags('Notes')
@Controller('notes')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  /**
   * Retrieves all notes.
   *
   * @returns all notes
   */
  @ApiOkResponse({
    type: [NoteGetDto],
    description: 'The notes were fetched successfully',
  })
  @Get()
  async getMany(): Promise<NoteGetDto[]> {
    return this.noteService.getMany()
  }

  /**
   * Retrieves a single note by ID.
   *
   * @param id
   *
   * @returns the corresponding note
   */
  @ApiNotFoundResponse({
    description: 'The note was not found',
  })
  @ApiOkResponse({
    type: NoteGetDto,
    description: 'The note was fetched successfully',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The note ID',
  })
  @Get(':id')
  async get(
    @Param('id')
    id: PropertyType<NoteEntity, 'id'>,
  ): Promise<NoteGetDto> {
    return this.noteService.getOne(id)
  }

  /**
   * Creates a new note.
   *
   * @param dto the note to create
   *
   * @returns the created note
   */
  @ApiCreatedResponse({
    type: NoteGetDto,
    description: 'The note was created successfully',
  })
  @ApiBody({
    type: NotePostDto,
    description: 'The note to be created',
  })
  @Post()
  async create(@Body() dto: NotePostDto): Promise<NoteEntity> {
    return this.noteService.create(dto)
  }

  /**
   * Updates an existing note.
   *
   * @param id the ID of the note to update
   * @param dto the note to update
   *
   * @returns the updated note
   */
  @ApiBody({
    type: NotePatchDto,
    description: 'The note to be updated',
  })
  @ApiNotFoundResponse({
    description: 'The note was not found',
  })
  @ApiOkResponse({
    type: NoteGetDto,
    description: 'The note was updated successfully',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The note ID',
  })
  @Patch(':id')
  async update(
    @Param('id')
    id: PropertyType<NoteEntity, 'id'>,
    @Body() dto: NotePatchDto,
  ): Promise<NoteEntity> {
    return this.noteService.update(id, dto)
  }

  /**
   * Deletes a note by ID.
   *
   * @param id the ID of the note to delete
   */
  @ApiNoContentResponse({
    description: 'The note was deleted successfully',
  })
  @ApiNotFoundResponse({
    description: 'The note was not found',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'The note ID',
  })
  @Delete(':id')
  async delete(@Param('id') id: PropertyType<NoteEntity, 'id'>): Promise<void> {
    if (!id) throw new Error('Invalid ID')

    return this.noteService.delete(id)
  }
}
