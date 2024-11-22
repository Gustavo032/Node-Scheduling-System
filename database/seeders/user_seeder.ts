import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
    await User.createMany([
      {
        fullName: 'Admin Organization 1',
        email: 'admin1@org.com',
        password: 'password123',
        role: 'admin',
        organizationId: 1,
      },
      {
        fullName: 'Manager Organization 1',
        email: 'manager1@org.com',
        password: 'password123',
        role: 'manager',
        organizationId: 1,
      },
      {
        fullName: 'Employee Organization 1',
        email: 'employee1@org.com',
        password: 'password123',
        role: 'employee',
        organizationId: 1,
      },
      {
        fullName: 'Client Organization 1',
        email: 'client1@org.com',
        password: 'password123',
        role: 'client',
        organizationId: 1,
      },
      {
        fullName: 'Admin Organization 2',
        email: 'admin2@org.com',
        password: 'password123',
        role: 'admin',
        organizationId: 2,
      },
      {
        fullName: 'Client Organization 2',
        email: 'client2@org.com',
        password: 'password123',
        role: 'client',
        organizationId: 2,
      },
    ])
  }
}
