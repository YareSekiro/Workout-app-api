import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

// Table pivot
export default class TrainingExercise extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column({ columnName: 'training_id' })
    public trainingId: number

    @column({ columnName: 'exercise_id' })
    public exerciseId: number

    @column({ columnName: 'total_sets' })
    public totalSets: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime
}
