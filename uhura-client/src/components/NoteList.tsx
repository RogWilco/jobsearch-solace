import { ActionIcon, Card, Timeline, Title } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import type { Note } from '../common/types'
import { NoteItem } from './NoteItem'
import { NoteListLoader } from './NoteListLoader'

export const NoteList = ({
  notes = [],
  search = '',
  isLoading = true,
  onCreateClick,
  onEditClick,
  onDeleteClick,
  children,
  ...props
}: {
  notes: Note[]
  search: string
  isLoading: boolean
  onCreateClick: () => void
  onEditClick: (note: Note) => void
  onDeleteClick: (note: Note) => void
} & React.ComponentProps<typeof Timeline> & {
    children?: React.ReactNode
  }) => {
  return (
    <Timeline bulletSize={32} lineWidth={4} {...props}>
      {children}
      <Timeline.Item
        lineVariant="dotted"
        bullet={
          <ActionIcon color="gray" radius="xl" onClick={onCreateClick}>
            <IconPlus />
          </ActionIcon>
        }
      >
        <Card
          padding="xs"
          radius="md"
          bg="none"
          style={{
            paddingTop: 0,
          }}
        >
          <Title order={4}>Add a new note</Title>
        </Card>
      </Timeline.Item>
      {isLoading && <NoteListLoader />}
      {notes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(search.toLowerCase()) ||
            n.content.toLowerCase().includes(search.toLowerCase()),
        )
        .map((note) => (
          <NoteItem
            key={note.id}
            note={note}
            onEditClick={onEditClick}
            onDeleteClick={onDeleteClick}
          />
        ))}
    </Timeline>
  )
}
