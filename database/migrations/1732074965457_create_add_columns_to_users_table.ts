import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.table(this.tableName, (table) => {
      // Adicionando a coluna 'role' para definir o tipo de usuário (cliente, funcionário, administrador)
      table.enum('role', ['client', 'employee', 'manager', 'admin']).defaultTo('client')

      // Adicionando a coluna 'organization_id' para associar o usuário à sua organização
      table.integer('organization_id').unsigned().nullable()
      table.foreign('organization_id').references('id').inTable('organizations').onDelete('CASCADE')

      // Adicionando outras colunas conforme necessidade
      table.boolean('is_active').defaultTo(true) // Para saber se o usuário está ativo ou não
      table.timestamp('last_login').nullable() // Para armazenar o último login do usuário
    })
  }

  async down() {
    this.schema.table(this.tableName, (table) => {
      // Removendo as colunas adicionadas
      table.dropColumn('role')
      table.dropColumn('organization_id')
      table.dropColumn('is_active')
      table.dropColumn('last_login')
    })
  }
}
