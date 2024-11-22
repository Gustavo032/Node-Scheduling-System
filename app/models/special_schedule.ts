// import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class SpecialSchedule extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public date: string // Formato: YYYY-MM-DD

  @column()
  public startTime: string | null // Formato: HH:mm

  @column()
  public endTime: string | null // Formato: HH:mm

  @column()
  public isBlocked: boolean

  @column()
  public organizationId: number
}
