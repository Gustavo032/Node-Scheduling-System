import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'services'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID do serviço
      table.string('name').notNullable() // Nome do serviço
      table.integer('duration').notNullable() // Duração do serviço em minutos
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE') // Relacionamento com organização
      table.timestamps() // Campos created_at e updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
