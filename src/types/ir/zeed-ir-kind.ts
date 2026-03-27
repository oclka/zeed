import type { ZeedIRNode } from './zeed-ir-node';

/**
 * Union exhaustive des discriminateurs d'identification des nœuds IR de Zeed.
 * 
 * Ce type est extrait dynamiquement de la propriété `kind` de `{@link ZeedIRNode}`, 
 * garantissant que toute structure ajoutée à l'IR est immédiatement disponible 
 * pour le filtrage et le narrowing (réduction de type).
 * 
 * @remarks
 * Utilisé principalement au sein des itérateurs du moteur pour choisir 
 * la stratégie de génération appropriée.
 */
export type ZeedIRKind = ZeedIRNode['kind'];
