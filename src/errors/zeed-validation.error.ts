import { ZeedError } from '@/errors/zeed.error';
import { ZeedValidationErrorPayload } from '@/types/errors';

/**
 * Erreur spécifique levée lors d'un échec de validation persistante.
 * 
 * Se produit lorsque le moteur Zeed a épuisé toutes les itérations de régénération
 * autorisées (`maxRetries`) sans parvenir à produire une donnée conforme au schéma.
 * 
 * @template TValidationError - Le type de l'erreur brute (ex: `ZodError`, `ValibotError`).
 */
export class ZeedValidationError<TValidationError = Error> extends ZeedError<ZeedValidationErrorPayload> {
  /**
   * @param payload - Métadonnées sur l'échec de validation.
   */
  constructor(public override readonly payload: ZeedValidationErrorPayload) {
    super(
      `Generation failed for field "${payload.field}" (schema: "${payload.schema}") after ${payload.attempts} attempts.`,
      payload
    );
  }

  /**
   * Retourne l'erreur originale de validation de façon typée.
   */
  public get rawError(): TValidationError {
    return this.payload.validationError as TValidationError;
  }
}
