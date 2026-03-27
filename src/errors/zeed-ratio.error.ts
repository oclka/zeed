import { ZeedError } from '@/errors/zeed.error';
import { ZeedRatioErrorPayload } from '@/types/errors';

/**
 * Erreur levée lors de la détection d'une mauvaise configuration de ratios pondérés.
 */
export class ZeedRatioError extends ZeedError<ZeedRatioErrorPayload> {
  constructor(public override readonly payload: ZeedRatioErrorPayload) {
    super(
      `Invalid ratio configuration for field "${payload.field}": ${payload.reason}`,
      payload
    );
  }
}
