import { ZeedConstraints } from './zeed-constraints';
import { ZeedMeta } from './zeed-meta';

/**
 * Propriétés fondamentales partagées par l'ensemble des nœuds de la Représentation Interne (IR).
 * 
 * L'IR est le socle de Zeed : elle normalise les types transverses (Zod, Valibot) 
 * vers une structure consommable dynamiquement par le moteur.
 */
interface ZeedIRNodeBase {
  /** 
   * Collection complète des contraintes métier (min, max, format) extraites du schéma source. 
   */
  constraints: ZeedConstraints;

  /** 
   * Métadonnées de pilotage de la génération injectées via les extensions natives de Zeed. 
   */
  meta: ZeedMeta;

  /**
   * Enveloppe de validation garantissant la conformité de la donnée générée.
   * 
   * @remarks
   * Cette closure permet au moteur de vérifier la validité d'une itération aléatoire
   * sans connaissance directe de la librairie de schéma utilisée (Zod, etc.).
   * 
   * @param value - La donnée brute à valider.
   * @returns `true` si la donnée satisfait intégralement le contrat original.
   */
  validate: (value: unknown) => boolean;

  /**
   * Référence vers l'instance de schéma originale ayant servi à la construction du nœud.
   * 
   * @remarks
   * Champ informatif utilisé par les `SchemaParsers` pour la résolution des dépendances 
   * cycliques ou pour enrichir les messages d'erreur.
   */
  _originalSchema?: unknown;
}

// --- Nœuds Primitifs (Feuilles) ---

/** Représentation IR d'une chaîne de caractères (`string`). */
export interface ZeedIRStringNode extends ZeedIRNodeBase {
  kind: 'string';
}

/** Représentation IR d'un type numérique (`number`). */
export interface ZeedIRNumberNode extends ZeedIRNodeBase {
  kind: 'number';
}

/** Représentation IR d'un type booléen (`boolean`). */
export interface ZeedIRBooleanNode extends ZeedIRNodeBase {
  kind: 'boolean';
}

/** Représentation IR d'un objet `Date`. */
export interface ZeedIRDateNode extends ZeedIRNodeBase {
  kind: 'date';
}

/** Représentation IR d'un type non identifié ou dynamique (`unknown`). */
export interface ZeedIRUnknownNode extends ZeedIRNodeBase {
  kind: 'unknown';
}

// --- Énumérations et Littéraux ---

/** Représentation IR d'une énumération de valeurs primitives. */
export interface ZeedIREnumNode extends ZeedIRNodeBase {
  kind: 'enum';
  /** Catalogue des valeurs admissibles pour la génération aléatoire. */
  enumValues: readonly (string | number)[];
}

/** Représentation IR d'une énumération native TypeScript (`enum`). */
export interface ZeedIRNativeEnumNode extends ZeedIRNodeBase {
  kind: 'nativeEnum';
  /** Valeurs numériques ou textuelles de l'énumération native cible. */
  enumValues: readonly (string | number)[];
}

/** Représentation IR d'une valeur immuable et unique. */
export interface ZeedIRLiteralNode extends ZeedIRNodeBase {
  kind: 'literal';
  /** La valeur exacte imposée par le schéma. */
  literalValue: unknown;
}

// --- Nœuds Composites ---

/** 
 * Nœud structurel représentant une entité complexe avec des champs identifiés.
 * 
 * Sa génération est pilotée par un graphe de dépendance inter-champs (Intra-object DAG).
 */
export interface ZeedIRObjectNode extends ZeedIRNodeBase {
  kind: 'object';
  /** Arborescence des propriétés de l'objet, indexées par leur clé textuelle. */
  children: Record<string, ZeedIRNode>;
}

/** Représentation d'une collection ordonnée d'un type homogène. */
export interface ZeedIRArrayNode extends ZeedIRNodeBase {
  kind: 'array';
  /** Définition IR récursive s'appliquant à chaque élément de la liste. */
  element: ZeedIRNode;
}

/** Représentation d'une collection ordonnée de types hétérogènes et fixes. */
export interface ZeedIRTupleNode extends ZeedIRNodeBase {
  kind: 'tuple';
  /** Séquence ordonnée des nœuds IR composant le tuple. */
  elements: ZeedIRNode[];
}

/** Représentation d'un dictionnaire dynamique avec clés et valeurs typées. */
export interface ZeedIRRecordNode extends ZeedIRNodeBase {
  kind: 'record';
  /** Nœud IR dictant la structure des clés (généralement `string`). */
  keyType: ZeedIRNode;
  /** Nœud IR dictant la structure des valeurs associées aux clés. */
  valueType: ZeedIRNode;
}

/** Équivalent IR pour l'objet standard `Map`. */
export interface ZeedIRMapNode extends ZeedIRNodeBase {
  kind: 'map';
  /** Définition du nœud pour les clés de la Map. */
  keyType: ZeedIRNode;
  /** Définition du nœud pour les valeurs de la Map. */
  valueType: ZeedIRNode;
}

