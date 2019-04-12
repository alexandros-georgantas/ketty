import {
  // each,
  // filter,
  // find,
  get,
  // includes,
  // some,
  // union,
  // debounce,
  isEmpty,
} from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { compose } from 'react-apollo'
import config from 'config'
// import Actions from 'pubsweet-client/src/actions'
import Wax from 'wax-editor-react'
// import { getFragment } from 'pubsweet-client/src/actions/fragments'

export class WaxPubsweet extends React.Component {
  constructor(props) {
    super(props)

    this.fileUpload = this.fileUpload.bind(this)
    this.save = this.save.bind(this)
    // this.unlock = this.unlock.bind(this)
    this.update = this.update.bind(this)
    // this.handlePolling = this.handlePolling.bind(this)
    this.renderWax = this.renderWax.bind(this)
    this.onUnload = this.onUnload.bind(this)

    // this.stackUpdateData = []
    // this.pollingInterval = null

    let mode = ''

    if (props.history.location.pathname.includes('preview')) {
      mode = 'selection'
    }

    this.state = {
      // lockConflict: true,
      // pollingIsLive: false,
    }
  }

  // componentWillMount() {
  //   const { getCollections, getFragments, getTeams } = this.props.actions
  //   // const { fragment } = this.props

  //   getCollections().then(() => {
  //     const { book } = this.props
  //     getTeams().then(() => {
  //       getFragments(book).then(() => {})
  //     })
  //   })
  // }
  onUnload(event) {
    // the method that will be used for both add and remove event
    const { unlockBookComponent, bookComponentId } = this.props
    // if (bookComponent.id) {
    unlockBookComponent({
      variables: {
        input: {
          id: bookComponentId,
        },
      },
    })
  }

  componentDidMount() {
    const { editing } = this.props
    if (editing === 'preview' || editing === 'selection') return
    window.addEventListener('beforeunload', this.onUnload)
  }

  componentWillMount(nextProps) {
    const { lockBookComponent, bookComponentId, editing } = this.props
    // if (bookComponent.id) {
    console.log('edi', editing)
    // // if (bookComponent.id) {
    if (editing === 'preview' || editing === 'selection') return
    lockBookComponent({
      variables: {
        input: {
          id: bookComponentId,
        },
      },
    })
  }

  componentWillUnmount() {
    const { unlockBookComponent, bookComponentId, editing } = this.props
    // if (bookComponent.id) {
    if (editing === 'preview' || editing === 'selection') return
    unlockBookComponent({
      variables: {
        input: {
          id: bookComponentId,
        },
      },
    })
    window.removeEventListener('beforeunload', this.onUnload)
  }

  // lock() {
  //   const { user, match } = this.props
  //   const { fragmentId } = match.params
  //   console.log('in lock')

  //   const patch = {
  //     id: fragmentId,
  //     lock: {
  //       editor: { username: user.username, userId: user.id },
  //       timestamp: new Date(),
  //     },
  //   }

  //   this.update(patch)
  // }

  // unlock() {
  //   const { fragment } = this.props

  //   const patch = {
  //     id: fragment.id,
  //     lock: null,
  //   }

  //   this.update(patch)
  // }

  // getEditingState() {
  //   const { fragment, user } = this.props

  //   if (!fragment || !user) return 'full'

  //   const roles = user.roles

  //   // Production editors and admins can always edit
  //   if (some(['admin', 'production-editor'], role => includes(roles, role))) {
  //     return 'full'
  //   }

  //   const { progress } = fragment

  //   // Copy editor can only edit when state workflow is 'Editing'
  //   const isCopyEditor = includes(roles, 'copy-editor')
  //   const isEditing = progress.edit === 1

  //   if (isCopyEditor && isEditing) return 'full'

  //   // Author can only edit when state workflow is 'Reviewing'
  //   const isAuthor = includes(roles, 'author')
  //   const isReviewing = progress.review === 1

  //   if (isAuthor && isReviewing) return 'full'

  //   return 'selection'
  // }

