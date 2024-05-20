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
    setNoteData(note)
    setModalMode('edit')
    openModal()
  }

  const handleDeleteClick = (note: Note) => {
    setNoteData(note)
    setModalMode('delete')
    openModal()
  }

  const handleReloadClick = async () => {
    setIsLoading(true)
    setNotes([])

    try {
      setNotes(await NoteService.instance.getMany())
    } catch (error) {
      console.error('Failed to fetch notes', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNoteCreate = async (note: Note) => {
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
            <Container w={400}>
              <NoteSearch onChange={(e) => setSearch(e.target.value)} />
            </Container>
            <Group ml={50} gap={5} className={classes.links} visibleFrom="xs">
              <NoteToolbar
                onCreateClick={handleCreateClick}
                onReloadClick={handleReloadClick}
              />
            </Group>
          </div>
        </AppShell.Header>
        <AppShell.Main className={classes.main}>
          <Container mt="sm">
            <NoteList
              notes={notes}
              search={search}
              isLoading={isLoading}
              onCreateClick={handleCreateClick}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteClick}
            ></NoteList>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
