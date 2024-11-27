// app/Controllers/Http/AppointmentsController.ts
import Appointment from '#models/appointment'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AppointmentsController {
  // Listar agendamentos
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!

    // Administradores e gestores podem visualizar todos os agendamentos da organização
    if (user.role === 'admin' || user.role === 'manager') {
      return Appointment.query().where('organizationId', user.organizationId)
    }

    // Clientes só podem visualizar seus próprios agendamentos
    return Appointment.query().where('clientId', user.id)
  }

  // Mostrar um agendamento específico (apenas se o middleware permitir)
  public async show({ params }: HttpContextContract) {
    return Appointment.findOrFail(params.id)
  }

  // Criar um novo agendamento
  public async store({ request, auth, response }: HttpContextContract) {
    const user = auth.user!

    // Apenas clientes podem criar agendamentos
    if (user.role !== 'client') {
      return response.unauthorized('Somente clientes podem criar agendamentos.')
    }

    const data = request.only(['startTime', 'endTime', 'serviceId'])
    const appointment = await Appointment.create({
      ...data,
      clientId: user.id,
      organizationId: user.organizationId,
    })

    return response.created(appointment)
  }

  // Atualizar agendamento (Clientes só podem alterar seus próprios agendamentos)
  public async update({ params, request, auth, response }: HttpContextContract) {
    const user = auth.user!
    const appointment = await Appointment.findOrFail(params.id)

    if (appointment.clientId !== user.id && user.role !== 'admin' && user.role !== 'manager') {
      return response.unauthorized('Você não tem permissão para atualizar este agendamento.')
    }

    const data = request.only(['startTime', 'endTime', 'status'])
    appointment.merge(data)
    await appointment.save()

    return appointment
  }

  // Cancelar agendamento
  public async cancel({ params, request, auth, response }: HttpContextContract) {
    const user = auth.user!
    const appointment = await Appointment.findOrFail(params.id)

    // Apenas clientes ou admins podem cancelar
    if (appointment.clientId !== user.id && user.role !== 'admin' && user.role !== 'manager') {
      return response.unauthorized('Você não tem permissão para cancelar este agendamento.')
    }

    const { message } = request.only(['message'])
    if (!message) {
      return response.badRequest('Uma mensagem explicativa é necessária para o cancelamento.')
    }

    appointment.status = 'canceled'
    appointment.message = message
    await appointment.save()

    return appointment
  }
}
