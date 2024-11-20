// import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
// import { DateTime } from 'luxon'
// import User from './User'
// import Service from './Service'
// import Organization from './Organization'

import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import User from './user.js'
import Service from './service.js'
import Organization from './organization.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Appointment extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public clientId: number

  @column()
  public serviceId: number

  @column()
  public organizationId: number

  // Alterando para DateTime
  @column.dateTime()
  public appointmentTime: DateTime

  @column()
  public status: 'pending' | 'confirmed' | 'canceled'

  @column()
  public message?: string

  @belongsTo(() => User)
  public client: BelongsTo<typeof User>

  @belongsTo(() => Service)
  public service: BelongsTo<typeof Service>

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>
}
