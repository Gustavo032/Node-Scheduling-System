import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'organizations'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID da organização
      table.string('name').notNullable() // Nome da organização
      table.string('email').notNullable().unique() // E-mail da organização
      table.string('phone').nullable() // Telefone da organização
      table.timestamps() // Campos created_at e updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
