import { main } from '@/index';

describe('index', () => {
  it('should log a message', async () => {
    const mockConsoleLog = vi.spyOn(console, 'log');

    main();

    expect(mockConsoleLog).toHaveBeenCalled();
  });
});
