import { BaseDto } from '../../common/dto.utils'
import { NoteEntity } from './note.entity'

export class NoteGetDto extends BaseDto(NoteEntity, 'get') {}
export class NotePatchDto extends BaseDto(NoteEntity, 'patch') {}
export class NotePostDto extends BaseDto(NoteEntity, 'post') {}
