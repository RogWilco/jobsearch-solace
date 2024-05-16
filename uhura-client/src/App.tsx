import '@mantine/core/styles.css'

import { MantineProvider, createTheme } from '@mantine/core'

export default function App() {
  const theme = createTheme({
    fontFamily: 'Arial, sans-serif',
    primaryColor: 'blue',
  })

  return (
    <MantineProvider theme={theme} defaultColorScheme="auto"></MantineProvider>
  )
}
