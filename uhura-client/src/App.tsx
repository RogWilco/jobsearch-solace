import '@mantine/core/styles.css'

import {
  AppShell,
  Container,
  Group,
  MantineProvider,
  createTheme,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useState } from 'react'
import classes from './App.module.css'
import { Note } from './common/types'
import { NoteList } from './components/NoteList'
import { NoteListLoader } from './components/NoteListLoader'
import { NoteModal, NoteModalMode } from './components/NoteModal'
import { NoteSearch } from './components/NoteSearch'
import { NoteToolbar } from './components/NoteToolbar'
import { NoteService } from './lib/note.service'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [search, setSearch] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false)
  const [modalMode, setModalMode] = useState<NoteModalMode>()
  const [noteData, setNoteData] = useState({})

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        setNotes(await NoteService.instance.getMany())

        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch notes', error)
        setIsLoading(false)
      }
    }

    fetchNotes()
  }, [])

  const theme = createTheme({
    fontFamily: 'Arial, sans-serif',
    primaryColor: 'blue',
  })

  const handleCreateClick = () => {
    console.log('handleCreateClick')
    setNoteData({})
    setModalMode('create')
    openModal()
  }

  const handleEditClick = (note: Note) => {
    console.log('handleEditClick', note)
    setNoteData(note)
    setModalMode('edit')
    openModal()
  }

  const handleDeleteClick = (note: Note) => {
    console.log('handleDeleteClick', note)
    setNoteData(note)
    setModalMode('delete')
    openModal()
  }

  const handleNoteCreate = async (note: Note) => {
    console.log('handleNoteCreate', note)
    try {
      const createdNote = await NoteService.instance.create(note)

      setNotes((prev) => [...prev, createdNote])
    } catch (error) {
      console.error('Failed to create note', error)
    } finally {
      closeModal()
    }
  }

  const handleNoteUpdate = async (note: Partial<Note>) => {
    console.log('handleNoteUpdate', note)
    if (!note.id) {
      throw new Error(`Missing required note ID for update.`)
    }
    try {
      const updatedNote = await NoteService.instance.update(note.id, note)

      setNotes((prev) =>
        prev.map((n) => (n.id === updatedNote.id ? updatedNote : n)),
      )
    } catch (error) {
      console.error('Failed to update note', error)
    } finally {
      closeModal()
    }
  }

  const handleNoteDelete = async (note: Partial<Note>) => {
    console.log('handleNoteDelete', note)
    if (!note.id) {
      throw new Error(`Missing required note ID for deletion.`)
    }
    try {
      await NoteService.instance.delete(note.id)

      setNotes((prev) => prev.filter((n) => n.id !== note.id))
    } catch (error) {
      console.error('Failed to delete note', error)
    } finally {
      closeModal()
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
            <Container>
              <NoteSearch onChange={(e) => setSearch(e.target.value)} />
            </Container>
            <Group ml={50} gap={5} className={classes.links} visibleFrom="xs">
              <NoteToolbar onCreateClick={handleCreateClick} />
              {/* <Tooltip
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
              </Tooltip> */}
            </Group>
          </div>
        </AppShell.Header>
        <AppShell.Main className={classes.main}>
          <Container mt="sm">
            <NoteList
              notes={notes}
              search={search}
              onCreateClick={handleCreateClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            >
              {isLoading && <NoteListLoader />}
            </NoteList>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
