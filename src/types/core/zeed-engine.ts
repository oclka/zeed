import { ZeedOptions } from './index';
import { ZeedGenerationResult } from './zeed-generation-result';

/**
 * Type utilitaire pour extraire le type de sortie d'un schéma source.
 * 
 * Compatible nativement avec les structures de Zod (`_output`), Valibot (`types["output"]`),
 * ArkType, et d'autres bibliothèques de schéma exposant une métadonnée d'inférence.
 * 
 * @remarks
 * Si le schéma n'expose aucune propriété reconnue, le type `unknown` est retourné en repli.
 * 
 * @template TSchema - Le schéma de validation à inspecter.
 */
export type InferOutput<TSchema> = TSchema extends { _output: infer O }
  ? O
  : TSchema extends { types: { output: infer O } }
    ? O
    : unknown;

/**
 * Interface contractuelle pour l'extension des fonctionnalités de Zeed.
 * 
 * Un plugin permet d'injecter des comportements transverses (seeding de base de données,
 * serveur HTTP éphémère, logs de debug) sans modifier le cœur du moteur de génération.
 * 
 * @remarks
 * Un plugin est une "pure definition" qui n'est activée que lors de l'appel à `{@link ZeedEngine.use}`.
 */
export interface ZeedPlugin {
  /** 
   * Identifiant unique du plugin utilisé pour la résolution des dépendances et pour éviter les doublons.
   * Format suggéré : `\@zeed/nom-du-plugin` ou `mon-entite:nom`.
   */
  name: string;

  /**
   * Méthode d'installation appelée par le moteur lors de la configuration de l'instance.
   * 
   * @param engine - L'instance active du moteur. Le plugin peut y injecter des adapters,
   * des formats de sortie personnalisés ou manipuler le cache de génération.
   * 
   * @example
   * ```typescript
   * const drizzlePlugin: ZeedPlugin = {
   *   name: 'drizzle-seeder',
   *   install: (engine) => {
   *     // Injection de capacités d'insertion ORM
   *     engine.orm = (db) => { ... };
   *   }
   * };
   * ```
   */
  install(engine: ZeedEngine): void;
}

/**
 * Interface principale orchestrant la génération, la validation et l'extension du moteur.
 * 
 * C'est le point d'entrée unique de la bibliothèque Zeed, garantissant le couplage
 * entre les schémas sources et la production de données déterministes.
 * 
 * @remarks
 * Pour l'initialisation, il est recommandé d'utiliser la factory globale du projet.
 */
export interface ZeedEngine {
  /**
   * Génère des données typées à partir d'un schéma unique.
   * 
   * Le type de retour est automatiquement inféré via `{@link InferOutput}` pour
   * garantir une expérience de développement (DX) type-safe.
   *
   * @param schema - Le schéma source (Zod, Valibot, etc.).
   * @param options - Options de génération pour cette session locale.
   * @returns Un objet `{@link ZeedGenerationResult}` contenant les données produites.
   */
  generate<TSchema>(schema: TSchema, options?: ZeedOptions): ZeedGenerationResult<InferOutput<TSchema>>;

  /**
   * Génère des données à partir de plusieurs schémas (multi-tables).
   * 
   * Résout automatiquement les dépendances inter-tables via un graphe dirigé acyclique (DAG)
   * et retourne les données indexées par le nom de chaque schéma.
   *
   * @param schemas - Tableau d'objets schémas sources.
   * @param options - Options de configuration globale de la session.
   * @returns Les données indexées par table dans un `{@link ZeedGenerationResult}`.
   */
  generate(schemas: unknown[], options?: ZeedOptions): ZeedGenerationResult<Record<string, unknown[]>>;

  /**
   * Effectue un test de contrat ("Contract Testing") par génération intensive.
   * 
   * Cette méthode effectue plusieurs itérations de génération aléatoire et valide chaque
   * sortie contre le schéma original pour s'assurer que les générateurs respectent les contraintes.
   *
   * @param schemas - Schéma(s) à tester par échantillonnage.
   * @param options - Configuration du test (nombre d'itérations, etc.).
   * @returns Une promesse résolvant vers un `{@link ZeedValidationReport}` global.
   */
  validate<TSchema = unknown>(
    schemas: TSchema | TSchema[],
    options?: { iterations?: number } & ZeedOptions,
  ): Promise<ZeedValidationReport>;

  /**
   * Génère des données de façon asynchrone pour les volumes importants.
   * 
   * Permet d'itérer sur un flux de données sans charger la totalité des objets en mémoire vive,
   * idéal pour l'insertion directe en base de données ou l'export de fichiers.
   *
   * @param schema - Le schéma de structure pour la génération.
   * @param options - Options de contrôle du flux.
   * @returns Un `AsyncGenerator` produisant séquentiellement les entités.
   */
  stream<TSchema>(schema: TSchema, options?: ZeedOptions): AsyncGenerator<InferOutput<TSchema>>;

  /**
   * Enregistre une extension ou un adaptateur tiers de façon typée.
   * 
   * Permet de faire évoluer le moteur (Drizzle, HTTP, Mocks exports) sans toucher à son noyau.
   * 
   * @param plugin - L'extension implémentant le contrat `{@link ZeedPlugin}`.
   * @returns L'instance active du moteur pour permettre le chaînage.
   */
  use(plugin: ZeedPlugin): this;
}

/**
 * Rapport détaillé suite à une opération de validation massive.
 */
export interface ZeedValidationReport {
  /** Indique si 100% des itérations ont passé la validation du schéma source. */
  success: boolean;
  /** Le nombre total de générations effectuées durant le test. */
  iterations: number;
  /** Durée de l'opération en millisecondes. */
  duration: number;
  /** Collection d'erreurs contextuelles capturées durant le test. */
  errors: {
    /** Identifiant ou nom du schéma ayant échoué. */
    schema: string;
    /** Numéro de l'itération ayant produit la donnée invalide. */
    iteration: number;
    /** L'erreur brute retournée par la bibliothèque de validation originale. */
    error: unknown;
    /** Chemin (`JSONPath`) du champ ayant causé l'échec de validation. */
    path?: string;
  }[];
}
