import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'appointments'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id') // ID do agendamento
      table.integer('client_id').unsigned().references('id').inTable('users').onDelete('CASCADE') // Cliente
      table
        .integer('service_id')
        .unsigned()
        .references('id')
        .inTable('services')
        .onDelete('CASCADE') // Serviço
      table
        .integer('organization_id')
        .unsigned()
        .references('id')
        .inTable('organizations')
        .onDelete('CASCADE') // Organização
      table.timestamp('start_time').notNullable() // Data e hora de início
      table.timestamp('end_time').notNullable() // Data e hora de término
      table.enum('status', ['pending', 'confirmed', 'canceled']).defaultTo('pending') // Status
      table.text('message').nullable() // Mensagem de cancelamento/rejeição
      table.timestamps() // Campos created_at e updated_at
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
