import { Skeleton, Timeline } from '@mantine/core'

export const NoteListLoader = () => {
  return (
    <>
      {Array.from({ length: 5 }).map((_, index) => (
        <Timeline.Item
          style={{ background: 'none' }}
          key={index}
          lineVariant="dotted"
          bullet={<Skeleton width={10} height={10} circle radius="xl" />}
        >
          <Skeleton height={24} width={'60%'} radius="xl" />
          <Skeleton height={16} mt={6} radius="xl" />
          <Skeleton height={16} mt={6} radius="xl" />
          {/* </Card> */}
        </Timeline.Item>
      ))}
    </>
  )
}
