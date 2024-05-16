import {
  Icon,
  IconAt,
  IconCalendarEvent,
  IconCircle,
  IconFileText,
  IconInbox,
  IconOutbound,
  IconPhoneIncoming,
  IconPhoneOutgoing,
  IconPrinter,
  IconProps,
} from '@tabler/icons-react'
import React from 'react'
import type { Note } from '../common/types'

export const NoteBullet = ({
  type,
  direction,
  ...props
}: Pick<Note, 'type' | 'direction'> &
  IconProps &
  React.RefAttributes<Icon>) => {
  const IconMap = {
    call: {
      inbound: IconPhoneIncoming,
      outbound: IconPhoneOutgoing,
    },
    fax: {
      inbound: IconPrinter,
      outbound: IconPrinter,
    },
    email: {
      inbound: IconAt,
      outbound: IconAt,
    },
    mail: {
      inbound: IconInbox,
      outbound: IconOutbound,
    },
    submission: {
      inbound: IconFileText,
      outbound: IconFileText,
    },
    meeting: IconCalendarEvent,
    other: IconCircle,
  }

  let Icon

  switch (type) {
    case 'meeting':
    case 'other':
      Icon = IconMap[type]
      break

    default:
      Icon = IconMap[type][direction as 'inbound' | 'outbound']
  }

  return <Icon {...props} />
}
