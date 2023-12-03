import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'training_exercises'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')
            // Chaque exercice est associé à un entraînement.
            table.integer('training_id').unsigned().references('trainings.id')

            table.integer('exercise_id').unsigned().references('exercises.id')

            table.integer('total_sets').unsigned().notNullable()

            /**
             * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
             */
            table.timestamp('created_at', { useTz: true })
            table.timestamp('updated_at', { useTz: true })
        })
    }

    public async down() {
        this.schema.dropTable(this.tableName)
    }
}
