import {
  Fieldset,
  InputLabel,
  NativeSelect,
  SegmentedControl,
  Stack,
  TextInput,
  Textarea,
} from '@mantine/core'
import { Note } from '../common/types'

export const NoteForm = ({
  data,
  mode,
  onSubmit,
}: {
  data: Partial<Note>
  mode: 'create' | 'edit'
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}) => {
  return (
    <form onSubmit={onSubmit}>
      <Stack>
        <Fieldset legend="Note Details" id="note-details">
          <Stack>
            <TextInput
              label="Title"
              description=""
              placeholder="A concise description of the note."
              defaultValue={data.title}
            />
            <Textarea
              label="Note Content"
              description=""
              placeholder="The contents of the note."
              autosize={true}
              defaultValue={data.content}
            />
          </Stack>
        </Fieldset>
        <Fieldset legend="Communication Details" id="communication-details">
          <Stack>
            <NativeSelect
              label="Type"
              description=""
              defaultValue={data.type}
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
              id="status"
              defaultValue={data.status}
              data={[
                { label: 'Success', value: 'success' },
                { label: 'Pending', value: 'pending' },
                { label: 'Failed', value: 'failed' },
              ]}
            />
            <InputLabel htmlFor="direction">Direction</InputLabel>
            <SegmentedControl
              id="direction"
              defaultValue={data.direction}
              data={[
                { label: 'Inbound', value: 'inbound' },
                { label: 'Outbound', value: 'outbound' },
              ]}
            />
            <TextInput
              label="Address"
              description=""
              placeholder="Contextual address or contact information."
              defaultValue={data.address}
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
        <button type="submit">Save</button>
      </Stack>
    </form>
  )
}
