import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Logger,
} from '@nestjs/common'
import { firstValueFrom, of, throwError } from 'rxjs'
import { RequestLoggingInterceptor } from './request-logging.interceptor'

describe('RequestLoggingInterceptor', () => {
  describe('intercept()', () => {
    it('should log the start of the request', () => {
      // Setup Mocks
      const mockLogger = {
        debug: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger
      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            path: '/test',
          }),
        }),
      } as unknown as ExecutionContext
      const mockNext = {
        handle: jest.fn().mockReturnValue(of()),
      } as unknown as CallHandler

      // Execute Test
      const interceptor = new RequestLoggingInterceptor(mockLogger)

      interceptor.intercept(mockContext, mockNext).subscribe()

      expect(mockLogger.debug).toHaveBeenCalledWith(
        'Request: GET => /test started',
      )
    })

    it('should log a successful request', async () => {
      // Setup Mocks
      jest.spyOn(Date, 'now').mockReturnValue(1000)

      const mockLogger = {
        debug: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            path: '/test',
          }),
        }),
      } as unknown as ExecutionContext

      const mockNext = {
        handle: jest.fn().mockReturnValue(of(undefined)),
      } as unknown as CallHandler

      // Execute Test
      const interceptor = new RequestLoggingInterceptor(mockLogger)

      await firstValueFrom(interceptor.intercept(mockContext, mockNext))

      expect(mockLogger.log).toHaveBeenCalledWith(
        'Request: GET => /test success... 0ms',
      )
    })

    it('should log a failed request: 500 / internal error', async () => {
      // Setup Mocks
      jest.spyOn(Date, 'now').mockReturnValue(1000)

      const mockLogger = {
        debug: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            path: '/test',
            header: {
              'x-correlation-id': '00000000-0000-0000-0000-000000000000',
            },
          }),
        }),
      } as unknown as ExecutionContext

      const mockNext = {
        handle: jest
          .fn()
          .mockImplementation(() => throwError(() => new Error('Test Error'))),
      } as unknown as CallHandler

      // Execute Test
      const interceptor = new RequestLoggingInterceptor(mockLogger)
      const result = firstValueFrom(
        interceptor.intercept(mockContext, mockNext),
      )

      expect(mockLogger.error).toBeCalledTimes(1)
      expect(mockLogger.error).toBeCalledWith(
        expect.stringContaining('Error: Test Error'),
      )

      await expect(result).rejects.toThrowError('Request FAILED: Test Error')
    })

    it('should log a failed request: 404 / not found', async () => {
      // Setup Mocks
      jest.spyOn(Date, 'now').mockReturnValue(1000)

      const mockLogger = {
        debug: jest.fn(),
        log: jest.fn(),
        error: jest.fn(),
      } as unknown as Logger

      const mockContext = {
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue({
            method: 'GET',
            path: '/test',
          }),
        }),
      } as unknown as ExecutionContext

      const mockNext = {
        handle: jest
          .fn()
          .mockImplementation(() =>
            throwError(() => new HttpException('Test Error', 404)),
          ),
      } as unknown as CallHandler

      // Execute Test
      const interceptor = new RequestLoggingInterceptor(mockLogger)
      const result = firstValueFrom(
        interceptor.intercept(mockContext, mockNext),
      )

      await expect(result).rejects.toThrowError('Request => Test Error')
    })
  })
})
