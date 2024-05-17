import { Timeline } from '@mantine/core'
import type { Note } from '../common/types'
import { NoteItem } from './NoteItem'

export const NoteList = ({
  notes = [],
  children,
  ...props
}: { notes: Note[] } & React.ComponentProps<typeof Timeline> & {
    children?: React.ReactNode
  }) => {
  return (
    <Timeline bulletSize={32} lineWidth={4} {...props}>
      {children}
      {notes.map((note) => (
        <NoteItem key={note.id} note={note} />
      ))}
    </Timeline>
  )
}
