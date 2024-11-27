import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('token').nullable().unique() // Adiciona o campo 'token'
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('token') // Remove o campo 'token' no rollback
    })
  }
}
