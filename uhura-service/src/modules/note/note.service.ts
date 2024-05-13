import { Injectable } from '@nestjs/common'

export type Note = {
  id: string
  title: string
  description: string
  created: Date
  updated: Date
}

@Injectable()
export class NoteService {
  constructor() {}

  getMany(): Note[] {
    return []
  }

  getOne(): Note {
    return {
      id: '1',
      title: 'Note 1',
      description: 'This is a note',
      created: new Date(),
      updated: new Date(),
    }
  }

  create(note: Note): Note {
    return note
  }

  update(note: Partial<Note>): Note {
    return {
      id: '1',
      title: 'Note 1',
      description: 'This is a note',
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
