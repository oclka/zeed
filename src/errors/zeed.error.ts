/**
 * Classe de base abstraite pour toutes les erreurs émises par le moteur Zeed.
 */
export abstract class ZeedError<TPayload = Record<string, unknown>> extends Error {
  /** Nom de l'erreur (ex: 'ZeedValidationError'). */
  public override readonly name: string;
  
  /** Horodatage de l'erreur. */
  public readonly timestamp = new Date();

  /**
   * @param message - Message d'erreur humain.
   * @param payload - Données techniques structurées.
   */
  constructor(
    message: string,
    public readonly payload: TPayload
  ) {
    super(message);
    
    // Définit le nom de l'erreur à partir du constructeur de la classe fille
    this.name = new.target.name;

    // Correction de l'héritage de prototype (standard pour les erreurs personnalisées)
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Sérialise l'erreur proprement pour les logs JSON.
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      payload: this.payload,
    };
  }
}
