import { Timeline } from '@mantine/core'
import { useState } from 'react'
import type { Note } from '../common/types'
import { NoteItem } from './NoteItem'

export const NoteList = ({
  notes = [],
  children,
  ...props
}: { notes: Note[] } & React.ComponentProps<typeof Timeline> & {
    children?: React.ReactNode
  }) => {
  const [currentNotes, setNotes] = useState<Note[]>(notes)

  return (
    <Timeline
      bulletSize={32}
      lineWidth={2}
      active={currentNotes.length}
      {...props}
    >
      {children}
      {currentNotes.map((note) => (
        <NoteItem {...note} />
      ))}
    </Timeline>
  )
}
