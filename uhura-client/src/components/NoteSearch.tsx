import { CloseButton, TextInput, rem } from '@mantine/core'
import { IconSearch, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

export const NoteSearch = ({
  onChange = () => {},
  ...props
}: {
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
} & React.ComponentProps<typeof TextInput> & {
    children?: React.ReactNode
  }) => {
  const [search, setSearch] = useState<string>('')
  const [hideClearButton, setHideClearButton] = useState<boolean>(true)

  useEffect(() => {
    setHideClearButton(search.length === 0)
  }, [search])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    onChange(e)
  }

  const handleClearClick = () => {
    setSearch('')
    onChange({ target: { value: '' } } as React.ChangeEvent<HTMLInputElement>)
  }

  return (
    <TextInput
      onChange={handleSearchChange}
      value={search}
      placeholder="search"
      leftSection={
        <IconSearch style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
      }
      rightSection={
        <CloseButton
          onClick={handleClearClick}
          display={hideClearButton ? 'none' : 'flex'}
          icon={
            <IconX style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
          }
        />
      }
      {...props}
    />
  )
}
