import { ZeedConstraints } from '@/types/ir/zeed-constraints';
import { ZeedIRKind } from '@/types/ir/zeed-ir-kind';
import { ZeedIRNode } from '@/types/ir/zeed-ir-node';
import { ZeedMeta } from '@/types/ir/zeed-meta';

/**
 * Contrat d'interface pour les adaptateurs de schémas de validation (Parsers).
 * 
 * Les implémentations de cette interface (ex: `ZodParser`, `ValibotParser`) 
 * sont chargées de traduire les définitions de schémas tiers vers le langage 
 * commun de Zeed : la Représentation Interne (IR).
 * 
 * @remarks
 * Un parser doit être capable de décomposer un schéma complexe de façon récursive 
 * tout en extrayant les métadonnées spécifiques à la génération.
 * 
 * @template TSchema - Le type du schéma source (ex: `z.ZodTypeAny`).
 */
export interface SchemaParser<TSchema = unknown> {
  /**
   * Orchestration complète de la transformation d'un schéma source en nœud IR.
   * 
   * C'est le point d'entrée critique du parser. Il construit l'arborescence 
   * complète en rattachant les contraintes et les métadonnées.
   *
   * @param schema - L'instance du schéma source à traduire.
   * @returns Un nœud `{@link ZeedIRNode}` normalisé et prêt pour le moteur.
   */
  parse(schema: TSchema): ZeedIRNode;

  /**
   * Extraction isolée des métadonnées de génération (`.meta()`).
   * 
   * Cherche au sein du schéma source les instructions utilisateur spécifiques 
   * (générateurs, ratios, liens).
   *
   * @param schema - Le schéma à inspecter.
   * @returns Un objet `{@link ZeedMeta}` décrivant le pilotage de la génération.
   */
  extractMeta(schema: TSchema): ZeedMeta;

  /**
   * Création d'une closure de validation auto-contenue.
   * 
   * Garantit que le moteur peut valider n'importe quelle donnée générée 
   * en invoquant une simple fonction booléenne.
   *
   * @param schema - Le schéma source servant de contrat de validation.
   * @returns Une fonction pure `(value) => boolean` sans effets de bord.
   */
  createValidator(schema: TSchema): (value: unknown) => boolean;

  /**
   * Identification du type de nœud IR correspondant au schéma.
   * 
   * Permet au moteur de classification d'aiguiller le parsing vers 
   * le bon type structurel (ex: `string`, `object`).
   *
   * @param schema - Le schéma à analyser.
   * @returns Le discriminateur `{@link ZeedIRKind}` identifié.
   */
  identifyKind(schema: TSchema): ZeedIRKind;

  /**
   * Extraction des règles de validation natives du schéma.
   * 
   * Traduit les contraintes de la librairie source (ex: `.min()`, `.email()`) 
   * vers le format standard de Zeed.
   *
   * @param schema - Le schéma source.
   * @returns L'objet `{@link ZeedConstraints}` structuré.
   */
  extractConstraints(schema: TSchema): ZeedConstraints;

  /**
   * Prédicat de support pour la sélection automatique du parser.
   * 
   * Utilisé par le moteur lors de l'initialisation pour attribuer chaque 
   * schéma au parser capable de le traiter le plus fidèlement.
   *
   * @param schema - Le schéma candidat.
   * @returns `true` si l'instance est reconnue nativement par l'adaptateur.
   */
  isSupported(schema: TSchema): boolean;

  /**
   * Nom technique lisible du type de schéma rencontré.
   * 
   * Indispensable pour la qualité des rapports d'erreurs et pour le débogage.
   * Exemple : `'ZodString'`, `'ValibotNullable'`.
   *
   * @param schema - Le schéma source.
   * @returns Le nom du type pour les messages de sortie (hints).
   */
  getTypeName(schema: TSchema): string;
}
