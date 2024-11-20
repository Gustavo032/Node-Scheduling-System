import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public fullName!: string

  @column()
  public email!: string

  @column()
  public password!: string

  @column()
  public role!: string

  @column()
  public organizationId: number | null = null

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>

  @column.dateTime({ autoCreate: true })
  public createdAt!: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt!: DateTime
}
