import SpecialSchedule from '#models/special_schedule'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await SpecialSchedule.createMany([
      {
        date: '2024-12-25', // Natal
        startTime: null,
        endTime: null,
        isBlocked: true,
        organizationId: 1,
      },
      {
        date: '2024-12-31', // Véspera de Ano Novo
        startTime: '09:00',
        endTime: '12:00',
        isBlocked: false,
        organizationId: 1,
      },
    ])
  }
}