  componentWillReceiveProps(nextProps) {
    // const { bookComponentId } = nextProps
    // const { lockBookComponent } = this.props
    // const { editing } = this.state
    // console.log('nextProps', nextProps)

    // console.log('config', config)
    // //if lock from other user then setState({pauseUpdates:true})
    // if (
    //   nextProps.bookComponent &&
    //   (nextProps.bookComponent !== this.props.bookComponent ||
    //     nextProps.rules !== this.props.rules) &&
    //   nextProps.rules
    // ) {
    //   if (nextProps.bookComponent.lock) {
    //     this.setState({
    //       config: {
    //         layout: config.wax.layout,
    //         lockWhenEditing: config.wax.lockWhenEditing,
    //         theme: config.wax.theme,
    //         autoSave: config.wax.autoSave,
    //         menus:
    //           config.wax[nextProps.bookComponent.divisionType.toLowerCase()][
    //             nextProps.bookComponent.componentType
    //           ].menus,
    //       },
    //     })
    //   } else {
    //     if (nextProps.rules.canEditFull) {
    //       this.setState({
    //         config: {
    //           layout: config.wax.layout,
    //           lockWhenEditing: config.wax.lockWhenEditing,
    //           theme: config.wax.theme,
    //           autoSave: config.wax.autoSave,
    //           menus:
    //             config.wax[nextProps.bookComponent.divisionType.toLowerCase()][
    //               nextProps.bookComponent.componentType
    //             ].menus,
    //         },
    //       })
    //     } else if (nextProps.rules.canEditSelection) {
    //       this.setState({
    //         config: {
    //           layout: config.wax.layout,
    //           lockWhenEditing: config.wax.lockWhenEditing,
    //           theme: config.wax.theme,
    //           autoSave: config.wax.autoSave,
    //           menus:
    //             config.wax[nextProps.bookComponent.divisionType.toLowerCase()][
    //               nextProps.bookComponent.componentType
    //             ].menus,
    //         },
    //       })
    //     } else if (nextProps.rules.canEditReview) {
    //       this.setState({
    //         config: {
    //           layout: config.wax.layout,
    //           lockWhenEditing: config.wax.lockWhenEditing,
    //           theme: config.wax.theme,
    //           autoSave: config.wax.autoSave,
    //           menus:
    //             config.wax[nextProps.bookComponent.divisionType.toLowerCase()][
    //               nextProps.bookComponent.componentType
    //             ].menus,
    //         },
    //       })
    //     }
    //   }
    // }
    // if (!isEmpty(config) && bookComponentId) {
    //   if (editing === 'preview' || editing === 'selection') return
    //   console.log('looooock')
    //   lockBookComponent({
    //     variables: {
    //       input: {
    //         id: bookComponentId,
    //       },
    //     },
    //   })
    // }
    // if (bookComponent.id) {
  }

  componentWillUpdate(nextProps, nextState) {
    // const { book, history, config } = this.props
    // let { pollingTimer } = config
    // if (pollingTimer === undefined) {
    //   pollingTimer = 1000
    // }
    // if (this.state.editing === null && nextState.editing) {
    //   if (
    //     this.shouldLock() &&
    //     (nextState.editing === 'full' ||
    //       nextState.editing === 'full_without_tc' ||
    //       nextState.editing === 'review')
    //   ) {
    //     this.pollingInterval = setInterval(this.handlePolling, pollingTimer)
    //     // this.lock()
    //   }
    // }
    // if (
    //   this.props.fragment &&
    //   this.props.fragment.lock !== null &&
    //   nextProps.fragment.lock === null
    // ) {
    //   // console.log('old lock', this.props.fragment.lock)
    //   // console.log('new lock', nextProps.fragment.lock)
    //   history.push(`/books/${book.id}/book-builder`)
    // }
  }

  // componentWillUnmount() {
  // // const { editing, lockConflict, pollingIsLive } = this.state
  // // if (!lockConflict) {
  // // if (this.shouldLock() && editing === 'full') this.unlock()
  // // if (this.shouldLock() && editing === 'full') {
  // // console.log('ha')
  // clearInterval(this.pollingInterval)
  // // if (!pollingIsLive && editing !== 'selection') {
  // //   let dialog = confirm('Polling was not initiated, manual unlock will be performed')
  // //   // this.unlock()
  // // } else {
  // //   clearInterval(this.pollingInterval)
  // // }
  // // }
  // // }
  // }

