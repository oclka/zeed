import { GeneratorCallback } from '../generators';
import { ZeedLink } from './zeed-link';

/**
 * Registre des métadonnées de pilotage de la génération.
 * 
 * Cette interface centralise les instructions de configuration passées via 
 * l'extension `.meta()` des schémas de validation. Elle permet de surcharger 
 * les comportements par défaut du moteur pour affiner la qualité des données.
 * 
 * @remarks
 * Contrairement aux `ZeedConstraints`, les métadonnées de `ZeedMeta` sont 
 * exclusivement définies par l'utilisateur et priment sur les contraintes extraites.
 */
export interface ZeedMeta {
  /**
   * Injection d'un générateur métier personnalisé.
   * 
   * Permet de déléguer la production de la valeur à un callback tierce 
   * (ex: Faker, fonction de calcul dynamique).
   */
  generator?: GeneratorCallback;

  /**
   * Distribution statistique pondérée pour les champs à valeurs finies.
   * 
   * @remarks
   * Les clés correspondent aux valeurs attendues et les valeurs aux probabilités 
   * de tirage (entre `0` et `1`). Si la somme n'est pas égale à `1`, le moteur 
   * normalise automatiquement les poids.
   */
  ratio?: Record<string, number>;

  /**
   * Taux de vacuité pour les types facultatifs (`optional`, `nullable`).
   * 
   * @remarks
   * Définit la probabilité (entre `0` et `1`) de retourner `null` ou `undefined`.
   * @defaultValue `0.1` (soit 10% de chances d'être vide).
   */
  empty?: number;

  /**
   * Déclaration explicite de dépendance au sein d'une même entité (Intra-object DAG).
   * 
   * Garantit que le champ désigné est résolu avant le champ actuel, permettant 
   * d'utiliser sa valeur dans un `generator` contextuel.
   */
  depends?: string | string[];

  /**
   * Définition d'un lien de parenté inter-tables (Clé étrangère).
   * 
   * @remarks
   * Ordonne au moteur de piocher une identité existante dans une collection 
   * parente via l'objet `{@link ZeedLink}`.
   */
  link?: ZeedLink;

  /**
   * Verrou d'unicité sur le domaine de génération du champ.
   * 
   * @remarks
   * Si `true`, le moteur maintient un set de valeurs déjà produites pour éviter 
   * les collisions. Lève une erreur si aucune valeur unique n'est trouvée 
   * après épuisement des tentatives.
   */
  unique?: boolean;

  /**
   * Surpassement des bornes de génération par l'utilisateur.
   * 
   * Supporte les valeurs absolues (nombres, dates) ou des alias temporels 
   * relatifs (ex: `'-2 YEARS'`, `'now'`, `'+6 MONTHS'`).
   */
  range?: {
    /** Borne inférieure inclusive. */
    min?: number | string | Date;
    /** Borne supérieure inclusive. */
    max?: number | string | Date;
  };

  /** 
   * Nombre maximum de tentatives de régénération en cas d'échec de validation. 
   * Surcharge la configuration globale de `{@link ZeedOptions}`.
   */
  maxRetries?: number;

  /** 
   * Identifiant de localisation Faker spécifique à ce champ (ex: `'fr'`, `'en_US'`). 
   */
  locale?: string;

  /** 
   * Limite de récursion pour les structures de données auto-référencées (`lazy`). 
   * Empêche les dépassements de pile (Stack Overflow).
   */
  maxDepth?: number;

  /** 
   * Configuration de la volumétrie de production pour une entité racine. 
   * 
   * @remarks
   * Permet de définir une cible fixe ou une plage aléatoire, potentiellement 
   * corrélée au nombre d'une table parente (`per: 'table'`).
   */
  count?: { min: number; max: number; per?: string };

  /** 
   * Adaptateur ORM cible utilisé pour mapper les données générées sur une table réelle. 
   */
  orm?: string;

  /** 
   * Référence typée vers l'objet de table ORM (Drizzle model, Prisma delegate). 
   */
  table?: unknown;
}
