import Organization from '#models/organization'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await Organization.createMany([
      {
        id: 1,
        name: 'Organization 1',
        email: 'organization1@gmail.com',
        phone: '11971689500',
        workingHours: {
          monday: { start: '09:00', end: '17:00' },
          tuesday: { start: '09:00', end: '17:00' },
          wednesday: { start: '09:00', end: '17:00' },
          thursday: { start: '09:00', end: '17:00' },
          friday: { start: '09:00', end: '17:00' },
          saturday: { start: '10:00', end: '14:00' },
          sunday: null,
        },
      },
      {
        id: 2,
        name: 'Organization 2',
        email: 'organization2@gmail.com',
        phone: '11971689500',
        workingHours: {
          monday: { start: '08:00', end: '16:00' },
          tuesday: { start: '08:00', end: '16:00' },
          wednesday: { start: '08:00', end: '16:00' },
          thursday: { start: '08:00', end: '16:00' },
          friday: { start: '08:00', end: '16:00' },
          saturday: null,
          sunday: null,
        },
      },
    ])
  }
}