  save(content) {
    const { bookComponent, updateBookComponentContent } = this.props
    const sourceBefore = bookComponent.content || ''
    const hasContentBefore = sourceBefore.trim().length > 0
    const hasContent = content.trim().length > 0
    let workflowStages

    if (!hasContentBefore && hasContent) {
      workflowStages = bookComponent.workflowStages.map(stage => ({
        label: stage.label,
        type: stage.type,
        value: stage.value,
      }))
      workflowStages[0].value = 1 // upload stage
      workflowStages[1].value = 0 // file_prep stage
      return updateBookComponentContent({
        variables: {
          input: {
            id: bookComponent.id,
            content,
            workflowStages,
          },
        },
      })
    }

    return updateBookComponentContent({
      variables: {
        input: {
          id: bookComponent.id,
          content,
        },
      },
    })
  }
  // handlePolling() {
  //   const { polling } = this.props.actions
  //   const { user, match, history } = this.props
  //   const { bookId, fragmentId } = match.params

  //   polling(bookId, fragmentId, user)
  //     .then(res => {
  //       this.setState({ pollingIsLive: true })
  //     })
  //     .catch(err => {
  //       this.setState({ pollingIsLive: true })
  //       if (err.message === 'Forbidden') {
  //         history.push(`/books/${bookId}/book-builder`)
  //       }
  //     })
  // }

  // TODO -- Theoretically, we shouldn't lock when the editor is in read only
  // mode. This gets complicated however, as the user will be able to be add
  // comments, which will in turn affect the fragment.
  shouldLock() {
    const { config } = this.props
    return config.lockWhenEditing
  }

  fileUpload(file) {
    const { uploadFile } = this.props
    return new Promise((resolve, reject) => {
      uploadFile({
        variables: {
          file,
        },
      }).then(res => {
        resolve({ file: `/uploads${res.data.upload.url}` })
      })
    })
  }

  update(patch) {
    const {
      bookComponent,
      updateBookComponentTrackChanges,
      renameBookComponent,
    } = this.props
    const { trackChanges, title } = patch

    if (trackChanges !== undefined) {
      return updateBookComponentTrackChanges({
        variables: {
          input: {
            id: bookComponent.id,
            trackChangesEnabled: trackChanges,
          },
        },
      })
    }

    if (title) {
      return renameBookComponent({
        variables: {
          input: {
            id: bookComponent.id,
            title,
          },
        },
      })
    }
    // const { actions, book, fragment, history } = this.props
    // const { updateFragment } = actions

    // // if (!patch.id) { patch.id = fragment.id }
    // // return updateFragment(book, patch)

    // this.stackUpdateData.push(patch)

    // // TODO -- this is temporary but works
    // // It should DEFINITELY be removed in the near future though
    // /* eslint-disable */
    // debounce(() => {
    //   const patchData = this.stackUpdateData.reduce((acc, x) => {
    //     for (const key in x) acc[key] = x[key]
    //     return acc
    //   }, {})

    //   if (this.stackUpdateData.length > 0) {
    //     if (!patchData.id) {
    //       patchData.id = fragment.id
    //     }

    //     updateFragment(book, patchData).then(res => {
    //       // const { user, fragment } = this.props
    //       if (res.error) {
    //         // When you reload within the editor check if the same user has the lock
    //         // if (fragment.lock && user.id !== fragment.lock.editor.userId) {
    //         history.push(`/books/${book.id}/book-builder`)
    //         // }
    //       } else if (this.state.lockConflict !== false) {
    //         this.setState({ lockConflict: false })
    //       }
    //     })
    //   }
    //   this.stackUpdateData = []
    // }, 100)()
    // /* eslint-enable */
    return Promise.resolve()
  }

