import { ZeedValidationError } from '@/errors/zeed-validation.error';

describe('ZeedValidationError', () => {
  it('should format message with field, schema and attempts', () => {
    const payload = {
      field: 'email',
      schema: 'User',
      attempts: 5,
      lastValue: 'invalid-email',
      validationError: new Error('Invalid email format'),
    };

    const error = new ZeedValidationError(payload);

    expect(error.message).toBe('Generation failed for field "email" (schema: "User") after 5 attempts.');
    expect(error.rawError).toBe(payload.validationError);
  });

  it('should support generic type for validationError', () => {
    interface CustomError { code: string; message: string }
    const validationError: CustomError = { code: 'REQUIRED', message: 'Missing' };
    const payload = {
      field: 'id',
      schema: 'Base',
      attempts: 1,
      lastValue: null,
      validationError,
    };

    const error = new ZeedValidationError<CustomError>(payload);

    expect(error.rawError.code).toBe('REQUIRED');
  });
});
