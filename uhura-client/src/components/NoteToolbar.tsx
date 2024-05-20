import {
  ActionIcon,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from '@mantine/core'
import { IconMoon, IconPlus, IconRefresh, IconSun } from '@tabler/icons-react'

export const NoteToolbar = ({
  onCreateClick,
  onReloadClick,
}: {
  onCreateClick: () => void
  onReloadClick: () => void
}) => {
  const tooltipProps: Partial<React.ComponentProps<typeof Tooltip>> = {
    position: 'bottom-start',
    withArrow: true,
    arrowPosition: 'center',
    openDelay: 230,
  }

  const activeColorScheme = useComputedColorScheme('light')
  const { setColorScheme } = useMantineColorScheme()

  const toggleColorScheme = () => {
    setColorScheme(activeColorScheme === 'dark' ? 'light' : 'dark')
  }

  return (
    <>
      <Tooltip label="Create note" {...tooltipProps}>
        <ActionIcon
          size="input-sm"
          variant="default"
          aria-label="Create a new note"
          onClick={onCreateClick}
        >
          <IconPlus stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <Tooltip label="Reload notes" {...tooltipProps}>
        <ActionIcon
          size="input-sm"
          variant="default"
          aria-label="Reload notes"
          onClick={onReloadClick}
        >
          <IconRefresh stroke={1.5} />
        </ActionIcon>
      </Tooltip>
      <Tooltip
        label={activeColorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
        {...tooltipProps}
      >
        <ActionIcon
          size="input-sm"
          variant="default"
          aria-label={activeColorScheme === 'dark' ? 'Light mode' : 'Dark mode'}
          onClick={toggleColorScheme}
        >
          {activeColorScheme === 'dark' ? (
            <IconSun stroke={1.5} />
          ) : (
            <IconMoon stroke={1.5} />
          )}
        </ActionIcon>
      </Tooltip>
    </>
  )
}
