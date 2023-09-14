const hasRole = (user, role, objectId) => {
  if (!user || !role || !objectId) return false

  const exists = user?.teams?.find(
    t => !t.global && t.role === role && t.objectId === objectId,
  )

  return !!exists
}

const isOwner = (bookId, user) => hasRole(user, 'owner', bookId)

const isCollaborator = (bookId, user) => hasRole(user, 'collaborator', bookId)

const hasEditAccess = (bookId, user) => {
  const { teams } = user
  if (user.admin) return !!user.admin

  if (hasRole(user, 'owner', bookId)) return true

  const bookTeam = teams?.find(
    team => team.objectId === bookId && team.role === 'collaborator',
  )

  const teamMember = bookTeam?.members.find(
    member => member.user?.id === user.id,
  )

  return !!teamMember?.status && teamMember.status === 'write'
}

const isAdmin = user => {
  return !!user.admin
}

module.exports = {
  hasRole,
  isOwner,
  isCollaborator,
  hasEditAccess,
  isAdmin,
}
