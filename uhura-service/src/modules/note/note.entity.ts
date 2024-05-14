import { ApiProperty } from '@nestjs/swagger'
import { Length } from 'class-validator'
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  DtoPropertyAllow,
  DtoPropertyExclude,
  DtoPropertyInclude,
  DtoPropertyRequire,
} from '../../common/decorators/dto-property.decorator'

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
