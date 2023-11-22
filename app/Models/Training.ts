import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, HasMany, belongsTo, column, hasMany } from '@ioc:Adonis/Lucid/Orm'
import TrainingExercice from './TrainingExercice'
import User from './User'

export default class Training extends BaseModel {
    @column({ isPrimary: true })
    public id: number
    // Chaque entraînement est associé à un utilisateur.
    @column({ columnName: 'user_id'})
    public userId: number

    @column()
    public name: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    // Un entraînement peut avoir plusieurs exercices,
    // et il faut donc définir la relation entre les deux modèles.
    @hasMany(() => TrainingExercice)
    public trainingExercices: HasMany<typeof TrainingExercice>

    // Un entraînement est cependant associé à UN utilisateur.
    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

}
