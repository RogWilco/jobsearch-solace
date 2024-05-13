import { CallHandler, ExecutionContext } from '@nestjs/common'
import { of } from 'rxjs'
import { GlobalHeadersInterceptor } from './global-headers.interceptor'

describe('GlobalHeadersInterceptor', () => {
  describe('intercept()', () => {
    it('should add all configured global headers to the current response', () => {
      // Setup Mocks
      const mockSetHeader = jest.fn()
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getResponse: jest.fn().mockReturnValue({
            setHeader: mockSetHeader,
          }),
        }),
      } as unknown as ExecutionContext
      const mockNext = {
        handle: jest.fn().mockReturnValue(of()),
      } as unknown as CallHandler

      // Execute Test
      const interceptor = new GlobalHeadersInterceptor({
        'X-Test-Custom-Header': 'testing',
      })

      interceptor.intercept(mockContext, mockNext).subscribe()

      expect(mockSetHeader).toHaveBeenCalledWith(
        'X-Test-Custom-Header',
        'testing',
      )
    })
  })
})
