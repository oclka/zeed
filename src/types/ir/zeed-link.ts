/**
 * Contrat de liaison relationnelle entre entités (Foreign Key).
 * 
 * Permet au moteur de Zeed de lier dynamiquement un champ d'une entité A à un champ
 * d'une entité B pour garantir l'intégrité référentielle lors de la génération.
 */
export interface ZeedLink {
  /** 
   * Instance du schéma cible faisant l'objet de la référence. 
   * Cet objet est opaque et sera résolu par le moteur via sa table de symboles.
   */
  schema: unknown;

  /** 
   * Nom de la propriété cible dans le schéma référencé (ex: `id`, `uuid`). 
   */
  field: string;

  /** 
   * Facultatif. Exprime la sémantique de la relation. 
   * Aide le moteur à décider du nombre d'entités cibles à créer ou à réutiliser.
   */
  cardinality?: 'one-to-one' | 'one-to-many' | 'many-to-one' | 'many-to-many' | 'self';
}
