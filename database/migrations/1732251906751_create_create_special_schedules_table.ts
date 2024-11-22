import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'special_schedules'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.date('date').notNullable() // Data específica
      table.time('start_time').nullable() // Hora de início
      table.time('end_time').nullable() // Hora de término
      table.boolean('is_blocked').defaultTo(false) // Indica se o dia está bloqueado
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE') // Relacionamento com organização
      table.timestamps()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
