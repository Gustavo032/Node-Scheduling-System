// import { Router } from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

// Controllers
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UsersController from '#controllers/users_controller'
import AuthController from '#controllers/auth_controller'
import OrganizationsController from '#controllers/organizations_controller'
import AppointmentsController from '#controllers/appointments_controller'
const ServicesController = () => import('#controllers/services_controller')
const SpecialSchedulesController = () => import('#controllers/special_schedules_controller')

import { Router } from '@adonisjs/http-server'
import router from '@adonisjs/core/services/router'

// const router = new Router()
// import UsersController from '#controllers/users_controller'
const usersController = new UsersController()
const appointmentsController = new AppointmentsController()
const authController = new AuthController()
const organizationsController = new OrganizationsController()
// const servicesController = new ServicesController()
// const specialSchedulesController = new SpecialSchedulesController()
router
  .group(() => {
    // Registro e login
    router.post('/register', usersController.register).use([middleware.auth()])
    router.post('/login', authController.login)
    router
      .post('logout', async ({ auth, response }: HttpContextContract) => {
        await auth.use('api').logout()
        return response.redirect('/login')
      })
      .use([middleware.auth()])
    // Usuários
    // router.post('/users', usersController.register)
    router
      .get('/users', usersController.index)
      .use([middleware.auth(), middleware.roleValidation(['admin', 'manager'])])
    router
      .put('/users/:id/role', usersController.updateRole)
      .use([middleware.auth(), middleware.roleValidation(['admin'])])
    // Organizações
    router.post('/organizations', organizationsController.store).use([middleware.auth()])
    router.get('/organizations', organizationsController.index)
    router //+
      .put('/organizations/:id', organizationsController.update)
      .use([
        //+
        middleware.auth(), //+
        middleware.roleValidation(['admin', 'manager']), //+
      ]) //+
    // Serviços
    router
      .resource('services', ServicesController)
      .use('*', [middleware.auth(), middleware.roleValidation(['admin', 'manager'])])
    // Horários Especiais
    router
      .resource('special-schedules', SpecialSchedulesController)
      .use('*', [middleware.auth(), middleware.roleValidation(['admin', 'manager'])])

    router
      .get('/appointments/pending', appointmentsController.getPendingAppointments)
      .use([middleware.auth()])
    router
      .get('/appointments/confirmed', appointmentsController.getConfirmedAppointments)
      .use([middleware.auth()])

    router
      .get('/appointments/canceled', appointmentsController.getCanceledAppointments)
      .use([middleware.auth()])

    router.get('/appointments', appointmentsController.index).use([middleware.auth()])
    router.post('/appointments', appointmentsController.store).use([middleware.auth()])
    router.put('/appointments', appointmentsController.update).use([middleware.auth()])
    router.delete('/appointments', appointmentsController.cancel).use([middleware.auth()])
  })
  .prefix('api')
export default router
