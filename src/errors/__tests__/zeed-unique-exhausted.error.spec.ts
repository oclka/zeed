import { ZeedUniqueExhaustedError } from '@/errors/zeed-unique-exhausted.error';

describe('ZeedUniqueExhaustedError', () => {
  it('should format the message with field, schema, attempts and population', () => {
    const payload = {
      field: 'slug',
      schema: 'Post',
      attempts: 100,
      generatedCount: 50,
    };

    const error = new ZeedUniqueExhaustedError(payload);

    expect(error.message).toBe('Pool for unique field "slug" (schema: "Post") exhausted after 100 candidates. Population: 50.');
    expect(error.payload).toEqual(payload);
  });
});
