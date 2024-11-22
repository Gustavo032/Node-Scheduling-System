import Appointment from '#models/appointment'
import Service from '#models/service'
import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import { DateTime } from 'luxon'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    // await Appointment.createMany([
    //   {
    //     id: 1,
    //     clientId: 1, // Cliente 1
    //     serviceId: 1, // Serviço 1 (ex.: 30 minutos)
    //     organizationId: 1, // Organização 1
    //     startTime: DateTime.fromISO('2024-11-25T10:00:00.000Z'), // Data/hora de início
    //     endTime: DateTime.fromISO('2024-11-25T10:30:00.000Z'), // Data/hora de término
    //     status: 'pending',
    //     message: undefined,
    //   },
    //   {
    //     id: 2,
    //     clientId: 2, // Cliente 2
    //     serviceId: 2, // Serviço 2 (ex.: 1 hora)
    //     organizationId: 1,
    //     startTime: DateTime.fromISO('2024-11-25T11:00:00.000Z'),
    //     endTime: DateTime.fromISO('2024-11-25T12:00:00.000Z'),
    //     status: 'confirmed',
    //     message: undefined,
    //   },
    //   {
    //     id: 3,
    //     clientId: 1,
    //     serviceId: 3, // Serviço 3 (ex.: 2 horas)
    //     organizationId: 1,
    //     startTime: DateTime.fromISO('2024-11-25T14:00:00.000Z'),
    //     endTime: DateTime.fromISO('2024-11-25T16:00:00.000Z'),
    //     status: 'canceled',
    //     message: 'Cliente solicitou o cancelamento.',
    //   },
    // ])

    const client = await User.query().where('role', 'client').first() // Recupera o primeiro cliente
    const service = await Service.first() // Recupera o primeiro serviço

    if (client && service) {
      await Appointment.create({
        clientId: client.id,
        serviceId: service.id,
        organizationId: service.organizationId, // Supondo que o serviço tenha o ID da organização
        startTime: DateTime.local().plus({ days: 1 }), // Cria uma instância DateTime
        endTime: DateTime.local().plus({ days: 1, hours: 1 }), // Cria uma instância DateTime
        status: 'pending', // O status do agendamento
        message: 'Agendamento de teste',
      })
    }
  }
}
