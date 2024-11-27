import User from '#models/user'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthController {
  public async login({ request, response, auth }: HttpContextContract) {
    const { email, password } = request.only(['email', 'password'])

    // 1. Buscar o usuário pelo email
    const user = await User.verifyCredentials(email, password)

    // const token = await auth.use('api').generate(user)
    await auth.use('web').login(
      user,
      /**
       * Generate token when "remember_me" input exists
       */
      !!request.input('remember_me')
    )

    const token = await User.accessTokens.create(user)

    return response.ok({ message: 'Login bem-sucedido', token })
  }
}
