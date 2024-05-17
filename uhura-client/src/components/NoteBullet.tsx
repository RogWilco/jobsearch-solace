import { ThemeIcon } from '@mantine/core'
import {
  Icon,
  IconCalendarEvent,
  IconDialpad,
  IconDialpadFilled,
  IconFileDownload,
  IconFileUpload,
  IconMailDown,
  IconMailFilled,
  IconMailOpened,
  IconMailUp,
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconProps,
  IconSquareRounded,
} from '@tabler/icons-react'
import React from 'react'
import type { Note } from '../common/types'

export const NoteBullet = ({
  type,
  direction,
  status,
  ...props
}: Pick<Note, 'type' | 'direction' | 'status'> &
  IconProps &
  React.RefAttributes<Icon>) => {
  const iconMap = {
    call: {
      inbound: IconPhoneIncoming,
      outbound: IconPhoneOutgoing,
    },
    fax: {
      inbound: IconDialpad,
      outbound: IconDialpadFilled,
    },
    email: {
      inbound: IconMailDown,
      outbound: IconMailUp,
    },
    mail: {
      inbound: IconMailOpened,
      outbound: IconMailFilled,
    },
    submission: {
      inbound: IconFileDownload,
      outbound: IconFileUpload,
    },
    meeting: IconCalendarEvent,
    other: IconSquareRounded,
  }

  const colorMap = {
    success: 'green',
    failed: 'red',
    pending: 'blue',
    incomplete: 'orange',
  }

  let Icon

  switch (type) {
    case 'meeting':
    case 'other':
      Icon = iconMap[type]
      break

    default:
      Icon = iconMap[type][direction as 'inbound' | 'outbound']
  }

  return (
    <ThemeIcon radius="xl" color={colorMap[status]}>
      <Icon {...props} />
    </ThemeIcon>
  )
}
