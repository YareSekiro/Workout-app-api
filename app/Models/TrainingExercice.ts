import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { trainingData } from '@contracts/customInterfaces'
import Training from './Training'

export default class TrainingExercice extends BaseModel {
    @column({ isPrimary: true })
    public id: number

    @column({ columnName: 'training_id'})
    public trainingId: number

    @column()
    public exerciceExternalId: number

    @column({
        prepare: (value: trainingData[]) => JSON.stringify(value),
        consume: (value: string) => JSON.parse(value)
    })
    public sets: trainingData[]

    @column({
        prepare: (value: trainingData[]) => JSON.stringify(value),
        consume: (value: string) => JSON.parse(value)
    })
    public reps: trainingData[]

    @column({
        prepare: (value: trainingData[]) => JSON.stringify(value),
        consume: (value: string) => JSON.parse(value)
    })
    public weights: trainingData[]

    @column({
        prepare: (value: trainingData[]) => JSON.stringify(value),
        consume: (value: string) => JSON.parse(value)
    })
    public rests: trainingData[]
    
    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime

    // Un exercice est associé à UN entraînement.
    // On pourrais en théorie penser que par exemple entre deux
    // entraînements, on pourrait avoir le même exercice, mais
    // les données étant différentes d'un entraînements à l'autre
    // il faut bien les différencier et ainsi rendre l'exercice unique
    // à un entraînement.
    @belongsTo(() => Training)
    public training: BelongsTo<typeof Training>



}
