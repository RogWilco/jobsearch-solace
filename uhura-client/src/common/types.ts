export type Note = {
  id: string
  title: string
  content: string // markdown
  type: 'call' | 'fax' | 'email' | 'mail' | 'meeting' | 'submission' | 'other'
  address: string
  direction?: 'inbound' | 'outbound'
  created: string
  updated: string
}
