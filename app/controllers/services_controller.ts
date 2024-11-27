// app/Controllers/Http/ServicesController.ts
import Service from '#models/service'
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
}
