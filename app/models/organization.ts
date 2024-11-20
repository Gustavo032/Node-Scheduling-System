import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import User from './user.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'

export default class Organization extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public address?: string

  @column()
  public phone?: string

  @hasMany(() => User)
  public users: HasMany<typeof User>
}
