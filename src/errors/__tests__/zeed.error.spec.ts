import { ZeedError } from '@/errors/zeed.error';

describe('ZeedError', () => {
  it('should initialize with message, payload, name and timestamp', () => {
    const error = new (class SampleError extends ZeedError<{ foo: string }> {})('Test msg', { foo: 'bar' });

    expect(error.message).toBe('Test msg');
    expect(error.payload).toEqual({ foo: 'bar' });
    expect(error.name).toBe('SampleError');
    expect(error.timestamp).toBeInstanceOf(Date);
  });

  it('should be serializable to JSON', () => {
    const error = new (class SampleError extends ZeedError<{ id: number }> {})('ERR', { id: 123 });

    const json = error.toJSON();

    expect(json).toEqual({
      name: 'SampleError',
      message: 'ERR',
      timestamp: error.timestamp.toISOString(),
      payload: { id: 123 },
    });
  });

  it('should be instance of Error and ZeedError', () => {
    const error = new (class extends ZeedError<never[]> {})('fail', []);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ZeedError);
  });
});
