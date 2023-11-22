import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'
import Training from './Training'

export default class User extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public email: string

    @column()
    public username: string

    @column({ serializeAs: null })
    public password: string

    @column()
    public rememberMeToken: string | null

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    // Un utilisateur peut avoir plusieurs entraînements,
    // et il faut donc définir la relation entre les deux modèles.
    @hasMany(() => Training)
    public trainings: HasMany<typeof Training>

    @beforeSave()
    public static async hashPassword (user: User) {
        if (user.$dirty.password) {
            user.password = await Hash.make(user.password)
        }
    }
}
