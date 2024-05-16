import '@mantine/core/styles.css'

import {
  AppShell,
  Autocomplete,
  ComboboxStringData,
  Group,
  MantineProvider,
  createTheme,
  rem,
} from '@mantine/core'
import { IconPlus, IconSearch } from '@tabler/icons-react'
import classes from './App.module.css'
import { Note } from './common/types'
import { NoteList } from './components/NoteList'

const notes: Note[] = [
  {
    id: 'bd892314-86c5-4d6c-b233-300d87eac219',
    type: 'call',
    address: '+1 (555) 555-5555 x1701',
    direction: 'outbound',
    title: 'Call with Spock',
    content: 'Discuss the subspace anomaly',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
    type: 'call',
    address: '+1 (555) 555-5555 x1701',
    direction: 'inbound',
    title: 'Call from Uhura',
    content: 'Discuss the new communications array',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: 'b4e5f6d7-8a9b-4c5d-9e2f-3a0b1c2d3e4f',
    type: 'email',
    address: 'james.t.kirk@starfleet.gov',
    direction: 'outbound',
    title: 'Email to Kirk',
    content: 'Discuss the ferbies',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: 'f3e9c3b5-7f8e-6f9e-9e4e-b9e4e2f2a3c0',
    type: 'meeting',
    address: 'USS Enterprise, Sickbay',
    title: 'Meeting with McCoy',
    content: 'Discuss the new medical equipment',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: '3c0a2d9e-0e7d-6e6f-9e2e-7c5c9d1a0a2b',
    type: 'submission',
    address: 'Starfleet Command, San Francisco',
    direction: 'outbound',
    title: 'Warp core shielding compliance report',
    content: 'Submit the report to Starfleet Command',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: '3c0a2d9e-0e7d-6e6f-9e2e-7c5c9d1a0a2b',
    type: 'other',
    address: 'USS Enterprise, Engineering',
    title: 'Meeting with Scotty',
    content: 'Discuss the new warp drive',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: '3c0a2d9e-0e7d-6e6f-9e2e-7c5c9d1a0a2b',
    type: 'fax',
    address: '+1 (555) 555-5555',
    direction: 'inbound',
    title: 'Fax from Starfleet Command',
    content: 'New orders from Starfleet Command',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: '3c0a2d9e-0e7d-6e6f-9e2e-7c5c9d1a0a2b',
    type: 'mail',
    address: "USS Enterprise, Captain's Quarters",
    direction: 'inbound',
    title: 'Letter from Spock',
    content: 'Voicing support for the holodeck installation proposal',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
  {
    id: '3c0a2d9e-0e7d-6e6f-9e2e-7c5c9d1a0a2b',
    type: 'call',
    address: '+1 (555) 555-5555 x1701',
    direction: 'outbound',
    title: 'Called Chekov',
    content: 'Left a voicemail, requesting a report on the new phaser arrays',
    created: '2021-09-01T09:00:00.000Z',
    updated: '2021-09-01T12:00:00.000Z',
  },
]

export default function App() {
  const theme = createTheme({
    fontFamily: 'Arial, sans-serif',
    primaryColor: 'blue',
  })

  const searchResults: ComboboxStringData = []

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
                data={searchResults}
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
        <AppShell.Footer>[FOOTER]</AppShell.Footer>
      </AppShell>
    </MantineProvider>
  )
}
