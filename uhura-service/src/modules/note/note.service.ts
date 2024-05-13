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

  public async getMany(): Promise<NoteEntity[]> {
    return this.noteRepository.find()
  }

  getOne(id: PropertyType<NoteEntity, 'id'>): Promise<NoteEntity> {
    if (!id) throw new Error('Invalid ID')

    return this.noteRepository.findOneOrFail({ where: { id } })
  }

  create(note: Partial<NoteEntity>): Promise<NoteEntity> {
    return this.noteRepository.save(note)
  }

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

  delete(id: string): void {
    id
    return
  }
}
