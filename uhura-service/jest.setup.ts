import * as extendedMatchers from 'jest-extended'
import { matchers as jsonSchemaMatchers } from 'jest-json-schema'

expect.extend(jsonSchemaMatchers)
expect.extend(extendedMatchers)

const ENV = process.env

beforeAll(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  jest.spyOn(console['_stdout'], 'write').mockImplementation()

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  jest.spyOn(console['_stderr'], 'write').mockImplementation()
})

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  jest.spyOn(console['_stdout'], 'write').mockImplementation()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  jest.spyOn(console['_stderr'], 'write').mockImplementation()

  process.env = {
    ...ENV,
  }
})

afterEach(() => {
  process.env = ENV
})
