// app/Middleware/CheckAppointmentAccess.ts
import Appointment from '#models/appointment'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CheckAppointmentAccess {
  public async handle({ params, auth, response }: HttpContextContract, next: () => Promise<void>) {
    const user = auth.user
    const appointment = await Appointment.findOrFail(params.id)

    // Permitir se o usuário for admin, manager ou dono do agendamento
    if (user?.role === 'admin' || user.role === 'manager' || appointment.clientId === user.id) {
      await next()
    } else {
      return response.unauthorized('Acesso negado ao agendamento.')
    }
  }
}
