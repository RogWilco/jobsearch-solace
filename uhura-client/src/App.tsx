import '@mantine/core/styles.css'

import {
  ActionIcon,
  AppShell,
  Autocomplete,
  Container,
  Group,
  MantineProvider,
  Tooltip,
  createTheme,
  rem,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import classes from './App.module.css'
import { Note } from './common/types'
import { NoteList } from './components/NoteList'
import { NoteListLoader } from './components/NoteListLoader'
import { NoteModal, NoteModalMode } from './components/NoteModal'
import { NoteService } from './lib/note.service'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const [modalMode, setModalMode] = useState<NoteModalMode>()
  const [noteData, setNoteData] = useState({})

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setNotes(await NoteService.instance.getMany())
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch notes', error)
        setLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const theme = createTheme({
    fontFamily: 'Arial, sans-serif',
    primaryColor: 'blue',
  })

  const handleCreateClick = () => {
    setNoteData({})
    setModalMode('create')
    openModal()
  }

  const handleEditClick = (note: Note) => {
    setNoteData(note)
    setModalMode('edit')
    openModal()
  }

  const handleDeleteClick = (note: Note) => {
    setNoteData(note)
    setModalMode('delete')
    openModal()
  }

  const handleNoteCreate = () => {}

  const handleNoteUpdate = () => {}

  const handleNoteDelete = async (note: Partial<Note>) => {
    if (!note.id) {
      throw new Error(`Missing required note ID for deletion.`)
    }
    try {
      await NoteService.instance.delete(note.id)
      setNotes((prev) => prev.filter((n) => n.id !== note.id))
    } catch (error) {
      console.error('Failed to delete note', error)
    }
  }

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <NoteModal
        mode={modalMode}
        data={noteData}
        opened={modalOpened}
        onClose={closeModal}
        onCreate={handleNoteCreate}
        onUpdate={handleNoteUpdate}
        onDelete={handleNoteDelete}
      />
      <AppShell>
        <AppShell.Header className={classes.header}>
          <div className={classes.inner}>
            <Group>
              <h1>Uhura</h1>
            </Group>
            <Group>
              <Group ml={50} gap={5} className={classes.links} visibleFrom="xs">
                <Tooltip
                  label="New"
                  position="bottom-start"
                  withArrow
                  arrowPosition="center"
                  openDelay={230}
                >
                  <ActionIcon
                    size="input-sm"
                    variant="default"
                    aria-label="Create a new note"
                    onClick={handleCreateClick}
                  >
                    <IconPlus className={classes.icon} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
              </Group>
              <Autocomplete
                className={classes.search}
                placeholder="search"
                leftSection={
                  <IconSearch
                    style={{ width: rem(16), height: rem(16) }}
                    stroke={1.5}
                  />
                }
                data={[]}
                visibleFrom="xs"
              />
            </Group>
          </div>
        </AppShell.Header>
        <AppShell.Main className={classes.main}>
          <Container mt="sm">
            <NoteList
              notes={notes}
              onCreateClick={handleCreateClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            >
              {loading && <NoteListLoader />}
            </NoteList>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
