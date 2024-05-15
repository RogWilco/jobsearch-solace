import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import type { Repository } from 'typeorm'
import { GlobalExceptionFilter } from '../src/common/filters/global.exception-filter'
import { AppModule } from '../src/modules/app.module'
import type { NoteEntity } from '../src/modules/note/note.entity'
import { NoteModule } from '../src/modules/note/note.module'
import { TestUtils } from './test.utils'

describe('API Tests', () => {
  let app: INestApplication

  let noteRepository: Repository<NoteEntity>

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, NoteModule],
    }).compile()

    app = moduleFixture.createNestApplication()

    app.useGlobalFilters(new GlobalExceptionFilter())
    app.useGlobalPipes(new ValidationPipe({ transform: true }))

    noteRepository = moduleFixture.get('NoteEntityRepository')

    await app.init()
  })

  afterEach(async () => {
    await TestUtils.tearDownRepository(noteRepository)
    await app.close()
  })

  describe('GET /health', () => {
    test('successfully returns a valid health status response', async () => {
      return request(app.getHttpServer())
        .get('/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok')
          expect(res.body.info.application.status).toBe('up')
        })
    })
  })

  describe('GET /notes', () => {
    test('successfully returns a list of notes', async () => {
      const notes = await Promise.all(
        TestUtils.createNotes(3).map((note) => noteRepository.save(note)),
      )

      return await request(app.getHttpServer())
        .get('/notes')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(notes.length)
        })
    })

    test('successfully returns an empty list of notes', async () => {
      return await request(app.getHttpServer())
        .get('/notes')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(0)
        })
    })

    test('successfully filters notes by a search query', async () => {
      const expectedNotes = await Promise.all(
        [
          TestUtils.createNote({
            title: 'Foo Note 1',
            content: 'Note 1 content',
          }),
          TestUtils.createNote({
            title: 'Test Note 2',
            content: 'Note 2 content with foo',
          }),
          TestUtils.createNote({
            title: 'Test Note 3',
            content: 'foo',
          }),
        ].map((note) => noteRepository.save(note)),
      )

      await Promise.all(
        TestUtils.createNotes(3).map((note) => noteRepository.save(note)),
      )

      return await request(app.getHttpServer())
        .get('/notes?search=foo')
        .expect(200)
        .expect((res) => {
          expect(res.body).toBeInstanceOf(Array)
          expect(res.body).toHaveLength(expectedNotes.length)
          expect(res.body).toEqual(
            expect.arrayContaining(
              expectedNotes.map((note) => TestUtils.toJson(note)),
            ),
          )
        })
    })

    test('fails (500) when an unexpected error occurs', async () => {
      jest
        .spyOn(noteRepository, 'find')
        .mockRejectedValue(new Error('Unexpected error'))

      return await request(app.getHttpServer()).get('/notes').expect(500)
    })
  })

  describe('GET /notes/:id', () => {
    test('successfully returns a note by ID', async () => {
      const note = await noteRepository.save(TestUtils.createNote())

      return await request(app.getHttpServer())
        .get(`/notes/${note.id}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toMatchObject(TestUtils.toJson(note))
        })
    })

    test('returns a 404 error if the note does not exist', async () => {
      return await request(app.getHttpServer())
        .get('/notes/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })
  })

  describe('POST /notes', () => {
    test('successfully creates a new note', async () => {
      const note = TestUtils.createNote({
        content: TestUtils.randomString(20),
      })

      const res = await request(app.getHttpServer())
        .post('/notes')
        .send(note)
        .expect(201)

      const expectedNote = await noteRepository.findOneOrFail({
        where: { id: res.body.id },
      })

      expect(res.body).toMatchObject(TestUtils.toJson(expectedNote))
    })

    test('fails (400) when the note content is less than 20 characters', async () => {
      return await request(app.getHttpServer())
        .post('/notes')
        .send({ title: 'Title', content: TestUtils.randomString(19) })
        .expect(400)
    })

    test('fails (400) when the note content is more than 300 characters', async () => {
      return await request(app.getHttpServer())
        .post('/notes')
        .send({
          title: 'Title',
          content: TestUtils.randomString(301),
        })
        .expect(400)
    })

    test('fails (400) when the note is invalid', async () => {
      return await request(app.getHttpServer())
        .post('/notes')
        .send({})
        .expect(400)
    })

    test('fails (500) when an unexpected error occurs', async () => {
      jest
        .spyOn(noteRepository, 'save')
        .mockRejectedValue(new Error('Unexpected error'))

      return await request(app.getHttpServer())
        .post('/notes')
        .send(TestUtils.createNote())
        .expect(500)
    })
  })

  describe('PATCH /notes/:id', () => {
    test('successfully updates an existing note', async () => {
      const note = await noteRepository.save(TestUtils.createNote())

      const res = await request(app.getHttpServer())
        .patch(`/notes/${note.id}`)
        .send({ text: 'Updated note' })
        .expect(200)

      const expectedNote = await noteRepository.findOneOrFail({
        where: { id: res.body.id },
      })

      expect(res.body).toMatchObject(TestUtils.toJson(expectedNote))
    })

    test('fails (404) when the note does not exist', async () => {
      return await request(app.getHttpServer())
        .patch('/notes/00000000-0000-0000-0000-000000000000')
        .send({ text: 'Updated note' })
        .expect(404)
    })

    test('fails (400) when the note is invalid', async () => {
      const note = await noteRepository.save(TestUtils.createNote())

      return await request(app.getHttpServer())
        .patch(`/notes/${note.id}`)
        .send({
          title: false,
        })
        .expect(400)
    })

    test('fails (500) when an unexpected error occurs', async () => {
      jest
        .spyOn(noteRepository, 'findOneOrFail')
        .mockRejectedValue(new Error('Unexpected error'))

      return await request(app.getHttpServer())
        .patch('/notes/00000000-0000-0000-0000-000000000000')
        .send({ text: 'Updated note' })
        .expect(500)
    })
  })

  describe('DELETE /notes/:id', () => {
    test('successfully deletes a note by ID', async () => {
      const note = await noteRepository.save(TestUtils.createNote())

      return await request(app.getHttpServer())
        .delete(`/notes/${note.id}`)
        .expect(204)
    })

    test('fails (404) when the note does not exist', async () => {
      return await request(app.getHttpServer())
        .delete('/notes/00000000-0000-0000-0000-000000000000')
        .expect(404)
    })

    test('fails (500) when an unexpected error occurs', async () => {
      jest
        .spyOn(noteRepository, 'findOne')
        .mockRejectedValue(new Error('Unexpected error'))

      return await request(app.getHttpServer())
        .delete('/notes/00000000-0000-0000-0000-000000000000')
        .expect(500)
    })
  })
})
