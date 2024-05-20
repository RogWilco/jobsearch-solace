import { Button, Group, Modal, Text } from '@mantine/core'
import { IconAlertTriangleFilled } from '@tabler/icons-react'
import { Note } from '../common/types'
import { NoteForm, NoteFormMode } from './NoteForm'

export type NoteModalMode = NoteFormMode | 'delete'

export const NoteModal = ({
  data = {},
  mode = 'create',
  opened = false,
  onClose,
  onCreate,
  onUpdate,
  onDelete,
}: {
  data?: Partial<Note>
  mode?: NoteModalMode
  opened?: boolean
  onClose: () => void
  onCreate: (note: Note) => void
  onUpdate: (note: Required<Pick<Note, 'id'>> & Partial<Note>) => void
  onDelete: (note: Partial<Note>) => void
}) => {
  const titleMap = {
    create: 'Create Note',
    edit: 'Edit Note',
    delete: undefined,
  }

  const handleFormSubmit = (data: Partial<Note>) => {
    switch (mode) {
      case 'create':
        onCreate(data as Note)
        break

      case 'edit':
        onUpdate(data as Note)
        break

      case 'delete':
        onDelete(data)
        break
    }
  }

  return (
    <Modal
      title={titleMap[mode]}
      withCloseButton={mode !== 'delete'}
      opened={opened}
      onClose={onClose}
      overlayProps={{ blur: 3, backgroundOpacity: 0.45 }}
    >
      {mode === 'delete' ? (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleFormSubmit(data)
          }}
        >
          <Group>
            <IconAlertTriangleFilled />
            <Text>Are you sure you want to delete this note?</Text>
          </Group>
          <Group justify="right">
            <Button onClick={onClose} variant="default">
              Cancel
            </Button>
            <Button type="submit" variant="filled">
              Delete
            </Button>
          </Group>
        </form>
      ) : (
        <NoteForm data={data} mode={mode} onSubmit={handleFormSubmit} />
      )}
    </Modal>
  )
}
