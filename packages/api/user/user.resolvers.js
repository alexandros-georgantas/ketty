const includes = require('lodash/includes')
const forEach = require('lodash/forEach')
const get = require('lodash/get')
const startsWith = require('lodash/startsWith')

const { User } = require('@pubsweet/models')

const isValidUser = ({ surname, givenName }) => surname && givenName

const findUser = async (_, { search, exclude }, ctx, info) => {
  if (!search) {
    return []
  }
  const allUsers = await ctx.connectors.User.model.all()
  const searchLow = search.toLowerCase()
  const res = []

  if (searchLow.length <= 3) {
    forEach(allUsers, user => {
      if (user.admin) return
      if (isValidUser(user)) {
        if (
          (startsWith(get(user, 'username', '').toLowerCase(), searchLow) ||
            startsWith(get(user, 'surname', '').toLowerCase(), searchLow) ||
            startsWith(get(user, 'email', '').toLowerCase(), searchLow)) &&
          !includes(exclude, user.id)
        ) {
          res.push(user)
        }
      } else {
        if (
          (startsWith(get(user, 'username', '').toLowerCase(), searchLow) ||
            startsWith(get(user, 'email', '').toLowerCase(), searchLow)) &&
          !includes(exclude, user.id)
        ) {
          res.push(user)
        }
      }
    })
  } else if (searchLow.length > 3) {
    forEach(allUsers, user => {
      if (user.admin) return
      if (isValidUser(user)) {
        const fullname = `${user.givenName} ${user.surname}`
        if (
          (get(user, 'username', '')
            .toLowerCase()
            .includes(searchLow) ||
            get(user, 'surname', '')
              .toLowerCase()
              .includes(searchLow) ||
            get(user, 'email', '')
              .toLowerCase()
              .includes(searchLow) ||
            fullname.toLowerCase().includes(searchLow)) &&
          !includes(exclude, user.id)
        ) {
          res.push(user)
        }
      } else {
        if (
          (get(user, 'username', '')
            .toLowerCase()
            .includes(searchLow) ||
            get(user, 'email', '')
              .toLowerCase()
              .includes(searchLow)) &&
          !includes(exclude, user.id)
        ) {
          res.push(user)
        }
      }
    })
  }

  return res
}
const createEditoriaUser = async (_, { input }, ctx, info) => {
  const allUsers = await ctx.connectors.User.model.all()
  const { username, givenName, surname, email } = input
  const errors = []
  forEach(allUsers, user => {
    if (user.username === username) {
      errors.push('username')
    }
    if (user.surname === surname && user.givenName === givenName) {
      errors.push('name')
    }
    if (user.email === email) {
      errors.push('email')
    }
  })

  if (errors.length !== 0) {
    throw new Error(`User with same ${errors} already exists!`)
  }

  if (input.password) {
    input.passwordHash = await ctx.connectors.User.model.hashPassword(
      input.password,
    )
    delete input.password
  }

  return ctx.connectors.User.create(input, ctx)
}
const updateUser = async (_, { id, input }, ctx, info) => {
  if (input.password) {
    input.passwordHash = await ctx.connectors.User.model.hashPassword(
      input.password,
    )
    delete input.password
  }

  return ctx.connectors.User.update(id, input, ctx)
}

// NO AUTH
const updatePassword = async (_, { input }, ctx) => {
  const userId = ctx.user
  const { currentPassword, newPassword } = input

  try {
    const u = await User.updatePassword(userId, currentPassword, newPassword)
    return u.id
  } catch (e) {
    throw new Error(e)
  }
}

// NO AUTH
const updatePersonalInformation = async (_, { input }, ctx) => {
  const userId = ctx.user
  const { givenName, surname } = input

  const personalInfo = await User.query().patchAndFetchById(userId, {
    givenName,
    surname,
  })
  return personalInfo
}

// NO AUTH
const updateUsername = async (_, { input }, ctx) => {
  const userId = ctx.user
  const { username } = input

  const updateUser = await User.query().patchAndFetchById(userId, { username })

  return updateUser
}

module.exports = {
  Mutation: {
    findUser,
    createEditoriaUser,
    updateUser,
    updatePassword,
    updatePersonalInformation,
    updateUsername,
  },
}
