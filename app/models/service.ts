import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import Organization from './organization.js'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  // @column()
  // public description?: string

  @column()
  public duration: number // Duração em minutos

  // @column()
  // public price?: number

  @column()
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
