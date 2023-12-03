import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import Training from './Training'

export default class Exercise extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column()
    public name: string

    @column()
    public description: string

    @column()
    public image: string

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @manyToMany(() => Training, {
        pivotTable: 'training_exercises',
        pivotForeignKey: 'exercise_id',
        pivotRelatedForeignKey: 'training_id',
    })
    public trainings: ManyToMany<typeof Training>
}
