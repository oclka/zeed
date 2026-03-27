import { ZeedError } from '@/errors/zeed.error';
import { ZeedCyclicDependencyErrorPayload } from '@/types/errors';

/**
 * Erreur levée lors de la détection d'une dépendance circulaire. 
 *
 * Se produit si le graphe (DAG) inter-tables ou intra-objet ne peut pas être résolu.
 */
export class ZeedCyclicDependencyError extends ZeedError<ZeedCyclicDependencyErrorPayload> {
  constructor(public override readonly payload: ZeedCyclicDependencyErrorPayload) {
    super(
      `Detected cyclic dependency: ${payload.cycle.join(' -> ')}`,
      payload
    );
  }
}
