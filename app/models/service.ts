// import { BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description?: string

  @column()
  public duration: number // Duração em minutos

  @column()
  public price: number

  @column()
  public organizationId: number

  @belongsTo(() => Organization)
  public organization: BelongsTo<typeof Organization>
}
