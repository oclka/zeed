import { main } from '@/index';

describe('index', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.restoreAllMocks();
  });

  it('should log "zeed" when main is called', () => {
    const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
    main();
    expect(mockConsoleLog).toHaveBeenCalledWith('zeed');
  });

  describe('side effects', () => {
    it('should NOT call main() automatically when NODE_ENV is "test"', async () => {
      const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      // On recharge le module pour déclencher le code top-level
      await import('../index');
      
      expect(mockConsoleLog).not.toHaveBeenCalled();
    });

    it('should call main() automatically when NODE_ENV is NOT "test"', async () => {
      const mockConsoleLog = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      // On simule un environnement de production/développement
      vi.stubEnv('NODE_ENV', 'production');
      
      // On recharge le module avec un lien unique pour contourner le cache ESM
      await import(`../index?t=${Date.now()}`); 
      
      expect(mockConsoleLog).toHaveBeenCalledWith('zeed');
      
      vi.unstubAllEnvs();
    });
  });
});
