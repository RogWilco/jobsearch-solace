import { Card, Timeline } from '@mantine/core'
import type { Note } from '../common/types'
import { NoteBullet } from './NoteBullet'

export const NoteItem = ({
  id,
  title,
  content,
  type,
  direction,
  children,
  ...props
}: Pick<Note, 'id' | 'title' | 'content' | 'type' | 'direction'> &
  React.ComponentProps<typeof Timeline.Item> & {
    children?: React.ReactNode
  }) => {
  return (
    <Timeline.Item
      key={id}
      // title={title}
      bullet={<NoteBullet type={type} direction={direction} size={18} />}
      {...props}
    >
      <Card shadow="xs" padding="md" radius="md">
        {content}
      </Card>
      {children}
    </Timeline.Item>
  )
}
