import { ZeedError } from '@/errors/zeed.error';
import { ZeedUniqueExhaustedErrorPayload } from '@/types/errors';

/**
 * Erreur levée lorsqu'un pool de valeurs uniques est épuisé.
 * 
 * Se produit lorsqu'aucune nouvelle valeur non-déjà générée n'est trouvée 
 * pour un champ marqué comment `unique: true`.
 */
export class ZeedUniqueExhaustedError extends ZeedError<ZeedUniqueExhaustedErrorPayload> {
  constructor(public override readonly payload: ZeedUniqueExhaustedErrorPayload) {
    super(
      `Pool for unique field "${payload.field}" (schema: "${payload.schema}") exhausted after ${payload.attempts} candidates. Population: ${payload.generatedCount}.`,
      payload
    );
  }
}
