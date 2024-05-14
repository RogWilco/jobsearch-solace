import type { Repository } from 'typeorm'
import type { NoteEntity } from './note.entity'
import { NoteService } from './note.service'

describe('NoteService', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date(2020, 3, 1))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

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

      const service = new NoteService({
        find: jest.fn().mockResolvedValue(notes),
      } as unknown as Repository<NoteEntity>)

      expect(await service.getMany()).toBe(notes)
    })

    it('should return an empty array if no notes are found', async () => {
      const service = new NoteService({
        find: jest.fn().mockResolvedValue([]),
      } as unknown as Repository<NoteEntity>)

      expect(await service.getMany()).toEqual([])
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const service = new NoteService({
        find: jest
          .fn()
          .mockRejectedValue(new Error('Something unexpected happened')),
      } as unknown as Repository<NoteEntity>)

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
      const service = new NoteService({
        findOneOrFail: jest.fn().mockResolvedValue(note),
      } as unknown as Repository<NoteEntity>)

      expect(await service.getOne(note.id)).toBe(note)
    })

    it('should throw an error if the note is not found', async () => {
      const service = new NoteService({
        findOneOrFail: jest.fn().mockRejectedValue(new Error('Not found')),
      } as unknown as Repository<NoteEntity>)

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

      const service = new NoteService({
        save: jest.fn().mockResolvedValue(note),
      } as unknown as Repository<NoteEntity>)

      expect(await service.create(note)).toBe(note)
    })

    it('should throw an error if the note cannot be created', async () => {
      const service = new NoteService({
        save: jest.fn().mockRejectedValue(new Error('Cannot create note')),
      } as unknown as Repository<NoteEntity>)

      await expect(service.create({})).rejects.toThrow('Cannot create note')
    })
  })

  describe('update', () => {
    it('should update an existing note', async () => {
      const note = {
        id: '0051bc76-275e-4940-a2d4-1aac8549e134',
        title: 'Test Note update() 1',
        content:
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        created: new Date(2020, 3, 1),
        updated: new Date(2020, 3, 1),
      }

      const notePatchDto = {
        title: 'Test Note update() 2',
      }

      const service = new NoteService({
        findOneOrFail: jest.fn().mockResolvedValue(note),
        save: jest.fn().mockResolvedValue({
          ...note,
          ...notePatchDto,
        }),
      } as unknown as Repository<NoteEntity>)

      expect(await service.update(note.id, notePatchDto)).toMatchObject({
        ...note,
        ...notePatchDto,
      })
    })

    it('should throw an error if the note does not exist', async () => {
      const service = new NoteService({
        findOneOrFail: jest.fn().mockRejectedValue(new Error('Not found')),
      } as unknown as Repository<NoteEntity>)

      await expect(
        service.update('427ee8fe-b502-423a-9a04-04943f975b72', {
          title: 'Test Note update() 3',
        }),
      ).rejects.toThrow('Not found')
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const service = new NoteService({
        findOneOrFail: jest
          .fn()
          .mockRejectedValue(new Error('Unexpected error')),
      } as unknown as Repository<NoteEntity>)

      await expect(
        service.update('0051bc76-275e-4940-a2d4-1aac8549e134', {
          title: 'Test Note update() 4',
        }),
      ).rejects.toThrow('Unexpected error')
    })
  })

  describe('delete', () => {
    it('should delete an existing note', async () => {
      const noteId = '0051bc76-275e-4940-a2d4-1aac8549e134'
      const service = new NoteService({
        findOne: jest.fn().mockResolvedValue({ id: noteId }),
        delete: jest.fn().mockResolvedValue({ affected: 1 }),
      } as unknown as Repository<NoteEntity>)

      await expect(service.delete(noteId)).resolves.toBe(undefined)
    })

    it('should throw an error if the note does not exist', async () => {
      const service = new NoteService({
        findOne: jest.fn().mockResolvedValue(null),
      } as unknown as Repository<NoteEntity>)

      await expect(
        service.delete('0051bc76-275e-4940-a2d4-1aac8549e134'),
      ).rejects.toThrow('Note not found')
    })

    it('should throw an error if an unexpected error occurs', async () => {
      const service = new NoteService({
        findOne: jest.fn().mockRejectedValue(new Error('Unexpected error')),
      } as unknown as Repository<NoteEntity>)

      await expect(
        service.delete('0051bc76-275e-4940-a2d4-1aac8549e134'),
      ).rejects.toThrow('Unexpected error')
    })
  })
})
