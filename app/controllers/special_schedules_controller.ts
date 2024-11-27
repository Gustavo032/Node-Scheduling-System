// app/Controllers/Http/SpecialSchedulesController.ts
import SpecialSchedule from '#models/special_schedule'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SpecialSchedulesController {
  // Criar horário especial
  public async store({ request }: HttpContextContract) {
    const data = request.only(['date', 'startTime', 'endTime', 'organizationId'])
    const schedule = await SpecialSchedule.create(data)
    return schedule
  }

  // Atualizar horário especial
  public async update({ params, request }: HttpContextContract) {
    const schedule = await SpecialSchedule.findOrFail(params.id)
    const data = request.only(['startTime', 'endTime'])
    schedule.merge(data)
    await schedule.save()
    return schedule
  }

  // Listar horários especiais
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!
    return SpecialSchedule.query().where('organizationId', user.organizationId)
  }

  // Excluir horário especial
  public async destroy({ params }: HttpContextContract) {
    const schedule = await SpecialSchedule.findOrFail(params.id)
    await schedule.delete()
    return { message: 'Horário especial excluído com sucesso.' }
  }
}
