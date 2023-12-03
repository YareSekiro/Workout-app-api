import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
    protected tableName = 'exercises_details'

    public async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id')

            table
                .integer('training_exercise_id')
                .unsigned()
                .references('training_exercises.id')
                .onDelete('CASCADE')

            table.integer('set_number').unsigned().notNullable()

            table.integer('reps').unsigned().notNullable()

            table.float('weight').unsigned().notNullable()

            table.integer('rest_time').unsigned().notNullable()

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
