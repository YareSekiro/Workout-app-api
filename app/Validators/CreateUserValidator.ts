import { schema, CustomMessages, rules } from '@ioc:Adonis/Core/Validator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class CreateUserValidator {
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
  public schema = schema.create({
    email: schema.string({}, [
        rules.trim(),
        rules.maxLength(255),
        rules.email(),
        rules.unique({ table: 'users', column: 'email' }),
    ]),
    username: schema.string({}, [
        rules.trim(),
        rules.minLength(4),
        rules.maxLength(25),
        rules.unique({ table: 'users', column: 'username' }),
    ]),
    password: schema.string({}, [
        rules.minLength(8),
        rules.maxLength(180),
        rules.confirmed(),
    ]),
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
    'email.required': 'L\'adresse email est requise',
    'email.email': 'L\'adresse email doit être valide',
    'email.unique': 'Cette adresse email est déjà utilisée',
    'email.maxLength': 'L\'adresse email doit contenir au plus 255 caractères',
    'username.required': 'Le nom d\'utilisateur est requis',
    'username.unique': 'Ce nom d\'utilisateur est déjà utilisé',
    'username.minLength': 'Le nom d\'utilisateur doit contenir au moins 4 caractères',
    'username.maxLength': 'Le nom d\'utilisateur doit contenir au plus 25 caractères',
    'password.required': 'Le mot de passe est requis',
    'password.minLength': 'Le mot de passe doit contenir au moins 8 caractères',
    'password.maxLength': 'Le mot de passe doit contenir au plus 180 caractères',
    'password_confirmation.confirmed': 'Les mots de passe ne correspondent pas',

  }
}
