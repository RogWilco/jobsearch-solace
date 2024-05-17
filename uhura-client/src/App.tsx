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
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import classes from './App.module.css'
import { Note } from './common/types'
import { NoteList } from './components/NoteList'
import { NoteListLoader } from './components/NoteListLoader'
import { NoteService } from './lib/note.service'

export default function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState<boolean>(true)

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

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
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
                  >
                    <IconPlus className={classes.icon} stroke={1.5} />
                  </ActionIcon>
                </Tooltip>
                {/* <a className={classes.link} onClick={(e) => e.preventDefault()}>

                </a> */}
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
            <NoteList notes={notes}>{loading && <NoteListLoader />}</NoteList>
          </Container>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
