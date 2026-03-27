import { ZeedError } from '@/errors/zeed.error';
import { ZeedUnsupportedTypeErrorPayload } from '@/types/errors';

/**
 * Erreur levée lorsqu'un type de schéma n'est pas supporté par le parser actif.
 */
export class ZeedUnsupportedTypeError extends ZeedError<ZeedUnsupportedTypeErrorPayload> {
  constructor(public override readonly payload: ZeedUnsupportedTypeErrorPayload) {
    super(
      `Unsupported type "${payload.typeName}" encountered at path "${payload.path}". ${
        payload.suggestion || 'Use a custom generator to override.'
      }`,
      payload
    );
  }
}
