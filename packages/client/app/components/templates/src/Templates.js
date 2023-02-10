/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import styled from 'styled-components'

import TemplatesHeader from './ui/src/TemplatesHeader'
import TemplatesGrid from './ui/src/TemplatesGrid'

import { Loading } from '../../../ui'

const featureBookStructureEnabled =
  (process.env.FEATURE_BOOK_STRUCTURE &&
    JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
  false

const Container = styled.div`
  clear: both;
  display: block;
  float: none;
  height: 100%;
  margin: 0 auto;
  max-width: 100%;
  overflow-y: auto;
`

const InnerWrapper = styled.div`
  clear: both;
  display: block;
  float: none;
  height: calc(100% - 80px);
  margin: 0 auto;
  max-width: 76%;
`

const Template = ({
  templates,
  onAccessWarningModal,
  currentUser,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  history,
  setSortingParams,
  sortingParams,
  loading,
  refetching,
}) => {
  if (loading || !templates || !currentUser) return <Loading />

  useEffect(() => {
    if (featureBookStructureEnabled) {
      if (!currentUser.admin) {
        onAccessWarningModal(history)
      }
    }
  }, [currentUser.admin])

  return (
    <Container>
      <>
        <TemplatesHeader
          canAddTemplates
          onCreateTemplate={onCreateTemplate}
          setSortingParams={setSortingParams}
          sortingParams={sortingParams}
          title="Templates"
        />
        <InnerWrapper>
          <TemplatesGrid
            onDeleteTemplate={onDeleteTemplate}
            onUpdateTemplate={onUpdateTemplate}
            refetching={refetching}
            templates={templates}
          />
        </InnerWrapper>
      </>
    </Container>
  )
}

export default Template
