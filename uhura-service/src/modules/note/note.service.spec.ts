import { NoteService } from './note.service'

describe('NoteService', () => {
  describe('getMany', () => {
    it('should return an array of notes', async () => {
      const notes = [
        {
          id: 'b3f37758-88f1-466b-b1bf-3ca6666675fe',
          title: 'Test Note getMany() 1',
          content: 'This is a note',
        },
        {
          id: 'a74e41f8-8b0d-4ea6-941b-112c00a1f3b7',
          title: 'Test Note getMany() 2',
          content: 'This is another note',
        },
        {
          id: 'f2c3b6c6-2f2b-4a5d-8e1e-3c4c3b2c1b6c',
          title: 'Test Note getMany() 3',
          content: 'This is yet another note',
        },
      ]
      const noteRepository = {
        find: jest.fn().mockResolvedValue(notes),
      }
      const service = new NoteService(noteRepository as any)

      expect(await service.getMany()).toBe(notes)
    })

    it('should return an empty array if no notes are found', async () => {
      const noteRepository = {
        find: jest.fn().mockResolvedValue([]),
      }
      const service = new NoteService(noteRepository as any)

      expect(await service.getMany()).toEqual([])
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const noteRepository = {
        find: jest
          .fn()
          .mockRejectedValue(new Error('Something unexpected happened')),
      }
      const service = new NoteService(noteRepository as any)

      await expect(service.getMany()).rejects.toThrow(
        'Something unexpected happened',
      )
    })
  })

  describe('getOne', () => {
    it('should the requested a note', async () => {
      const note = {
        id: '0051bc76-275e-4940-a2d4-1aac8549e134',
        title: 'Test Note getOne()',
        content:
          'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      }
      const noteRepository = {
        findOneOrFail: jest.fn().mockResolvedValue(note),
      }
      const service = new NoteService(noteRepository as any)

      expect(await service.getOne(note.id)).toBe(note)
    })

    it('should throw an error if the ID is invalid', async () => {
      const service = new NoteService({} as any)

      await expect(service.getOne('')).rejects.toThrow('Invalid ID')
    })

    it('should throw an error if the note is not found', async () => {
      const noteRepository = {
        findOneOrFail: jest.fn().mockRejectedValue(new Error('Not found')),
      }
      const service = new NoteService(noteRepository as any)

      await expect(
        service.getOne('b3f37758-88f1-466b-b1bf-3ca6666675fe'),
      ).rejects.toThrow('Not found')
    })
  })

  describe('create', () => {
    it('should create a new note', async () => {
      const note = {
        id: '0051bc76-275e-4940-a2d4-1aac8549e134',
        title: 'Test Note create()',
        content:
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      }
      const noteRepository = {
        save: jest.fn().mockResolvedValue(note),
      }
      const service = new NoteService(noteRepository as any)

      expect(await service.create(note)).toBe(note)
    })

    it('should throw an error if the note is invalid', async () => {
      const service = new NoteService({} as any)

      await expect(service.create({})).rejects.toThrow('Invalid note')
    })

    it('should throw an error if the note cannot be created', async () => {
      const noteRepository = {
        save: jest.fn().mockRejectedValue(new Error('Cannot create note')),
      }
      const service = new NoteService(noteRepository as any)

      await expect(service.create({})).rejects.toThrow('Cannot create note')
    })
  })

  describe('update', () => {
    it('should update an existing note', async () => {
      const note = {
        id: '0051bc76-275e-4940-a2d4-1aac8549e134',
        title: 'Test Note update()',
        content:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      }
      const noteRepository = {
        save: jest.fn().mockResolvedValue(note),
      }
      const service = new NoteService(noteRepository as any)

      expect(await service.update(note)).toBe(note)
    })

    it('should throw an error if the note is invalid', async () => {
      const service = new NoteService({} as any)

      await expect(service.update({})).rejects.toThrow('Invalid note')
    })

    it('should throw an error if the note cannot be updated', async () => {
      const noteRepository = {
        save: jest.fn().mockRejectedValue(new Error('Cannot update note')),
      }
      const service = new NoteService(noteRepository as any)

      await expect(service.update({})).rejects.toThrow('Cannot update note')
    })
  })

  describe('delete', () => {
    it('should delete an existing note', async () => {
      const noteRepository = {
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      }
      const service = new NoteService(noteRepository as any)

      await expect(
        service.delete('0051bc76-275e-4940-a2d4-1aac8549e134'),
      ).resolves.toBe(undefined)
    })

    it('should throw an error if the ID is invalid', async () => {
      const service = new NoteService({} as any)

      await expect(service.delete('')).rejects.toThrow('Invalid ID')
    })

    it('should throw an error if the note cannot be deleted', async () => {
      const noteRepository = {
        delete: jest.fn().mockRejectedValue(new Error('Cannot delete note')),
      }
      const service = new NoteService(noteRepository as any)

      await expect(
        service.delete('0051bc76-275e-4940-a2d4-1aac8549e134'),
      ).rejects.toThrow('Cannot delete note')
    })
  })
})
