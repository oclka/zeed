/**
 * Contexte de génération partagé injecté dans les fonctions de rappel (callbacks).
 * 
 * Cet objet est mis à disposition uniquement lorsque le générateur utilisateur est 
 * défini comme une fonction avec paramètre, permettant une génération contextuelle.
 */
export interface GeneratorContext {
  /** 
   * Dictionnaire des valeurs déjà générées pour l'entité en cours. 
   * 
   * @remarks
   * Les champs disponibles dans cet objet sont déterminés par l'ordre topologique 
   * du graphe de dépendance (DAG) du schéma.
   */
  context: Record<string, unknown>;

  /** 
   * Indexation ordonnée de l'entité actuelle au sein d'une collection. 
   * 
   * @remarks
   * Indice à base zéro (0-based). Utile pour générer des séquences incrémentales 
   * ou des valeurs basées sur le rang (ex: `user_1`, `user_2`).
   */
  index: number;
}

/**
 * Signature contractuelle pour les fonctions de génération personnalisées.
 * 
 * Permet d'injecter une logique métier ou une bibliothèque externe (Faker, Chance) 
 * au sein du processus de production de données de Zeed.
 * 
 * @example
 * ```typescript
 * const myGenerator: GeneratorCallback<string> = ({ context, index }) => {
 *   return `Slug: ${context.title}-${index}`;
 * };
 * ```
 * 
 * @template T - Le type primitif ou l'objet attendu par le champ du schéma.
 * 
 * @remarks
 * Indispensable pour outrepasser les comportements par défaut lorsque des 
 * relations complexes entre champs ne peuvent être exprimées par de simples contraintes.
 */
export type GeneratorCallback<T = unknown> =
  | (() => T)
  | ((generatorContext: GeneratorContext) => T);
