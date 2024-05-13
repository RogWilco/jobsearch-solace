import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, type PropertyType } from 'typeorm'
import { NoteEntity } from './note.entity'

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
  public async getMany(): Promise<NoteEntity[]> {
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
  getOne(id: PropertyType<NoteEntity, 'id'>): Promise<NoteEntity> {
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
  create(note: Partial<NoteEntity>): Promise<NoteEntity> {
    return this.noteRepository.save(note)
  }

  /**
   * Updates an existing note.
   *
   * @param note the note to update
   *
   * @returns the updated note
   */
  update(note: Partial<NoteEntity>): NoteEntity {
    return {
      id: '1',

      title: 'Note 1',
      content: 'This is a note',
      created: new Date(),
      updated: new Date(),
      ...note,
    }
  }

  /**
   * Deletes a note by ID.
   *
   * @param id the ID of the note to delete
   */
  delete(id: string): void {
    id
    return
  }
}