/** Équivalent IR pour l'objet standard `Set`. */
export interface ZeedIRSetNode extends ZeedIRNodeBase {
  kind: 'set';
  /** Définition du nœud garantissant l'unicité de chaque valeur produite. */
  element: ZeedIRNode;
}

// --- Nœuds Décorateurs (Wrappers) ---

/** Wrapper indiquant que le champ sous-jacent peut être absent (`undefined`). */
export interface ZeedIROptionalNode extends ZeedIRNodeBase {
  kind: 'optional';
  /** Le type cible pouvant être optionnel. */
  inner: ZeedIRNode;
}

/** Wrapper indiquant que le champ sous-jacent peut porter la valeur `null`. */
export interface ZeedIRNullableNode extends ZeedIRNodeBase {
  kind: 'nullable';
  /** Le type cible pouvant être `null`. */
  inner: ZeedIRNode;
}

/** 
 * Wrapper fournissant une valeur de repli immuable en cas d'absence de donnée. 
 * Utilisé principalement pour stabiliser les environnements de mock.
 */
export interface ZeedIRDefaultNode extends ZeedIRNodeBase {
  kind: 'default';
  /** Le type cible pour lequel le défaut est défini. */
  inner: ZeedIRNode;
  /** La valeur utilisée par défaut si aucune génération n'est effectuée. */
  defaultValue: unknown;
}

// --- Union et Intersection ---

/** 
 * Modèle de données à variantes multiples (Sum type).
 * Le moteur itère sur les membres jusqu'à obtenir une génération valide.
 */
export interface ZeedIRUnionNode extends ZeedIRNodeBase {
  kind: 'union';
  /** Liste exhaustive des branches possibles de l'union. */
  members: ZeedIRNode[];
}

/** 
 * Union optimisée utilisant un champ discriminant pour la résolution de type. 
 */
export interface ZeedIRDiscriminatedUnionNode extends ZeedIRNodeBase {
  kind: 'discriminatedUnion';
  /** Catalogue des branches de l'union. */
  members: ZeedIRNode[];
  /** Nom de la propriété pivot servant à discriminer les objets de l'union. */
  discriminant: string;
}

/** Construction représentant la fusion structurelle de deux définitions. */
export interface ZeedIRIntersectionNode extends ZeedIRNodeBase {
  kind: 'intersection';
  /** Branche gauche de la fusion. */
  left: ZeedIRNode;
  /** Branche droite de la fusion. */
  right: ZeedIRNode;
}

// --- Cas Spécifiques ---

/** 
 * Nœud différé permettant la manipulation de schémas récursifs.
 * 
 * @remarks
 * Indispensable pour éviter les stack overflow lors du parsing initial d'arbres complexes.
 */
export interface ZeedIRLazyNode extends ZeedIRNodeBase {
  kind: 'lazy';
  /** Callback invoqué dynamiquement par le moteur pour résoudre le nœud réel. */
  resolve: () => ZeedIRNode;
}

/** 
 * Représentation d'une chaîne de transformation (ex: `.pipe()` ou `.transform()`).
 */
export interface ZeedIRPipeNode extends ZeedIRNodeBase {
  kind: 'pipe';
  /** Entrée utilisée comme socle de génération. */
  input: ZeedIRNode;
  /** Sortie désirée utilisée comme contrat final de validation post-transform. */
  output: ZeedIRNode;
}

/** 
 * Nœud marquant une identité nominale ("Opaque type"). 
 * Traité comme son type sous-jacent pour la génération pure.
 */
export interface ZeedIRBrandedNode extends ZeedIRNodeBase {
  kind: 'branded';
  /** Le type réel encapsulé par le brand. */
  inner: ZeedIRNode;
}

/**
 * Union discriminée exhaustive englobant l'intégralité du langage de description IR de Zeed.
 * 
 * Le champ `kind` permet au moteur d'appliquer le pattern "Visitor" de façon type-safe 
 * lors de la traversée de l'arbre.
 */
export type ZeedIRNode =
  | ZeedIRStringNode
  | ZeedIRNumberNode
  | ZeedIRBooleanNode
  | ZeedIRDateNode
  | ZeedIRUnknownNode
  | ZeedIREnumNode
  | ZeedIRNativeEnumNode
  | ZeedIRLiteralNode
  | ZeedIRObjectNode
  | ZeedIRArrayNode
  | ZeedIRTupleNode
  | ZeedIRRecordNode
  | ZeedIRMapNode
  | ZeedIRSetNode
  | ZeedIROptionalNode
  | ZeedIRNullableNode
  | ZeedIRDefaultNode
  | ZeedIRUnionNode
  | ZeedIRDiscriminatedUnionNode
  | ZeedIRIntersectionNode
  | ZeedIRLazyNode
  | ZeedIRPipeNode
  | ZeedIRBrandedNode;
