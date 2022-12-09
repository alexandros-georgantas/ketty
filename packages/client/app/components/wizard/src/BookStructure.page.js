/* eslint-disable no-console */
/* eslint-disable react/prop-types */
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
    const { changeLevelLabelMutation: changeLevelLabelMutationFromArgs } = args
    const { changeLevelLabel } = changeLevelLabelMutationFromArgs
    changeLevelLabel({
      variables: {
        bookId,
        levelId,
        label,
      },
    })
  },
  onClickStart: bookId => {
    const { updateShowWelcomeMutation: updateShowWelcomeMutationFromArgs } =
      args

    const { updateShowWelcome } = updateShowWelcomeMutationFromArgs
    updateShowWelcome({
      variables: {
        bookId,
      },
    })
  },
  onChangeNumberOfLevelsHandler: (
    bookId,
    levelsNumber,
    bookTitle,
    caseFirstTime = false,
  ) => {
    const {
      changeNumberOfLevelsMutation: changeNumberOfLevelsMutationFromArgs,
      withModal: withModalFromArgs,
      getBookQuery: getBookQueryFromArgs,
    } = args

    const { changeNumberOfLevels } = changeNumberOfLevelsMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs
    const { refetch } = getBookQueryFromArgs

    if (caseFirstTime) {
      return changeNumberOfLevels({
        variables: {
          bookId,
          levelsNumber,
        },
      }).then(res => {
        refetch({ id: bookId })
      })
    }

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
    const { updateBookOutlineMutation: updateBookOutlineMutationFromArgs } =
      args

    const { updateBookOutline } = updateBookOutlineMutationFromArgs
    updateBookOutline({
      variables: {
        bookId,
        outline,
      },
    })
  },
  onUpdateLevelContentStructure: (bookId, levels) => {
    const {
      updateLevelContentStructureMutation:
        updateLevelContentStructureMutationFromArgs,
    } = args

    const { updateLevelContentStructure } =
      updateLevelContentStructureMutationFromArgs

    updateLevelContentStructure({
      variables: {
        bookId,
        levels,
      },
    })
  },
  onFinalizeBookStructure: (bookId, title, history) => {
    const {
      finalizeBookStructureMutation: finalizeBookStructureMutationFromArgs,
      withModal: withModalFromArgs,
    } = args

    const { finalizeBookStructure } = finalizeBookStructureMutationFromArgs
    const { showModal, hideModal } = withModalFromArgs

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

                /* eslint-disable consistent-return */
                if (bookStructure.levels.length === 0) {
                  const caseFirstTime = true
                  return onChangeNumberOfLevelsHandler(
                    book.id,
                    levelsNumber,
                    book.title,
                    caseFirstTime,
                  )
                }

                if (bookStructure.levels.length - 2 !== levelsNumber) {
                  return onChangeNumberOfLevelsHandler(
                    book.id,
                    levelsNumber,
                    book.title,
                  )
                }
                /* eslint-enable consistent-return */
              }

              const changeLevelLabel = (idParam, value, index) => {
                if (!errors[`level-${index}-displayName`]) {
                  onChangeLevelLabelHandler(book.id, idParam, value)
                }
              }

              const setErrors = errorsParams =>
                setState({
                  errors: errorsParams,
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
