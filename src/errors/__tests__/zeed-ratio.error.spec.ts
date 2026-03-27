import { ZeedRatioError } from '@/errors/zeed-ratio.error';

describe('ZeedRatioError', () => {
  it('should format the message with field and reason', () => {
    const payload = {
      field: 'status',
      reason: 'Sum of ratios must be 1.0',
      ratios: { ACTIVE: 0.5, PENDING: 0.2 },
    };

    const error = new ZeedRatioError(payload);

    expect(error.message).toBe('Invalid ratio configuration for field "status": Sum of ratios must be 1.0');
    expect(error.payload).toEqual(payload);
  });
});
