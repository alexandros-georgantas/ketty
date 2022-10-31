/* eslint-disable no-console */

import React from 'react'
import { adopt } from 'react-adopt'
import { get } from 'lodash'
import { State } from 'react-powerplug'
import { withRouter } from 'react-router-dom'
import withModal from '../../common/src/withModal'
import BookStructure from './BookStructure'
import {
  getBookQuery,
  changeLevelLabelMutation,
  changeNumberOfLevelsMutation,
  updateBookOutlineMutation,
  updateLevelContentStructureMutation,
  finalizeBookStructureMutation,
  updateShowWelcomeMutation,
} from './queries'

import { Loading } from '../../../ui'

const mapper = {
  withModal,
  getBookQuery,
  changeLevelLabelMutation,
  changeNumberOfLevelsMutation,
  updateBookOutlineMutation,
  updateLevelContentStructureMutation,
  finalizeBookStructureMutation,
  updateShowWelcomeMutation,
}

const mapProps = args => ({
  book: get(args.getBookQuery, 'data.getBook'),
  loading: args.getBookQuery.networkStatus === 1,
  refetching:
    args.getBookQuery.networkStatus === 4 ||
    args.getBookQuery.networkStatus === 2, // possible apollo bug
  onChangeLevelLabelHandler: (bookId, levelId, label) => {
    const { changeLevelLabelMutation } = args
    const { changeLevelLabel } = changeLevelLabelMutation
    changeLevelLabel({
      variables: {
        bookId,
        levelId,
        label,
      },
    })
  },
  onClickStart: bookId => {
    const { updateShowWelcomeMutation } = args
    const { updateShowWelcome } = updateShowWelcomeMutation
    updateShowWelcome({
      variables: {
        bookId,
      },
    })
  },
  onChangeNumberOfLevelsHandler: (bookId, levelsNumber, bookTitle) => {
    const { changeNumberOfLevelsMutation, withModal, getBookQuery } = args
    const { changeNumberOfLevels } = changeNumberOfLevelsMutation
    const { showModal, hideModal } = withModal
    const { refetch } = getBookQuery
    const onConfirm = () => {
      changeNumberOfLevels({
        variables: {
          bookId,
          levelsNumber,
        },
      }).then(res => {
        refetch({ id: bookId })
        hideModal()
      })
    }
    return showModal('changeNumberOfLevelsModal', {
      onConfirm,
      bookTitle,
    })
  },
  onUpdateBookOutlineHandler: (bookId, outline) => {
    const { updateBookOutlineMutation } = args
    const { updateBookOutline } = updateBookOutlineMutation
    updateBookOutline({
      variables: {
        bookId,
        outline,
      },
    })
  },
  onUpdateLevelContentStructure: (bookId, levels) => {
    const { updateLevelContentStructureMutation } = args
    const { updateLevelContentStructure } = updateLevelContentStructureMutation
    updateLevelContentStructure({
      variables: {
        bookId,
        levels,
      },
    })
  },
  onFinalizeBookStructure: (bookId, title, history) => {
    const { finalizeBookStructureMutation, withModal } = args
    const { finalizeBookStructure } = finalizeBookStructureMutation
    const { showModal, hideModal } = withModal

    const onConfirm = () => {
      finalizeBookStructure({
        variables: {
          bookId,
        },
      }).then(res => {
        hideModal()
        history.push('/books')
      })
    }
    showModal('finalizeBookStructureModal', {
      onConfirm,
      title,
    })
  },
})

const Composed = adopt(mapper, mapProps)

const Connected = props => {
  const { match, history } = props
  const { id } = match.params

  return (
    <Composed bookId={id}>
      {({
        book,
        loading,
        refetching,
        onChangeLevelLabelHandler,
        onChangeNumberOfLevelsHandler,
        onUpdateBookOutlineHandler,
        onUpdateLevelContentStructure,
        onFinalizeBookStructure,
        onClickStart,
      }) => {
        if (loading && !book) return <Loading />
        const { bookStructure } = book
        const { showWelcome } = bookStructure

        return (
          <State
            initial={{
              stepNumber: showWelcome ? 0 : 1,
              errors: {},
            }}
          >
            {({ state, setState }) => {
              const { errors, stepNumber } = state

              const changeNumberOfLevels = levelsNumber => {
                // const clonedErrors = { ...errors }
                if (bookStructure.levels.length === levelsNumber) {
                  return
                }
                if (bookStructure.levels.length - 2 !== levelsNumber) {
                  onChangeNumberOfLevelsHandler(
                    book.id,
                    levelsNumber,
                    book.title,
                  )
                }
              }

              const changeLevelLabel = (id, value, index) => {
                if (!errors[`level-${index}-displayName`]) {
                  onChangeLevelLabelHandler(book.id, id, value)
                }
              }

              const setErrors = errors =>
                setState({
                  errors,
                })

              const changeStepHandler = value => {
                if (value === 100 && stepNumber < 4) {
                  return setState({ stepNumber: stepNumber + 1 })
                }
                if (value === -1 && stepNumber >= 2) {
                  return setState({ stepNumber: stepNumber - 1 })
                }
                return setState({ stepNumber: value })
              }

              const updateBookOutline = outline => {
                onUpdateBookOutlineHandler(book.id, outline)
              }

              const updateLevelContentStructure = level => {
                onUpdateLevelContentStructure(book.id, level)
              }

              const finalizeBookStructure = () => {
                onFinalizeBookStructure(book.id, book.title, history)
              }
              const start = () => {
                onClickStart(book.id)
                setState({ stepNumber: 1 })
              }
              const backToDashboard = () => history.push(`/books/`)

              return (
                <BookStructure
                  backToDashboard={backToDashboard}
                  bookStructure={bookStructure}
                  changeLevelLabel={changeLevelLabel}
                  changeNumberOfLevels={changeNumberOfLevels}
                  changeStep={changeStepHandler}
                  errors={errors}
                  finalizeBookStructure={finalizeBookStructure}
                  setErrors={setErrors}
                  start={start}
                  stepNumber={stepNumber}
                  updateBookOutline={updateBookOutline}
                  updateLevelContentStructure={updateLevelContentStructure}
                />
              )
            }}
          </State>
        )
      }}
    </Composed>
  )
}

export default withRouter(Connected)
