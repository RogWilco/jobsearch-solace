import { randomUUID } from 'crypto'
import type { DeleteResult, ObjectLiteral, Repository } from 'typeorm'
import { NoteEntity } from '../src/modules/note/note.entity'

export class TestUtils {
  public static async tearDownRepository<T extends ObjectLiteral>(
    repo: Repository<T>,
  ): Promise<DeleteResult | void> {
    return repo.delete({})
  }

  public static toJson(object: any): any {
    return JSON.parse(JSON.stringify(object))
  }

  public static randomString(length = 10): string {
    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let randomString = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      randomString += characters.charAt(randomIndex)
    }
    return randomString
  }

  public static randomSentences(sentences: number): string {
    const loremIpsumSentences = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
      'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    ]

    let loremIpsumText = ''

    for (let i = 0; i < sentences; i++) {
      const randomIndex = Math.floor(Math.random() * loremIpsumSentences.length)
      loremIpsumText += loremIpsumSentences[randomIndex] + ' '
    }

    return loremIpsumText.trim()
  }

  public static createNote({
    id,
    title,
    content,
    created,
    updated,
  }: Partial<NoteEntity> = {}): NoteEntity {
    const NOW = new Date(new Date().toUTCString())

    return NoteEntity.create({
      id: id ?? randomUUID(),
      title: title ?? `Test Note ${TestUtils.randomString()}`,
      content: content ?? TestUtils.randomSentences(3),
      created: created ?? NOW,
      updated: updated ?? NOW,
    })
  }

  public static createNotes(
    quantity: number,
    overrides: Partial<NoteEntity> = {},
  ): NoteEntity[] {
    const notes: NoteEntity[] = []

    for (let i = 0; i < quantity; i++) {
      notes.push(
        TestUtils.createNote({
          ...overrides,
        }),
      )
    }

    return notes
  }
}
