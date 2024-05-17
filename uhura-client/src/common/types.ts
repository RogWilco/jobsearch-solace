export type Note = {
  id: string
  title: string
  content: string
  type: 'call' | 'fax' | 'email' | 'mail' | 'meeting' | 'submission' | 'other'
  address: string
  direction?: 'inbound' | 'outbound'
  status: 'success' | 'pending' | 'failed'
  created: string
  updated: string
}
