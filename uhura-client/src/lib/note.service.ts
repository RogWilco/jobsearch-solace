import axios from 'axios'
import { Note } from '../common/types'

/**
 * A service for interacting with the uhura-service notes API.
 */
export class NoteService {
  /**
   * The singleton instance of the note service.
   */
  private static _instance: NoteService

  /**
   * Fetches the singleton instance of the note service.
   */
  public static get instance(): NoteService {
    if (!this._instance) {
      this._instance = new NoteService(
        import.meta.env.UHURA_SERVICE_URL + '/notes',
      )
    }

    return this._instance
  }

  private readonly _config = {
    headers: { Accept: 'application/json' },
  }

  /**
   * Initializes a new note service.
   *
   * @param _baseUrl the base url of the note service
   */
  constructor(private readonly _baseUrl: string) {}

  /**
   * Fetches all notes.
   *
   * @returns an array of notes
   */
  public async getMany(): Promise<Note[]> {
    const res = await axios.get<Note[]>(this._baseUrl, this._config)

    return res.data
  }

  /**
   * Fetches a single note by id.
   *
   * @param id the id of the note to fetch
   *
   * @returns the corresponding note
   */
  public async getOne(id: string): Promise<Note> {
    const res = await axios.get<Note>(`${this._baseUrl}/${id}`, this._config)

    return res.data
  }

  /**
   * Creates a new note.
   *
   * @param note the note to create
   *
   * @returns the created note
   */
  public async create(note: Note): Promise<Note> {
    const res = await axios.post<Note>(this._baseUrl, note, {
      ...this._config,
      headers: { 'Content-Type': 'application/json' },
    })

    return res.data
  }

  /**
   * Updates an existing note by its id.
   *
   * @param id the id of the note to update
   * @param note the data with which to update the note
   *
   * @returns the updated note
   */
  public async update(id: Note['id'], note: Partial<Note>): Promise<Note> {
    const res = await axios.patch<Note>(`${this._baseUrl}/${id}`, note, {
      ...this._config,
      headers: { 'Content-Type': 'application/json' },
    })

    return res.data
  }

  /**
   * Deletes a note by its id.
   *
   * @param id the id of the note to delete
   */
  public async delete(id: string): Promise<void> {
    await axios.delete(`${this._baseUrl}/${id}`, this._config)
  }
}
