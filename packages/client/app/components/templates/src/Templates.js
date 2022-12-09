/* eslint-disable react/prop-types */
import React from 'react'
import styled from 'styled-components'

import TemplatesHeader from './ui/src/TemplatesHeader'
import TemplatesGrid from './ui/src/TemplatesGrid'

import { Loading } from '../../../ui'

const Container = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  height: 100%;
  max-width: 100%;
  overflow-y: auto;
`

const InnerWrapper = styled.div`
  display: block;
  clear: both;
  float: none;
  margin: 0 auto;
  max-width: 76%;
  height: calc(100% - 80px);
`

const Template = ({
  templates,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  setSortingParams,
  sortingParams,
  loading,
  refetching,
}) => {
  if (loading || !templates) return <Loading />

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
