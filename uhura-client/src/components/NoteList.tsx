import { Timeline } from '@mantine/core'
import type { Note } from '../common/types'
import { NoteItem } from './NoteItem'

export const NoteList = ({
  notes = [],
  onDelete,
  children,
  ...props
}: { notes: Note[]; onDelete: (note: Note) => void } & React.ComponentProps<
  typeof Timeline
> & {
    children?: React.ReactNode
  }) => {
  return (
    <Timeline bulletSize={32} lineWidth={4} {...props}>
      {children}
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} onDelete={onDelete} />
      ))}
    </Timeline>
  )
}
