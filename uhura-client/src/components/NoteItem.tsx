import { Badge, Card, Text, Timeline, Title } from '@mantine/core'
import type { Note } from '../common/types'
import { NoteBullet } from './NoteBullet'

export const NoteItem = ({
  note,
  children,
  ...props
}: { note: Note } & React.ComponentProps<typeof Timeline.Item> & {
    children?: React.ReactNode
  }) => {
  const { id, title, content, type, direction, status, address } = note

  function getTitlePrefix() {
    let title = `${direction ? `${direction} ` : ''}${type}`

    if (address) {
      switch (type) {
        case 'call':
        case 'fax':
        case 'email':
        case 'mail':
        case 'submission':
          title += ` ${direction === 'inbound' ? 'from ' : 'to '}`
          break

        case 'meeting':
          title += ` at `
          break

        case 'other':
          title += ` for `
          break
      }
    }

    return title
  }

  function getAddressLink() {
    let url

    switch (type) {
      case 'mail':
      case 'meeting':
        url = `https://maps.google.com/?q=${address}`
        break

      case 'call':
      case 'fax':
        url = `tel:${address}`
        break

      case 'email':
        url = `mailto:${address}`
        break

      default:
        break
    }

    return (
      <a href={url}>
        <Badge color="blue" variant="filled" tt="inherit">
          {address}
        </Badge>
      </a>
    )
  }

  function getNoteMetadata() {
    return (
      <>
        {getTitlePrefix()}
        {getAddressLink()}
      </>
    )
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
      <Card shadow="xs" padding="md" radius="md">
        <Title order={4}>{title}</Title>
        <Text c="dark">{content}</Text>
        <Text c="dark" fw={700}>
          {getNoteMetadata()}
        </Text>
      </Card>
      {children}
    </Timeline.Item>
  )
}
