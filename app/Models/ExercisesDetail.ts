import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import TrainingExercise from './TrainingExercise'

/* TODO: C'est un peu le bordel niveau table relation endpoints tout ça, il faut que je fasse un point important là dessus. */

export default class ExercisesDetail extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column({ columnName: 'training_exercise_id' })
    public trainingExerciseId: number

    @column({ columnName: 'set_number' })
    public setNumber: number

    @column()
    public reps: number

    @column()
    public weight: number

    @column({ columnName: 'rest_time' })
    public restTime: number

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    @belongsTo(() => TrainingExercise)
    public trainingExercise: BelongsTo<typeof TrainingExercise>
}
