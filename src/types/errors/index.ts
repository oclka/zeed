/**
 * Payload structuré pour les échecs de validation lors de la génération.
 * 
 * Ce modèle est utilisé lorsque le quota de `maxRetries` est épuisé en mode `strict`,
 * permettant d'identifier précisément quel champ du schéma est en conflit avec les contraintes.
 */
export interface ZeedValidationErrorPayload {
  /** Nom abrégé du champ ayant causé l'échec de validation. */
  field: string;
  /** Identifiant unique ou chemin complet du schéma parent (ex: `userSchema`). */
  schema: string;
  /** 
   * La toute dernière valeur aléatoire produite avant l'abandon. 
   * Permet d'analyser visuellement pourquoi la donnée a été rejetée par le validateur.
   */
  lastValue: unknown;
  /** Le nombre exact de tentatives infructueuses réalisées par le moteur. */
  attempts: number;
  /** 
   * L'objet d'erreur brut capturé depuis la bibliothèque de validation originale. 
   * Contient généralement les détails fins (ex: `ZodIssue[]`, `ValibotError`).
   */
  validationError: unknown;
  /** 
   * Aide contextuelle générée par Zeed pour guider l'utilisateur. 
   * Peut suggérer l'utilisation d'un `.meta({ generator })` spécifique.
   */
  hint?: string;
}

/**
 * Payload descriptif lié à l'épuisement d'un pool de valeurs uniques.
 * 
 * Se produit lorsqu'un champ marqué comme `unique` ne parvient plus à produire 
 * de nouvelles valeurs distinctes après un nombre important de tirages.
 */
export interface ZeedUniqueExhaustedErrorPayload {
  /** Nom du champ dont les valeurs uniques sont épuisées. */
  field: string;
  /** Schéma contenant la définition du champ fautif. */
  schema: string;
  /** 
   * Population actuelle de valeurs déjà stockées dans le set d'unicité. 
   * Donne une indication sur la taille réelle du domaine de données du générateur utilisé.
   */
  generatedCount: number;
  /** Nombre total de tentatives de tirages effectuées lors de la dernière itération. */
  attempts: number;
}

/**
 * Payload de diagnostic pour les erreurs de dépendances circulaires.
 * 
 * Indique que le graphe de génération (DAG) ne peut pas être résolu linéairement 
 * car des entités ou des champs se référencent mutuellement à l'infini.
 */
export interface ZeedCyclicDependencyErrorPayload {
  /** 
   * Séquence ordonnée représentant la boucle de dépendance. 
   * Exemple : `['users', 'orders', 'users']` signifie que l'utilisateur dépend de sa commande qui elle-même dépend de l'utilisateur.
   */
  cycle: string[];
}

/**
 * Payload détaillant l'absence de support pour un type de schéma spécifique.
 * 
 * Émis lorsqu'un `SchemaParser` rencontre un nœud de validation qu'il ne sait pas 
 * traduire en Représentation Interne (ZeedIR).
 */
export interface ZeedUnsupportedTypeErrorPayload {
  /** Nom technique du constructeur ou du type non reconnu (ex: `ZodLazy`, `VPipe`). */
  typeName: string;
  /** Localisation précise (JSONPath) du type ignoré dans l'arborescence du schéma. */
  path: string;
  /** 
   * Suggestion alternative pour contourner le manque de support. 
   * Souvent une recommandation de transformation en type primitif documenté.
   */
  suggestion?: string;
}

/**
 * Payload capturant un échec d'interaction avec la couche de persistance.
 * 
 * Utilisé par les plugins ORM pour encapsuler une erreur de base de données 
 * tout en conservant le contexte de l'entité Zeed qui a déclenché l'opération.
 */
export interface ZeedOrmErrorPayload {
  /** 
   * L'exception originale levée par le driver de base de données ou le client ORM. 
   * (Ex: Violation de contrainte de clé étrangère, Timeout).
   */
  originalError: unknown;
  /** Nom de la table physique visée par l'opération. */
  table: string;
  /** 
   * L'objet JSON complet représentant l'entité source de l'échec. 
   * Indispensable pour le débogage manuel des données générées.
   */
  entity: unknown;
}

/**
 * Payload pour les erreurs liées à la répartition pondérée (Ratios).
 * 
 * Signalé lors de la définition de générateurs complexes utilisant des ratios 
 * de probabilité dont la configuration est mathématiquement invalide.
 */
export interface ZeedRatioErrorPayload {
  /** Nom du champ sur lequel les ratios ont été appliqués. */
  field: string;
  /** 
   * Dictionnaire des ratios fournis par l'utilisateur. 
   * Clé: Identifiant de la variante, Valeur: Probabilité associée.
   */
  ratios: Record<string, number>;
  /** Raison technique précise (ex: Somme des probabilités négative, Ratio manquant). */
  reason: string;
}
