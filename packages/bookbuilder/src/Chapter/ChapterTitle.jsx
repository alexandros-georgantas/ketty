import React from 'react'
import { withRouter } from 'react-router-dom'
import { indexOf, find } from 'lodash'
import config from 'config'

// import DropdownTitle from './DropdownTitle'
import withLink from 'editoria-common/src/withLink'
import RenameEmptyError from './RenameEmptyError'
import Title from './Title'

import styles from '../styles/bookBuilder.local.scss'

class ChapterTitle extends React.Component {
  constructor(props) {
    super(props)
    this.goToEditor = this.goToEditor.bind(this)
  }

  save() {
    this.title.save()
  }

  goToEditor() {
    const { chapter, history, isUploadInProgress } = this.props
    if (chapter.lock !== null || isUploadInProgress) return

    history.push(`/books/${chapter.book}/fragments/${chapter.id}`)
  }

  renderTitle() {
    const {
      chapter,
      isRenaming,
      onSaveRename,
      title,
      // type,
      // update,
    } = this.props
    const { divisions } = config.bookBuilder
    const { division, subCategory } = chapter
    const { showNumberBeforeComponents } = find(divisions, ['name', division])
    const showNumber =
      indexOf(showNumberBeforeComponents, subCategory) > -1 || false

    return (
      <Title
        isRenaming={isRenaming}
        goToEditor={this.goToEditor}
        onSaveRename={onSaveRename}
        ref={node => (this.title = node)}
        title={title}
        showNumber={showNumber}
        number={chapter.number || null}
      />
    )

    // Closing for now the dropdown functionality and fix it later,
    // because rewrites the functionality of Chapter title
    // if (type === 'component') {
    //   return (
    //     <DropdownTitle
    //       chapter={chapter}
    //       goToEditor={this.goToEditor}
    //       title={title}
    //       update={update}
    //     />
    //   )
    // }

    // return null
  }

  renderError() {
    const { isRenameEmpty } = this.props

    return <RenameEmptyError isRenameEmpty={isRenameEmpty} />
  }

  render() {
    const { chapter } = this.props
    const title = this.renderTitle()
    const renameEmptyError = this.renderError()
    const url = `/books/${chapter.book}/fragments/${chapter.id}`

    return (
      <div className={styles.chapterTitle}>
        {withLink(title, url)}
        {/* { this.props.chapter.index } */}
        {renameEmptyError}
        {/* <div className={styles.separator} /> */}
      </div>
    )
  }
}

ChapterTitle.propTypes = {
  chapter: React.PropTypes.object.isRequired,
  history: React.PropTypes.object.isRequired,
  isRenaming: React.PropTypes.bool.isRequired,
  isRenameEmpty: React.PropTypes.bool.isRequired,
  isUploadInProgress: React.PropTypes.bool,
  onSaveRename: React.PropTypes.func.isRequired,
  title: React.PropTypes.string.isRequired,
  type: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired,
}

export default withRouter(ChapterTitle)
