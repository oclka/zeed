import { ZeedOrmError } from '@/errors/zeed-orm.error';

describe('ZeedOrmError', () => {
  it('should format message with table and original error message', () => {
    const originalError = new Error('Unique constraint violation');
    const payload = {
      table: 'users',
      entity: { id: 1, email: 'test@example.com' },
      originalError,
    };

    const error = new ZeedOrmError(payload);

    expect(error.message).toContain('ORM insertion failed for table "users"');
    expect(error.message).toContain('Unique constraint violation');
    expect(error.originalError).toBe(originalError);
    expect(error.failingEntity).toEqual(payload.entity);
  });

  it('should handle non-Error original errors gracefully', () => {
    const payload = {
      table: 'users',
      entity: {},
      originalError: 'Something went wrong',
    };

    const error = new ZeedOrmError(payload);

    expect(error.message).toContain('Original error: Unknown');
  });

  it('should handle null or undefined original errors without crashing', () => {
    const payload = {
      table: 'orders',
      entity: {},
      originalError: null,
    };

    const error = new ZeedOrmError(payload);

    expect(error.message).toContain('Original error: Unknown');
  });
});
