// export { default as getBookComponentQuery } from './getBookComponent'
export { default as GET_BOOK_COMPONENT } from './getBookComponent'
export { default as GET_CUSTOM_TAGS } from './getCustomTags'
export { default as GET_WAX_RULES } from './getWaxRules'
export { default as GET_USER_TEAM } from './getUserTeams'
export { default as GET_SPECIFIC_FILES } from './getSpecificFiles'

export { default as UPDATE_BOOK_COMPONENT_CONTENT } from './updateContent'
// export { default as UPDATE_CUSTOM_TAG } from './updateCustomTag'
export { default as ADD_CUSTOM_TAG } from './addCustomTag'
// export { default as spellCheckerQuery } from './spellChecker'
export { default as UPDATE_BOOK_COMPONENT_TRACK_CHANGES } from './updateTrackChanges'
export { default as RENAME_BOOK_COMPONENT_TITLE } from './renameBookComponent'
export { default as UPLOAD_FILE } from './uploadFile'
export { default as LOCK_BOOK_COMPONENT } from './lockBookComponent'
export { default as UNLOCK_BOOK_COMPONENT } from './unlockBookComponent'
export {
  BOOK_COMPONENT_TRACK_CHANGES_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_TITLE_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_LOCK_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_ORDER_UPDATED_SUBSCRIPTION,
  CUSTOM_TAG_SUBSCRIPTION,
  BOOK_COMPONENT_WORKFLOW_UPDATED_SUBSCRIPTION,
  BOOK_COMPONENT_UNLOCKED_BY_ADMIN_SUBSCRIPTION,
  TEAM_MEMBERS_UPDATED_SUBSCRIPTION,
} from './waxPubsweetSubscriptions'
