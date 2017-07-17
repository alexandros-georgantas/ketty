import { flow } from 'lodash'
import React from 'react'
import { DragSource, DropTarget } from 'react-dnd'

import FirstRow from './Chapter/FirstRow'
import SecondRow from './Chapter/SecondRow'
import styles from './styles/bookBuilder.local.scss'
import { chapterSource, chapterTarget, collectDrag, collectDrop, itemTypes } from './dnd'

export class Chapter extends React.Component {
  constructor (props) {
    super(props)

    this.toggleUpload = this.toggleUpload.bind(this)
    this.update = this.update.bind(this)

    this.state = {
      isUploadInProgress: false
    }
  }

  update (patch) {
    const { book, update } = this.props
    update(book, patch)
  }

  toggleUpload () {
    this.setState({
      isUploadInProgress: !this.state.isUploadInProgress
    })

    // if (!this.state.isUploadInProgress) this.removeUploadState()
  }

  // getLocalStorageKey () {
  //   const { chapter } = this.props
  //   return 'chapter:upload:' + chapter.id
  // }
  //
  // persistUploadState () {
  //   const key = this.getLocalStorageKey()
  //   window.localStorage.setItem(key, true)
  // }
  //
  // removeUploadState () {
  //   const key = this.getLocalStorageKey()
  //   window.localStorage.removeItem(key)
  // }
  //
  // componentWillMount () {
  //   const key = this.getLocalStorageKey()
  //   var entry = window.localStorage.getItem(key)
  //   if (entry) {
  //     this.setState({
  //       isUploadInProgress: true
  //     })
  //   }
  // }
  //
  // componentWillUnmount () {
  //   if (this.state.isUploadInProgress) {
  //     this.persistUploadState()
  //   }
  // }

  render () {
    const {
      book,
      chapter,
      connectDragSource,
      connectDropTarget,
      ink,
      isDragging,
      outerContainer,
      remove,
      roles,
      title,
      type
    } = this.props

    const { isUploadInProgress } = this.state

    const listItemStyle = {
      opacity: isDragging ? 0 : 1
    }

    // TODO -- refactor these huge class names
    // TODO -- make the dot and line component/s
    return connectDragSource(connectDropTarget(
      <li
        className={styles.chapterContainer + ' col-lg-12 bb-chapter ' + (chapter.subCategory === 'chapter' ? styles.isChapter : styles.isPart)}
        style={listItemStyle}
      >

        <div className={styles.grabIcon + ' ' + (chapter.subCategory === 'part' ? styles.grabIconPart : '')}>
          <i className='fa fa-circle' />
          <div className={styles.tooltip}>
            Grab to sort
          </div>
        </div>

        <div className={styles.chapterMainContent}>
          <FirstRow
            book={book}
            chapter={chapter}
            isUploadInProgress={isUploadInProgress}
            outerContainer={outerContainer}
            remove={remove}
            roles={roles}
            title={title}
            type={type}
            update={this.update}
          />

          <div className={styles.chapterBottomLine} />

          <SecondRow
            chapter={chapter}
            convertFile={ink}
            outerContainer={outerContainer}
            roles={roles}
            toggleUpload={this.toggleUpload}
            update={this.update}
            viewOrEdit={this._viewOrEdit}
          />
        </div>

        <div className={chapter.division === 'body' ? styles.leftBorderBody : styles.leftBorderComponent} />
      </li>
    ))
  }
}

Chapter.propTypes = {
  book: React.PropTypes.object.isRequired,
  chapter: React.PropTypes.object.isRequired,
  connectDragSource: React.PropTypes.func.isRequired,
  connectDropTarget: React.PropTypes.func.isRequired,
  ink: React.PropTypes.func.isRequired,
  isDragging: React.PropTypes.bool.isRequired,
  outerContainer: React.PropTypes.object.isRequired,
  remove: React.PropTypes.func.isRequired,
  roles: React.PropTypes.array,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
}

// combine them, as each chapter can be both a source and a target
export default flow(
  DragSource(itemTypes.CHAPTER, chapterSource, collectDrag),
  DropTarget(itemTypes.CHAPTER, chapterTarget, collectDrop)
)(Chapter)