import Service from '#models/service'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Service.createMany([
      {
        name: 'Consulta Geral',
        duration: 30, // 30 minutos
        organizationId: 1,
      },
      {
        name: 'Exame Médico',
        duration: 60, // 1 hora
        organizationId: 1,
      },
      {
        name: 'Consulta Especializada',
        duration: 120, // 2 horas
        organizationId: 1,
      },
      {
        name: 'Atendimento Psicológico',
        duration: 60,
        organizationId: 2,
      },
      {
        name: 'Nutricionista',
        duration: 45,
        organizationId: 2,
      },
    ])
  }
}
