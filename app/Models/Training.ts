import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import { manyToMany } from '@adonisjs/lucid/build/src/Orm/Decorators'
import Exercise from './Exercise'

export default class Training extends BaseModel {
    @column({ isPrimary: true })
    public id: number
    // Chaque entraînement est associé à un utilisateur.
    @column({ columnName: 'user_id' })
    public userId: number

    @column()
    public name: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    // Un entraînement est cependant associé à UN utilisateur.
    @belongsTo(() => User)
    public user: BelongsTo<typeof User>

    @manyToMany(() => Exercise, {
        pivotTable: 'training_exercises',
        pivotForeignKey: 'training_id',
        pivotRelatedForeignKey: 'exercise_id',
    })
    public exercises: ManyToMany<typeof Exercise>
}
