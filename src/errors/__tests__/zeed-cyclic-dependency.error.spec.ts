import { ZeedCyclicDependencyError } from '@/errors/zeed-cyclic-dependency.error';

describe('ZeedCyclicDependencyError', () => {
  it('should format the error message correctly with the cycle path', () => {
    const payload = { cycle: ['users', 'orders', 'users'] };

    const error = new ZeedCyclicDependencyError(payload);

    expect(error.message).toBe('Detected cyclic dependency: users -> orders -> users');
    expect(error.payload).toEqual(payload);
    expect(error.name).toBe('ZeedCyclicDependencyError');
  });
});
