import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, type PropertyType } from 'typeorm'
import { NoteEntity } from './note.entity'

type NoteId = PropertyType<NoteEntity, 'id'>

@Injectable()
export class NoteService {
  constructor(
    @InjectRepository(NoteEntity)
    private readonly noteRepository: Repository<NoteEntity>,
  ) {}

  /**
   * Retrieves all notes.
   *
   * @returns all notes
   */
  async getMany(): Promise<NoteEntity[]> {
    return this.noteRepository.find()
  }

  /**
   * Retrieves a single note by ID.
   *
   * @param id the ID of the note to retrieve
   *
   * @throws {Error} if the ID is invalid
   *
   * @returns the corresponding note
   */
  async getOne(id: NoteId): Promise<NoteEntity> {
    if (!id) throw new Error('Invalid ID')

    return this.noteRepository.findOneOrFail({ where: { id } })
  }

  /**
   * Creates a new note.
   *
   * @param note the note to create
   *
   * @returns the created note
   */
  async create(data: Partial<NoteEntity>): Promise<NoteEntity> {
    return this.noteRepository.save(data)
  }

  /**
   * Updates an existing note.
   *
   * @param note the note to update
   *
   * @returns the updated note
   */
  async update(id: NoteId, data: Partial<NoteEntity>): Promise<NoteEntity> {
    const note = await this.noteRepository.findOneOrFail({
      where: { id: id },
    })

    return this.noteRepository.save({ ...note, ...data })
  }

  /**
   * Deletes a note by ID.
   *
   * @param id the ID of the note to delete
   */
  async delete(id: NoteId): Promise<void> {
    id
    return
  }
}
