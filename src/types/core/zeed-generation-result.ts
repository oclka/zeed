import { ZeedHeader } from './index';

/**
 * Configuration de l'exportation physique des données générées dans un fichier.
 * 
 * Permet de définir le format de sérialisation et la destination des entités produites
 * par le moteur Zeed.
 */
export interface ZeedOutputOptions {
  /** 
   * Format de sérialisation des données. 
   * Supporte les formats d'échange standards : `json`, `yaml`, `xml`, et `csv`.
   */
  format: 'json' | 'yaml' | 'xml' | 'csv';
  
  /** 
   * Chemin absolu ou relatif vers le fichier de sortie. 
   * Les répertoires parents seront créés automatiquement si nécessaire.
   */
  file: string;

  /** 
   * Si `true`, applique une indentation lisible au fichier de sortie.
   * @defaultValue `true`
   */
  pretty?: boolean;
}

/**
 * Options de configuration du serveur de mock HTTP éphémère.
 * 
 * Utilisé pour simuler une API REST complète basée sur les données générées, 
 * incluant des capacités de latence et d'erreurs aléatoires pour les tests de résilience.
 */
export interface ZeedHttpOptions {
  /** 
   * Port d'écoute du serveur. 
   * Utiliser `0` pour laisser le système d'exploitation attribuer un port libre aléatoire.
   */
  port: number;

  /** 
   * Simulation de conditions réseau dégradées.
   * Définit une plage de délai en millisecondes ajoutée à chaque réponse.
   */
  latency?: { min: number; max: number };

  /** 
   * Pourcentage de requêtes échouant avec un code HTTP 500 (entre `0` et `1`).
   * Utile pour tester la gestion d'erreurs côté client (ex: `0.1` pour 10% d'erreurs).
   */
  errorRate?: number;

  /** 
   * Active le support Cross-Origin Resource Sharing (CORS).
   * @defaultValue `true`
   */
  cors?: boolean;

  /** 
   * Si `true`, le serveur redémarre ou rafraîchit ses données si les schémas sources sont modifiés.
   * @defaultValue `false`
   */
  watch?: boolean;

  /** 
   * Catalogue de routes personnalisées permettant d'outrepasser le comportement CRUD par défaut.
   * 
   * @remarks
   * Le callback de chaque route reçoit le `context` complet des données générées 
   * et les `params` de l'URL capturés par le routeur.
   */
  routes?: Record<string, (context: { data: Record<string, unknown[]>; params: Record<string, string> }) => unknown>;
}

/**
 * Instance de contrôle d'un serveur de mock actif.
 * 
 * Retourné par la méthode `{@link ZeedGenerationResult.http}` pour permettre 
 * la gestion du cycle de vie du serveur (monitoring, arrêt propre).
 */
export interface ZeedHttpServer {
  /** URL de base complète pour accéder au serveur (ex: `http://localhost:3000`). */
  url: string;
  /** Liste exhaustive des points d'entrée (endpoints) exposés par le serveur. */
  routes: string[];
  /** 
   * Libère le port et arrête toutes les connexions actives.
   * @returns Une promesse résolue une fois le serveur totalement arrêté.
   */
  close(): Promise<void>;
}

/**
 * Configuration de l'injection des données via un adaptateur ORM tiers.
 * 
 * Cette interface définit comment les entités générées doivent être persistées
 * dans une base de données réelle en s'appuyant sur un client (Drizzle, Prisma, etc.).
 */
export interface ZeedOrmOptions {
  /** 
   * Instance active de la base de données ou du client ORM. 
   * Doit être compatible avec le plugin ORM utilisé (ex: `PostgresJsDatabase` pour Drizzle).
   */
  db: unknown;

  /** 
   * Méthode d'insertion utilisée pour la persistance. 
   * - `transaction` : Tout-ou-rien (recommandé pour la cohérence).
   * - `batch` : Insertions groupées par lots.
   * - `sequential` : Une requête par ligne (plus lent).
   */
  strategy?: 'transaction' | 'batch' | 'sequential';

  /** 
   * Taille des collections lors d'insertions groupées (`batch`). 
   * @defaultValue `500`
   */
  batchSize?: number;

  /** 
   * Comportement adopté lorsque des contraintes d'unicité (PK/Unique) sont violées.
   * @defaultValue `'throw'`
   */
  onConflict?: 'skip' | 'throw' | 'update';

  /** 
   * Si `true`, réinitialise les tables cibles avant l'insertion.
   * 
   * @remarks
   * Le nettoyage respecte l'ordre inverse des clés étrangères pour éviter les violations de contraintes.
   * @defaultValue `false`
   */
  clean?: boolean;
}

/**
 * Interface fluide encapsulant les données générées et offrant des outils de livraison.
 * 
 * Un objet implémentant `ZeedGenerationResult` est systématiquement retourné par 
 * `{@link ZeedEngine.generate}`. Il sépare la phase de production de la donnée 
 * (pure, déterministe) de sa phase de livraison (I/O, réseau, persistance).
 * 
 * @template T - Type de la structure générée (inféré automatiquement).
 * 
 * @example
 * ```typescript
 * const users = await engine.generate(userSchema);
 * 
 * // Livraison multiple via l'API fluide
 * await users.output({ format: 'json', file: './seed.json' });
 * await users.orm({ db, strategy: 'transaction', clean: true });
 * ```
 */
export interface ZeedGenerationResult<T = unknown> {
  /** Les entités produites prêtes à être consommées. */
  data: T;

  /** En-tête technique contenant les métadonnées de traçabilité. */
  _zeed: ZeedHeader;

  /** 
   * Sérialise et écrit les données sur le système de fichiers.
   * 
   * @param options - Configuration du format et de la destination.
   * @returns Promesse résolue après écriture complète sur le disque.
   */
  output(options: ZeedOutputOptions): Promise<void>;

  /** 
   * Initialise et démarre un serveur web éphémère pour mocker une API.
   * 
   * @param options - Paramètres réseau et simulation de pannes.
   * @returns Une instance de `{@link ZeedHttpServer}` pour le contrôle à distance.
   */
  http(options: ZeedHttpOptions): Promise<ZeedHttpServer>;

  /** 
   * Persiste les entités générées dans une base de données via un adaptateur ORM.
   * 
   * @param options - Configuration de la connexion et de la stratégie d'insertion.
   * @returns Promesse résolue une fois les données commitées.
   */
  orm(options: ZeedOrmOptions): Promise<void>;
}
