import { schema, CustomMessages } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExerciceValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string([ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string([
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
    private workoutSchema = schema.array().members(
        schema.object().members({
            workout_session: schema.number(),
            data: schema.array().members(schema.number()),
            created_at: schema.string(),
        })
    );
    public schema = schema.create({
        exerciceExternalId: schema.number(),
        sets: this.workoutSchema,
        reps: this.workoutSchema,
        weights: this.workoutSchema,
        rests: this.workoutSchema,
    })

  /**
   * Custom messages for validation failures. You can make use of dot notation `(.)`
   * for targeting nested fields and array expressions `(*)` for targeting all
   * children of an array. For example:
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages: CustomMessages = {
    'exerciceExternalId.required': 'L\'identifiant de l\'exercice est requis',
    'sets.required': 'Les sets sont requis',
    'sets.*.workout_session.required': 'La session de l\'exercice est requise',
    'sets.*.data.required': 'Les données de la session sont requises',
    'sets.*.created_at.required': 'La date de la session est requise',
    'reps.required': 'Les reps sont requis',
    'reps.*.workout_session.required': 'La session de l\'exercice est requise',
    'reps.*.data.required': 'Les données de la session sont requises',
    'reps.*.created_at.required': 'La date de la session est requise',
    'weights.required': 'Les poids sont requis',
    'weights.*.workout_session.required': 'La session de l\'exercice est requise',
    'weights.*.data.required': 'Les données de la session sont requises',
    'weights.*.created_at.required': 'La date de la session est requise',
    'rests.required': 'Les repos sont requis',
    'rests.*.workout_session.required': 'La session de l\'exercice est requise',
    'rests.*.data.required': 'Les données de la session sont requises',
    'rests.*.created_at.required': 'La date de la session est requise',
  }
}
