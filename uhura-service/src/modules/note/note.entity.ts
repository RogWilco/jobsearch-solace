import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('note')
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string

  @Column()
  title?: string

  @Column()
  content?: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created?: Date

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated?: Date

  constructor(partial: Partial<NoteEntity>) {
    Object.assign(this, partial)
  }
}
