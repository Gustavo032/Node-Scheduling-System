// app/Controllers/Http/OrganizationsController.ts
import Organization from '#models/organization'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrganizationsController {
  // Criar organização
  public async store({ request, response }: HttpContextContract) {
    const data = request.only(['name', 'email', 'workingHours', 'phone'])
    const organization = await Organization.create(data)
    return response.created(organization)
  }

  // Atualizar configurações
  public async update({ params, request }: HttpContextContract) {
    const organization = await Organization.findOrFail(params.id)
    const data = request.only(['email', 'workingHours', 'phone'])
    organization.merge(data)
    await organization.save()
    return organization
  }

  // Listar organizações
  public async index() {
    return Organization.all()
  }
}
