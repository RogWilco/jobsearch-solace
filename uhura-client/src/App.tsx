import '@mantine/core/styles.css'

import {
  AppShell,
  Autocomplete,
  Group,
  MantineProvider,
  createTheme,
  rem,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import classes from './App.module.css'
import { Note } from './common/types'
import { NoteList } from './components/NoteList'
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
              <h1>Uhura Service</h1>
            </Group>
            <Group>
              <Group ml={50} gap={5} className={classes.links} visibleFrom="xs">
                <a className={classes.link} onClick={(e) => e.preventDefault()}>
                  <IconPlus className={classes.icon} stroke={1.5} />
                </a>
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
          <Group>
            <NoteList notes={notes} />
          </Group>
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  )
}
