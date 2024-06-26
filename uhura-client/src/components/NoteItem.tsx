import {
  ActionIcon,
  Card,
  Popover,
  Stack,
  Text,
  Timeline,
  Title,
  Tooltip,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import type { Note } from '../common/types'
import { NoteBullet } from './NoteBullet'
import { NoteMetadata } from './NoteMetadata'

export const NoteItem = ({
  note,
  onEditClick,
  onDeleteClick,
  children,
  ...props
}: {
  note: Note
  onEditClick: (note: Note) => void
  onDeleteClick: (note: Note) => void
} & React.ComponentProps<typeof Timeline.Item> & {
    children?: React.ReactNode
  }) => {
  const [opened, { close, open }] = useDisclosure(false)

  const { id, title, content, type, direction, status } = note

  let pendingClose: ReturnType<typeof setTimeout>

  function handleMouseEnter() {
    clearTimeout(pendingClose)
    open()
  }

  function handleMouseLeave() {
    pendingClose = setTimeout(close, 500)
  }

  return (
    <Timeline.Item
      key={id}
      bullet={
        <NoteBullet
          type={type}
          direction={direction}
          status={status}
          size={18}
        />
      }
      {...props}
    >
      <Popover
        opened={opened}
        shadow="xs"
        withArrow
        position="right"
        transitionProps={{
          transition: 'fade-left',
          duration: 100,
          exitDuration: 300,
          timingFunction: 'ease',
        }}
        onClose={close}
      >
        <Popover.Target>
          <Card
            shadow="xs"
            padding="xs"
            radius="md"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Title order={4}>{title}</Title>
            <Text c="dark">{content}</Text>
            <NoteMetadata note={note} />
            <Popover.Dropdown p={10}>
              <Stack gap="xs">
                <Tooltip
                  label="Edit"
                  position="bottom-start"
                  withArrow
                  arrowPosition="center"
                  openDelay={300}
                >
                  <ActionIcon
                    aria-label="Edit"
                    size="input-xs"
                    variant="subtle"
                    color="--contrast-color"
                    onClick={() => onEditClick(note)}
                  >
                    <IconEdit />
                  </ActionIcon>
                </Tooltip>
                <Tooltip
                  label="Delete"
                  position="bottom-start"
                  withArrow
                  arrowPosition="center"
                  openDelay={300}
                >
                  <ActionIcon
                    aria-label="Delete"
                    size="input-xs"
                    variant="subtle"
                    color="--contrast-color"
                    onClick={() => onDeleteClick(note)}
                  >
                    <IconTrash />
                  </ActionIcon>
                </Tooltip>
              </Stack>
            </Popover.Dropdown>
          </Card>
        </Popover.Target>
      </Popover>
      {/* {children} */}
    </Timeline.Item>
  )
}
