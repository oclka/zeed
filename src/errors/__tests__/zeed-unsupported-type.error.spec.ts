import { ZeedUnsupportedTypeError } from '@/errors/zeed-unsupported-type.error';

describe('ZeedUnsupportedTypeError', () => {
  it('should format message with typeName and path', () => {
    const payload = {
      typeName: 'ZodLazy',
      path: 'user.friends',
    };

    const error = new ZeedUnsupportedTypeError(payload);

    expect(error.message).toBe('Unsupported type "ZodLazy" encountered at path "user.friends". Use a custom generator to override.');
  });

  it('should include suggestion if provided', () => {
    const payload = {
      typeName: 'VPipe',
      path: 'email',
      suggestion: 'Try using .transform() instead.',
    };

    const error = new ZeedUnsupportedTypeError(payload);

    expect(error.message).toContain('Try using .transform() instead.');
  });
});
