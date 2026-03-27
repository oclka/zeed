import { ZeedError } from '@/errors/zeed.error';
import { ZeedOrmErrorPayload } from '@/types/errors';

/**
 * Erreur spécifique levée lors d'un échec d'interaction avec la base de données.
 * 
 * Capturée par le plugin ORM lors de la phase finale de persistance (`.orm()`).
 * 
 * @template TEntity - Le type structurel de l'entité ayant causé l'échec (ex: `User`).
 * @template TOriginalError - Le type de l'erreur brute levée par le driver ORM.
 */
export class ZeedOrmError<TEntity = unknown, TOriginalError = Error> extends ZeedError<ZeedOrmErrorPayload> {
  /**
   * @param payload - Détails techniques de l'erreur SQL/ORM.
   */
  constructor(public override readonly payload: ZeedOrmErrorPayload) {
    super(
      `ORM insertion failed for table "${payload.table}". Original error: ${
        (payload.originalError as Error)?.message || 'Unknown'
      }`,
      payload
    );
  }

  /**
   * Retourne l'erreur originale du driver SQL/ORM de façon typée.
   */
  public get originalError(): TOriginalError {
    return this.payload.originalError as TOriginalError;
  }

  /**
   * Retourne l'entité brute ayant causé l'échec de façon typée.
   */
  public get failingEntity(): TEntity {
    return this.payload.entity as TEntity;
  }
}
