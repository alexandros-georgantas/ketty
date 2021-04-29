const user = require('@pubsweet/model-user')

const User = user.model

const { ValidationError } = require('@pubsweet/errors')

class EditoriaUser extends User {
  static get schema() {
    return {
      type: 'object',
      properties: {
        password: {
          type: 'string',
        },
        givenName: {
          type: 'string',
        },
        surname: {
          type: 'string',
        },
      },
    }
  }

  static async findById(id) {
    return this.find(id)
  }
  async hashPassword(pwd) {
    this.passwordHash = await User.hashPassword(pwd)
    delete this.password
  }

  async $beforeInsert() {
    super.$beforeInsert()
    if (this.password) await this.hashPassword(this.password)
  }
  static async updatePassword(userId, currentPassword, newPassword) {
    const user = await User.query().findById(userId)
    const isCurrentPasswordValid = await user.validPassword(currentPassword)

    if (!isCurrentPasswordValid) {
      throw new ValidationError(
        'Update password: Current password is not valid',
      )
    }

    if (await user.validPassword(newPassword)) {
      throw new ValidationError(
        'Update password: New password must be different from current password',
      )
    }

    const passwordHash = await User.hashPassword(newPassword)

    return user.$query().patchAndFetch({
      passwordHash,
    })
  }
}

module.exports = EditoriaUser
