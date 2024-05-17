import { Badge, Group, Text } from '@mantine/core'
import { Note } from '../common/types'
import { NoteUtils } from '../lib/note.utils'

export const NoteMetadata = ({ note }: { note: Note }) => {
  const { address } = note
  const meta = NoteUtils.getMetadataText(note)
  const url = NoteUtils.getAddressUrl(note)

  return (
    <Group>
      <Text c="dark" fw={700}>
        {meta}
      </Text>
      <a href={url}>
        <Badge color="blue" variant="filled" tt="inherit">
          {address}
        </Badge>
      </a>
    </Group>
  )
}
