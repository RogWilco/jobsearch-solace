import axios, { AxiosResponse } from 'axios'

export class NoteService {
  constructor(
    private readonly _baseUrl: string = 'http://localhost:3000/notes',
  ) {}

  public async getNotes(): Promise<AxiosResponse> {
    return axios.get(this._baseUrl)
  }
}
