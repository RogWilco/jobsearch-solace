import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import {
  DtoPropertyAllow,
  DtoPropertyRequire,
} from '../../common/decorators/dto-property.decorator'

@Entity('note')
export class NoteEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @DtoPropertyRequire()
  @DtoPropertyAllow('patch')
  id?: string

  @Column()
  @DtoPropertyRequire()
  title?: string

  @Column()
  @DtoPropertyRequire()
  content?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @DtoPropertyRequire()
  created?: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  @DtoPropertyRequire()
  updated?: Date
}
