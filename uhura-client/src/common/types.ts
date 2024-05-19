export type Note = {
  id: string
  title: string
  content: string
  status: 'success' | 'pending' | 'failed'
  type: 'call' | 'fax' | 'email' | 'mail' | 'meeting' | 'submission' | 'other'
  direction?: 'inbound' | 'outbound'
  address: string
  created: string
  updated: string
}
