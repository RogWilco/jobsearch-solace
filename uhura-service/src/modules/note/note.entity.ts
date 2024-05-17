import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  DtoPropertyAllow,
  DtoPropertyExclude,
  DtoPropertyInclude,
  DtoPropertyRequire,
} from '../../common/decorators/dto-property.decorator'

export enum NoteType {
  Call = 'call',
  Fax = 'fax',
  Email = 'email',
  Mail = 'mail',
  Meeting = 'meeting',
  Submission = 'submission',
  Other = 'other',
}

export enum NoteDirection {
  Inbound = 'inbound',
  Outbound = 'outbound',
}

export enum NoteStatus {
  Failed = 'failed',
  Incomplete = 'incomplete',
  Pending = 'pending',
  Success = 'success',
}

@Entity('note')
export class NoteEntity extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  @DtoPropertyInclude('get')
  id?: string

  @ApiProperty()
  @Column()
  @DtoPropertyAllow('patch')
  @DtoPropertyInclude('get')
  @DtoPropertyRequire('post')
  @Length(1, 32)
  title?: string

  @ApiProperty()
  @Column()
  @DtoPropertyAllow('patch')
  @DtoPropertyInclude('get')
  @DtoPropertyRequire('post')
  @Length(20, 300)
  content?: string

  @ApiProperty()
  @Column({ type: 'enum', enum: NoteType })
  @DtoPropertyAllow('patch')
  @DtoPropertyInclude('get')
  @DtoPropertyRequire('post')
  type?: NoteType

  @ApiProperty()
  @Column({ nullable: true })
  @DtoPropertyAllow('patch')
  @DtoPropertyInclude('get')
  @DtoPropertyRequire('post')
  address?: string

  @ApiProperty()
  @Column({ type: 'enum', enum: NoteDirection, nullable: true })
  @DtoPropertyAllow('patch', 'post')
  @DtoPropertyInclude('get')
  direction?: NoteDirection

  @ApiProperty()
  @Column({ type: 'enum', enum: NoteStatus })
  @DtoPropertyAllow('patch')
  @DtoPropertyInclude('get')
  @DtoPropertyRequire('post')
  status?: NoteStatus

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @DtoPropertyExclude('post', 'patch')
  @DtoPropertyInclude('get')
  created?: Date

  @ApiProperty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @DtoPropertyExclude('post', 'patch')
  @DtoPropertyInclude('get')
  updated?: Date
}
