import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'training_exercices'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
        table.increments('id')
        // Chaque exercice est associé à un entraînement.
        table.integer('training_id')
            .unsigned()
            .references('trainings.id')
            .onDelete('CASCADE')

        table.integer('exercice_external_id')

        table.json('sets')
        table.json('reps')
        table.json('weights')
        table.json('rests')

        /**
         * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
         */
        table.timestamp('created_at', { useTz: true })
        table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