  renderWax(editing) {
    const { bookComponent, history, user } = this.props
    const waxConfig = {
      layout: config.wax.layout,
      lockWhenEditing: config.wax.lockWhenEditing,
      theme: config.wax.theme,
      autoSave: config.wax.autoSave,
      menus:
        config.wax[bookComponent.divisionType.toLowerCase()][
          bookComponent.componentType
        ].menus,
    }

    const { layout, autoSave, menus } = waxConfig

    // From editoria config, this is just for testing purposes

    let translatedEditing
    const mode = {
      trackChanges: {
        toggle: true,
        view: true,
        color: '#fff',
        own: {
          accept: true,
          reject: true,
        },
        others: {
          accept: true,
          reject: true,
        },
      },
      styling: true, // isAuthor
    }

    switch (editing) {
      case 'selection':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'preview':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'selection_without_tc':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = false
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'selection'
        break
      case 'review':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = false
        mode.styling = false
        translatedEditing = 'full'
        break
      case 'full_without_tc':
        mode.trackChanges.toggle = false
        mode.trackChanges.view = false
        mode.trackChanges.own.accept = false
        mode.trackChanges.own.reject = false
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = false
        mode.styling = true
        translatedEditing = 'full'
        break
      default:
        mode.trackChanges.toggle = true
        mode.trackChanges.view = true
        mode.trackChanges.own.accept = true
        mode.trackChanges.own.reject = true
        mode.trackChanges.others.accept = true
        mode.trackChanges.others.reject = true
        mode.styling = true
        translatedEditing = 'full'
        break
    }

    // TODO -- these won't change properly on fragment change
    // see trackChanges hack in mapStateToProps
    // const content = get(bookComponent, 'content')
    let { content } = bookComponent

    if (content === null) {
      content = ''
    }
    const trackChangesEnabled = get(bookComponent, 'trackChangesEnabled')

    let chapterNumber
    if (get(bookComponent, 'componentType') === 'chapter') {
      chapterNumber = get(bookComponent, 'componentTypeOrder')
    }
    let header
    if (chapterNumber) {
      header = <h1>{`Chapter ${chapterNumber}. ${bookComponent.title}`}</h1>
    } else {
      header = <h1>{`${bookComponent.title}`}</h1>
    }
    console.log(user)
    return (
      <div>
        {header}
        <Wax
          autoSave={autoSave === undefined ? false : autoSave}
          chapterNumber={chapterNumber}
          className="editor-wrapper"
          content={content}
          editing={translatedEditing}
          fileUpload={this.fileUpload}
          history={history}
          layout={layout}
          menus={menus}
          mode={mode}
          onSave={this.save}
          trackChanges={trackChangesEnabled}
          update={this.update}
          user={user}
        />
      </div>
    )
  }

  render() {
    // const { config, fragment, history, user } = this.props
    const { loading, waxLoading, teamsLoading, editing } = this.props
    // if (loading) return 'Loading...'
    // const { layout } = config

    // TODO -- these won't change properly on fragment change
    // see trackChanges hack in mapStateToProps
    // const content = get(fragment, 'source')
    // const trackChanges = get(fragment, 'trackChanges')

    // let chapterNumber
    // if (get(fragment, 'subCategory') === 'chapter') {
    //   chapterNumber = get(fragment, 'number')
    // }
    // if (loading) {
    //   return <p>Loading</p>
    // }
    if (loading || waxLoading || teamsLoading || isEmpty(config))
      return 'Loading...'

    return this.renderWax(editing)
  }
}

// TODO -- review required props
WaxPubsweet.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  fragment: PropTypes.shape({
    alignment: PropTypes.objectOf(PropTypes.bool),
    author: PropTypes.string,
    book: PropTypes.string,
    division: PropTypes.string,
    id: PropTypes.string,
    index: PropTypes.number,
    kind: PropTypes.string,
    lock: PropTypes.shape({
      editor: PropTypes.shape({
        username: PropTypes.string,
      }),
      timestamp: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.instanceOf(Date),
      ]),
    }),
    number: PropTypes.number,
    owners: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string,
        username: PropTypes.string,
      }),
    ),
    progress: PropTypes.objectOf(PropTypes.number),
    rev: PropTypes.string,
    source: PropTypes.string,
    status: PropTypes.string,
    subCategory: PropTypes.string,
    title: PropTypes.string,
    trackChanges: PropTypes.bool,
    type: PropTypes.string,
  }).isRequired,
  history: PropTypes.any,
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }).isRequired,
}
/* eslint-disable */
WaxPubsweet.defaultProps = {
  config: {
    layout: 'default',
    lockWhenEditing: false,
    pollingTimer: 1000,
  },
  editing: 'full',
  history: null,
}
/* eslint-enable */

// const getRoles = (user, book) => {
//   const teams = filter(user.teams, t => {
//     return t.object.id === book.id
//   })

//   let roles = []
//   const addRole = role => {
//     roles = union(roles, [role])
//   }

//   if (user.admin) addRole('admin')

//   each(teams, team => {
//     const name = team.teamType.name
//     const modified = name
//       .trim()
//       .toLowerCase()
//       .replace(' ', '-')
//     addRole(modified)
//   })

//   return roles
// }

export default compose()(WaxPubsweet) // withAuthsome()
