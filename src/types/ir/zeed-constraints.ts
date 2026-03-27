/**
 * Catalogue exhaustif des contraintes de validation extraites des schémas sources.
 * 
 * Cette interface représente l'état normalisé des règles de validation (Zod, Valibot) 
 * au sein de la Représentation Interne (IR) de Zeed.
 * 
 * @remarks
 * Bien que délibérément ouverte aux extensions via `extras`, elle sert de socle 
 * à la boucle "Generate & Verify" pour piloter les itérations de génération.
 */
export interface ZeedConstraints {
  // --- Chaînes de caractères (String) ---
  /** Nombre minimal de caractères (inclusif). */
  minLength?: number;
  /** Nombre maximal de caractères (inclusif). */
  maxLength?: number;
  /** Impose une taille de chaîne strictement identique à cette valeur. */
  exactLength?: number;
  /** Expression régulière que la donnée générée doit obligatoirement satisfaire. */
  pattern?: RegExp;
  /** 
   * Formats sémantiques reconnus (ex: `email`, `url`, `uuid`).
   * 
   * @remarks
   * Utilise l'astuce TypeScript `(string & \{\})` pour autoriser des formats 
   * personnalisés tout en conservant l'autocomplétion sur les valeurs courantes.
   */
  format?: 'email' | 'url' | 'uuid' | 'cuid' | 'cuid2' | 'ulid' | 'ip' | 'datetime' | (string & {});
  /** Prefix imposé à toute chaîne générée pour ce champ. */
  startsWith?: string;
  /** Suffixe imposé à toute chaîne générée pour ce champ. */
  endsWith?: string;
  /** Sous-chaîne devant être obligatoirement présente au sein de la valeur. */
  includes?: string;

  // --- Nombres (Number) ---
  /** Valeur numérique minimale autorisée (incluse). */
  min?: number;
  /** Valeur numérique maximale autorisée (incluse). */
  max?: number;
  /** Contrainte "Greater Than" : la valeur doit être strictement supérieure à cette limite. */
  gt?: number;
  /** Contrainte "Less Than" : la valeur doit être strictement inférieure à cette limite. */
  lt?: number;
  /** Force le moteur à ne produire que des nombres entiers. */
  int?: boolean;
  /** Interdit les valeurs spéciales `Infinity` et `NaN`. */
  finite?: boolean;
  /** Contrainte de positivité mathématique (`\> 0`). */
  positive?: boolean;
  /** Contrainte de négativité mathématique (`\< 0`). */
  negative?: boolean;
  /** La valeur générée doit être un multiple exact (modulo `0`) de ce nombre. */
  multipleOf?: number;

  // --- Collections (Array, Set, Map) ---
  /** Cardinalité minimale de la collection (nombre d'éléments). */
  minItems?: number;
  /** Cardinalité maximale de la collection (nombre d'éléments). */
  maxItems?: number;
  /** Impose un nombre précis d'éléments au sein du conteneur. */
  exactItems?: number;
  /** Garantit l'absence de doublons parmi les éléments du tableau généré. */
  uniqueItems?: boolean;

  // --- Dates ---
  /** Borne temporelle minimale autorisée. */
  minDate?: Date;
  /** Borne temporelle maximale autorisée. */
  maxDate?: Date;

  /** 
   * Slot d'extension pour les contraintes spécifiques à un schéma (ex: `.refine()` de Zod).
   * 
   * @remarks
   * Utilisé pour stocker des métadonnées opaques non exploitables nativement 
   * par les générateurs mais critiques pour la phase finale de validation.
   */
  extras?: Record<string, unknown>;
}
