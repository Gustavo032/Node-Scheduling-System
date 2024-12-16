// app/Controllers/Http/ServicesController.ts
import Appointment from '#models/appointment'
import Organization from '#models/organization'
import Service from '#models/service'
import SpecialSchedule from '#models/special_schedule'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ServicesController {
  // Criar serviço
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name', 'duration', 'organizationId'])
    const service = await Service.create(data)
    return response.created(service)
  }

  // Atualizar serviço
  public async update({ params, request }: HttpContextContract) {
    const service = await Service.findOrFail(params.id)
    const data = request.only(['name', 'duration'])
    service.merge(data)
    await service.save()
    return service
  }

  // Listar serviços
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!
    return Service.query().where('organizationId', user.organizationId)
  }

  // Excluir serviço
  public async destroy({ params }: HttpContextContract) {
    const service = await Service.findOrFail(params.id)
    await service.delete()
    return { message: 'Serviço excluído com sucesso.' }
  }

  public async getAvailability({ params, auth, response }: HttpContextContract) {
    const user = auth.user!
    const serviceId = params.id // Serviço
    const date = new Date(params.date) // Converter para objeto Date

    // Validar entrada
    if (!serviceId || !date) {
      return response.badRequest({ error: 'serviceId e date são obrigatórios' })
    }

    console.log('Date received:', date) // Log da data recebida

    const service = await Service.query()
      .where('id', serviceId)
      .where('organizationId', user.organizationId)
      .firstOrFail()

    const organization = await Organization.findOrFail(user.organizationId)

    // Consultar os agendamentos
    const appointments = await Appointment.query()
      .where('serviceId', serviceId)
      .whereRaw('DATE("start_time"::timestamp) = ?', [date.toISOString().split('T')[0]])

    console.log('Appointments:', appointments)

    // Criar array apenas com os startTimes dos agendamentos, formatando para HH:mm
    const appointmentStartTimes = appointments.map((appointment: any) => {
      return appointment.startTime.toFormat('HH:mm') // Formatar para HH:mm
    })

    console.log('Appointment start times:', appointmentStartTimes) // Log dos horários de início

    // Determinar o dia da semana
    const dayOfWeek = date.getDay() // 0 = Domingo, 1 = Segunda-feira, ..., 6 = Sábado

    // Obter os horários de trabalho da organização para o dia da semana
    const workingHours =
      organization.workingHours?.[Object.keys(organization.workingHours ?? {})[dayOfWeek]]

    // Se não houver horários de trabalho específicos para esse dia, considerar horário padrão
    const workingStart = workingHours ? workingHours.start : '00:00'
    const workingEnd = workingHours ? workingHours.end : '23:59'

    // Conversão para minutos - A função 'timeToMinutes' agora é um método da classe
    const startTime = ServicesController.timeToMinutes(workingStart)
    const endTime = ServicesController.timeToMinutes(workingEnd)

    const interval = service.duration // intervalo de duração do serviço
    const availableTimes = []

    // Gerar os horários disponíveis
    for (let time = startTime; time < endTime; time += interval) {
      const hours = Math.floor(time / 60)
      const minutes = time % 60
      const formattedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

      console.log('Checking availability for:', formattedTime) // Log do horário sendo verificado

      // Arredonda o horário disponível para o intervalo
      const roundedAvailableTime = ServicesController.roundToNearestInterval(
        formattedTime,
        interval
      )

      // Converte os horários de agendamento para minutos e arredonda
      const isBooked = appointmentStartTimes.some((appointmentTime: string) => {
        const roundedAppointmentTime = ServicesController.roundToNearestInterval(
          appointmentTime,
          interval
        )
        return roundedAppointmentTime === roundedAvailableTime
      })

      if (!isBooked) {
        availableTimes.push(roundedAvailableTime) // Adiciona o horário disponível
      }
    }

    // Retorna os horários disponíveis e agendados
    return response.ok({
      availableTimes,
      formattedAppointmentTimes: appointmentStartTimes,
    })
  }

  // Método timeToMinutes para conversão de horário
  // Método timeToMinutes como estático
  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }
  private static roundToNearestInterval(time: string, interval: number): string {
    const [hours, minutes] = time.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes

    // Calcula o arredondamento
    const roundedMinutes = Math.round(totalMinutes / interval) * interval
    const roundedHours = Math.floor(roundedMinutes / 60)
    const roundedFinalMinutes = roundedMinutes % 60

    // Retorna o horário arredondado
    return `${String(roundedHours).padStart(2, '0')}:${String(roundedFinalMinutes).padStart(2, '0')}`
  }
}
