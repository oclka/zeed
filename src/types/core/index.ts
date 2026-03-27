export * from './zeed-engine';
export * from './zeed-generation-result';

/**
 * Configuration globale d'une session de génération avec le moteur Zeed.
 * 
 * Cette interface définit les règles de comportement du moteur, notamment le déterminisme,
 * la localisation des données et les stratégies de repli en cas d'échec de validation.
 * 
 * @remarks
 * Les options définies ici agissent comme des valeurs par défaut globales qui peuvent 
 * être surchargées au niveau de chaque champ via {@link ZeedMeta}.
 * 
 * @example
 * ```typescript
 * const options: ZeedOptions = {
 *   seed: 'stable-release-1',
 *   locale: 'fr',
 *   mode: 'strict',
 *   maxRetries: 20
 * };
 * ```
 */
export interface ZeedOptions {
  /**
   * Valeur de départ (grain de sel) pour le générateur de nombres pseudo-aléatoires (pRNG).
   * Garantit que la même suite de données est produite à chaque exécution si le schéma reste identique.
   * 
   * @remarks
   * Zeed utilise cette valeur pour dériver des seeds uniques par champ (field-level seeding).
   */
  seed?: number | string;

  /**
   * Locale par défaut utilisée par les générateurs de données (ex: Faker).
   * Influence les formats de noms, adresses, téléphones, etc.
   * 
   * @defaultValue 'en'
   */
  locale?: string;

  /**
   * Nombre maximum de tentatives de génération pour un champ dont la valeur initiale échoue à la validation.
   * 
   * @remarks
   * Une valeur trop basse peut entraîner des erreurs prématurées sur des contraintes serrées.
   * Une valeur trop haute peut impacter les performances de la boucle "Generate & Verify".
   * 
   * @defaultValue 10
   */
  maxRetries?: number;

  /**
   * Stratégie à adopter lorsque le nombre maximum de retries est atteint pour un champ.
   * 
   * - `strict` : Interrompt la génération en levant une {@link ZeedValidationError}.
   * - `lenient` : Émet un avertissement et conserve la dernière valeur générée, même invalide.
   * 
   * @defaultValue 'strict'
   */
  mode?: 'strict' | 'lenient';

  /**
   * Callback optionnel permettant une intervention manuelle fine en cas d'échec définitif d'un champ.
   * 
   * @remarks
   * Si défini, ce handler a priorité sur le comportement du `mode` global.
   * Utile pour logger des métriques spécifiques ou injecter des valeurs de fallback métier.
   * 
   * @see RetryHandler
   */
  onRetryFailed?: RetryHandler;
}

/**
 * Types de décisions possibles retournées par un {@link RetryHandler}.
 */
export type RetryHandlerAction = 'throw' | 'skip' | 'use-last';

/**
 * Signature de la fonction de rappel invoquée lorsqu'un champ atteint son quota de retries.
 * 
 * @param payload - Contient les détails du champ en faute, la dernière valeur tentée et le nombre d'essais.
 * 
 * @remarks
 * Le paramètre `payload` utilise la structure `\{ field: string, lastValue: unknown, attempts: number \}`.
 * 
 * @returns Une action {@link RetryHandlerAction} dictant la suite des opérations au moteur.
 */
export type RetryHandler = (payload: {
  field: string;
  lastValue: unknown;
  attempts: number;
}) => RetryHandlerAction;

/**
 * En-tête technique accompagnant chaque résultat de génération.
 * Permet la traçabilité des conditions de production de la donnée (version, seed, date).
 */
export interface ZeedHeader {
  /** Version de la librairie Zeed utilisée pour la génération. */
  version: string;
  /** Seed ayant servi à initialiser la session (utile pour le replay). */
  seed: number | string;
  /** Locale active durant la session. */
  locale: string;
  /** Horodatage ISO du moment de la génération. */
  generatedAt: string;
  /** Liste des noms des schémas inclus dans le résultat. */
  schemas: string[];
}

/**
 * Conteneur standard retourné par toutes les méthodes de génération du moteur.
 * Encapsule les données produites et les métadonnées techniques via {@link ZeedHeader}.
 * 
 * @template T - Le type des données générées (inféré automatiquement depuis le schéma).
 * 
 * @example
 * ```typescript
 * const result: ZeedResult<User[]> = zeed.generate(userSchema);
 * console.log(`Généré avec le seed: ${result._zeed.seed}`);
 * ```
 */
export interface ZeedResult<T = unknown> {
  /** L'entité ou la collection d'entités conformes au(x) schéma(s) source(s). */
  data: T;

  /** Métadonnées techniques garantissant la traçabilité et la reproductibilité. */
  _zeed: ZeedHeader;
}
