import {
  Button,
  Fieldset,
  InputLabel,
  NativeSelect,
  SegmentedControl,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core'
import { useState } from 'react'
import { Note } from '../common/types'

export type NoteFormMode = 'create' | 'edit'

export const NoteForm = ({
  data,
  mode,
  onSubmit,
}: {
  data: Partial<Note>
  mode: NoteFormMode
  onSubmit: (note: Partial<Note>) => void
}) => {
  const [title, setTitle] = useState(data.title)
  const [content, setContent] = useState(data.content)
  const [type, setType] = useState(data.type)
  const [status, setStatus] = useState(data.status)
  const [direction, setDirection] = useState(data.direction)
  const [address, setAddress] = useState(data.address)

  const handleFormChange = ({
    target: { name, value },
  }: {
    target: {
      name: string
      value: string
    }
  }) => {
    switch (name) {
      case 'title':
        setTitle(value)
        break

      case 'content':
        setContent(value)
        break

      case 'type':
        setType(value as Note['type'])
        break

      case 'status':
        setStatus(value as Note['status'])
        break

      case 'direction':
        setDirection(value as Note['direction'])
        break

      case 'address':
        setAddress(value)
        break
    }
  }

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    onSubmit({
      id: data.id,
      title,
      content,
      type,
      status,
      direction,
      address,
    })
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack>
        <Fieldset legend="Note Details" id="note-details">
          <Stack>
            <TextInput
              name="title"
              label="Title"
              description=""
              placeholder="A concise description of the note."
              onChange={handleFormChange}
              value={title}
            />
            <Textarea
              name="content"
              label="Note Content"
              description=""
              placeholder="The contents of the note."
              autosize={true}
              onChange={handleFormChange}
              value={content}
            />
          </Stack>
        </Fieldset>
        <Fieldset legend="Communication Details" id="communication-details">
          <Stack>
            <NativeSelect
              name="type"
              label="Type"
              description=""
              onChange={handleFormChange}
              value={type}
              data={[
                { label: '- select a communication type -', value: '' },
                { label: 'Call', value: 'call' },
                { label: 'Fax', value: 'fax' },
                { label: 'Email', value: 'email' },
                { label: 'Mail', value: 'mail' },
                { label: 'Meeting', value: 'meeting' },
                { label: 'Submission', value: 'submission' },
                { label: 'Other', value: 'other' },
              ]}
            />
            <InputLabel htmlFor="status">Status</InputLabel>
            <SegmentedControl
              name="status"
              id="status"
              onChange={(v) =>
                handleFormChange({ target: { name: 'status', value: v } })
              }
              value={status}
              data={[
                { label: 'Success', value: 'success' },
                { label: 'Pending', value: 'pending' },
                { label: 'Failed', value: 'failed' },
              ]}
            />
            <InputLabel htmlFor="direction">Direction</InputLabel>
            <SegmentedControl
              name="direction"
              id="direction"
              onChange={(v) =>
                handleFormChange({ target: { name: 'direction', value: v } })
              }
              value={direction}
              data={[
                { label: 'Inbound', value: 'inbound' },
                { label: 'Outbound', value: 'outbound' },
              ]}
            />
            <TextInput
              name="address"
              label="Address"
              description=""
              placeholder="Contextual address or contact information."
              onChange={handleFormChange}
              value={address}
            />
          </Stack>
        </Fieldset>
        {mode === 'edit' && (
          <>
            <TextInput
              placeholder="Created"
              disabled={true}
              readOnly={true}
              value={data.created}
            />
            <TextInput
              placeholder="Updated"
              disabled={true}
              readOnly={true}
              value={data.updated}
            />
          </>
        )}
        <Button type="submit">Save</Button>
      </Stack>
    </form>
  )
}
