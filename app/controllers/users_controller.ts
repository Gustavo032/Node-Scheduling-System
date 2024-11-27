// app/Controllers/Http/UsersController.ts
import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  // Registrar usuário
  public async register({ request, response }: HttpContextContract) {
    const data = request.only(['fullName', 'email', 'password', 'role', 'organizationId'])

    // O hash será aplicado automaticamente antes de salvar o usuário
    const user = await User.create(data)

    return response.created(user)
  }

  // Atualizar perfil
  public async updateProfile({ auth, request }: HttpContextContract) {
    const user = auth.user!
    const data = request.only(['fullName', 'email', 'password'])

    // Atualiza apenas os campos enviados (incluindo senha)
    user.merge(data)

    // O hash será aplicado automaticamente antes de salvar
    await user.save()

    return user
  }

  // Listar usuários da organização
  public async index({ auth }: HttpContextContract) {
    const user = auth.user!
    return User.query().where('organizationId', user.organizationId)
  }

  // Alterar permissões
  public async updateRole({ params, request }: HttpContextContract) {
    const user = await User.findOrFail(params.id)
    const { role } = request.only(['role'])
    user.role = role
    await user.save()
    return user
  }
}
