import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, beforeSave } from '@adonisjs/lucid/orm'
import Organization from './organization.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import hash from '@adonisjs/core/services/hash'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { compose } from '@adonisjs/core/helpers'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  public id!: number

  @column()
  public fullName!: string

  @column()
  public email!: string

  @column({ serializeAs: null }) // Evita que o campo seja retornado em consultas
  public password: string

  // Hook para hashear a senha antes de salvar
  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await hash.make(user.password)
    }
  }

  @column()
  public token?: string

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days',
    prefix: 'oat_',
    table: 'auth_access_tokens',
    type: 'auth_token',
    tokenSecretLength: 40,
  })

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  // Método para verificar a senha
  // Método para verificar a senha
  public async verifyPassword(password: string) {
    return await hash.verify(this.password, password)
  }

  AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
    uids: ['email'],
    passwordColumnName: 'password',
  })

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
