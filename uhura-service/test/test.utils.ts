import { randomUUID } from 'crypto'
import type { DeleteResult, ObjectLiteral, Repository } from 'typeorm'
import {
  NoteDirection,
  NoteEntity,
  NoteStatus,
  NoteType,
} from '../src/modules/note/note.entity'

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

  public static randomNumber(length: number = 5): number {
    return Math.floor(Math.random() * length)
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

  public static pickRandomEnumValue(enumType: any): any {
    const values = Object.values(enumType)
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
  }

  public static randomAddressByType(type: NoteType): string {
    switch (type) {
      case NoteType.Call:
      case NoteType.Fax:
        return `+1 (${TestUtils.randomNumber(3)}) ${TestUtils.randomNumber(3)}-${TestUtils.randomNumber(4)}`

      case NoteType.Email:
        return TestUtils.randomString(5) + '@starfleet.com'

      case NoteType.Mail:

      case NoteType.Submission:
        return 'http://www.example.com'

      case NoteType.Other:
        return 'USS Enterprise, Engineering'

      case NoteType.Meeting:
      default:
        return "USS Enterprise, Captain's Quarters"
    }
  }

  public static createNote({
    id,
    title,
    content,
    type,
    address,
    direction,
    status,
    created,
    updated,
  }: Partial<NoteEntity> = {}): NoteEntity {
    const NOW = new Date(new Date().toUTCString())

    return NoteEntity.create({
      id: id ?? randomUUID(),
      title: title ?? `Test Note ${TestUtils.randomString()}`,
      content: content ?? TestUtils.randomSentences(3),
      type: type ?? TestUtils.pickRandomEnumValue(NoteType),
      address: address ?? "USS Enterprise, Captain's Quarters",
      direction: direction ?? TestUtils.pickRandomEnumValue(NoteDirection),
      status: status ?? TestUtils.pickRandomEnumValue(NoteStatus),
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
