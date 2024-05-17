import { Skeleton, Timeline } from '@mantine/core'

export const NoteListLoader = () => {
  return (
    <Timeline lineWidth={0}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Timeline.Item
          key={index}
          bullet={<Skeleton height={25} circle mb="xs" />}
        >
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </Timeline.Item>
      ))}
    </Timeline>
  )
}
