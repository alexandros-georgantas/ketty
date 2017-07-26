import React from 'react'
import { each, isNumber } from 'lodash'

import styles from '../styles/bookBuilder.local.scss'

class FileUploader extends React.Component {
  constructor (props) {
    super(props)

    this.onChange = this.onChange.bind(this)

    this.state = {
      counter: {
        front: null,
        body: null,
        back: null
      }
    }
  }

  onChange (event) {
    event.preventDefault()
    const { book, convert, create, update } = this.props
    const files = event.target.files

    const divisionMapper = {
      a: 'front',
      b: 'body',
      c: 'back'
    }

    each(files, (file, i) => {
      // console.log('here', i)

      const name = file.name.replace(/\.[^/.]+$/, '')
      const nameSpecifier = name.slice(0, 1)

      const division = divisionMapper[nameSpecifier]
      let subCategory

      if (division !== 'body') {
        subCategory = 'component'
      } else {
        if (name.slice(5, 9) === 'Part') {
          subCategory = 'part'
        } else {
          subCategory = 'chapter'
        }
      }

      // let index
      // if (isNumber(this.state.counter[division])) {
      //   index = this.state.counter[division] + 1
      //   this.setState({
      //     counter[division]: this.state.counter[division] + 1
      //   })
      // } else {
      //   index = 0
      // }

      const fragment = {
        book: book.id,
        subCategory,
        division,
        alignment: {
          left: false,
          right: false
        },
        progress: {
          style: 0,
          edit: 0,
          review: 0,
          clean: 0
        },
        lock: null,

        // index,
        kind: 'chapter',
        title: name,

        status: 'unpublished',
        author: '',
        source: '',
        comments: {},
        trackChanges: false
      }

      // create(book, fragment)

      setTimeout(() => {
        create(book, fragment).then((res) => {
          const fragmentId = res.fragment.id

          convert(file).then((response) => {
            const patch = {
              id: fragmentId,
              source: response.converted
            }

            update(book, patch)
          }).catch((error) => {
            console.log(error)
          })
        })
      }, i * 100)
    })
  }

  render () {
    return (
      <div
        className={styles.teamManagerBtn}
      >
        <a>
          Upload files
          <input
            accept='.doc,.docx'
            multiple
            name='fileUploader'
            onChange={this.onChange}
            type='file'
          />
        </a>
      </div>
    )
  }
}

FileUploader.propTypes = {
  book: React.PropTypes.object.isRequired,
  convert: React.PropTypes.func.isRequired,
  create: React.PropTypes.func.isRequired,
  update: React.PropTypes.func.isRequired
}

export default FileUploader
