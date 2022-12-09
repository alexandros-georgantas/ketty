/* eslint-disable react/prop-types */
import React from 'react'
import { State } from 'react-powerplug'

import ModalContext from './ModalContext'

const ModalProvider = ({ children, modals: modalsInit }) => {
  return (
    <State
      initial={{
        modalState: { data: undefined, modalKey: undefined },
        modals: modalsInit,
      }}
    >
      {({ state, setState }) => {
        const { modalState, modals } = state

        const hideModal = () => {
          setState({
            modalState: {
              data: undefined,
              modalKey: undefined,
            },
          })
        }

        const showModal = (modalKey, data) => {
          setState({
            modalState: {
              data,
              modalKey,
            },
          })
        }

        /* eslint-disable react/jsx-no-constructed-context-values */
        return (
          <ModalContext.Provider
            value={{
              ...modalState,
              modals,
              showModal,
              hideModal,
            }}
          >
            {children}
          </ModalContext.Provider>
        )
      }}
    </State>
  )
}

export default ModalProvider
