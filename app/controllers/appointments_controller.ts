// app/Controllers/Http/AppointmentsController.ts
import Appointment from '#models/appointment'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { DateTime } from 'luxon'

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
    const user = auth.user

    // Verificar se o usuário está autenticado
    if (!user) {
      return response.unauthorized('Usuário não autenticado.')
    }

    console.log('Usuário autenticado:', user)

    // Continuação da lógica...
    const data = request.only(['startTime', 'endTime', 'serviceId'])

    if (!data.startTime || !data.endTime) {
      return response.badRequest('Start time e end time são obrigatórios.')
    }

    const startTime = DateTime.fromISO(data.startTime, { zone: 'UTC' }).setZone('America/Sao_Paulo')
    const endTime = DateTime.fromISO(data.endTime, { zone: 'UTC' }).setZone('America/Sao_Paulo')

    const appointment = await Appointment.create({
      ...data,
      startTime: startTime.toISO(),
      endTime: endTime.toISO(),
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

    // Apenas clientes, admins ou gerentes podem cancelar
    if (appointment.clientId !== user.id && !['admin', 'manager'].includes(user.role)) {
      return response.unauthorized('Você não tem permissão para cancelar este agendamento.')
    }

    const { message } = request.only(['message'])
    if (!message) {
      return response.badRequest('Uma mensagem explicativa é necessária para o cancelamento.')
    }

    appointment.status = 'canceled'
    appointment.message = message // Salva a mensagem de cancelamento
    await appointment.save()

    return response.ok({ message: 'Agendamento cancelado com sucesso.', appointment })
  }

  public async getPendingAppointments({ auth, response }: HttpContextContract) {
    try {
      const appointments = await Appointment.query()
        .preload('client', (clientQuery) => {
          clientQuery.select('fullName')
        })
        .preload('service', (serviceQuery) => {
          serviceQuery.select('name')
        })
        .where('status', 'pending')
        .orderBy('startTime', 'asc')

      return response.json(appointments)
    } catch (error) {
      console.error(error) // Imprime o erro detalhado no servidor
      return response.status(500).send('Erro ao buscar agendamentos')
    }
  }

  public async getConfirmedAppointments({ auth, response }: HttpContextContract) {
    try {
      const appointments = await Appointment.query()
        .preload('client', (clientQuery) => {
          clientQuery.select('fullName')
        })
        .preload('service', (serviceQuery) => {
          serviceQuery.select('name')
        })
        .where('status', 'confirmed')
        .orderBy('startTime', 'asc')

      return response.json(appointments)
    } catch (error) {
      console.error(error) // Imprime o erro detalhado no servidor
      return response.status(500).send('Erro ao buscar agendamentos')
    }
  }

  public async getCanceledAppointments({ auth, response }: HttpContextContract) {
    try {
      const appointments = await Appointment.query()
        .preload('client', (clientQuery) => {
          clientQuery.select('fullName')
        })
        .preload('service', (serviceQuery) => {
          serviceQuery.select('name')
        })
        .where('status', 'canceled')
        .orderBy('startTime', 'asc')

      return response.json(appointments)
    } catch (error) {
      console.error(error) // Imprime o erro detalhado no servidor
      return response.status(500).send('Erro ao buscar agendamentos')
    }
  }
}
