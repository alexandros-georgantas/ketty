/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import { Button, Icons } from '../../../ui'
import ToggleArchivedButton from './ToggleArchivedButton'
import SortMenu from './SortMenu'

const { addIcon } = Icons

const HeaderWrapper = styled.div`
  align-items: center;
  background-color: white;
  display: flex;
  height: calc(9 * ${th('gridUnit')});
  justify-content: center;
  margin-bottom: calc(1 * ${th('gridUnit')});
  position: sticky;
  top: 0;
  z-index: 1;
`

const Side1 = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 50%;
  justify-content: flex-start;
`

const Side2 = styled.div`
  align-items: center;
  display: flex;
  flex-basis: 50%;
  justify-content: flex-end;
`

const Title = styled(H3)`
  color: #3f3f3f;
  font-family: ${th('fontReading')};
  font-weight: normal;
  margin: 0;
  margin-right: calc(3 * ${th('gridUnit')});
  padding-bottom: 0;
  padding-top: 3px;
  text-transform: uppercase;
`

const InnerWrapper = styled.div`
  display: flex;
  flex-basis: 76%;
`

const DashboardHeader = props => {
  const {
    title,
    collectionId,
    canAddBooks,
    onAddBook,
    setSortingParams,
    sortingParams,
  } = props

  const handleClick = () => {
    onAddBook(collectionId)
  }

  return (
    <HeaderWrapper>
      <InnerWrapper>
        <Side1>
          <Title>{title}</Title>
          {canAddBooks && (
            <Button
              icon={addIcon}
              label="ADD BOOK"
              onClick={handleClick}
              title="Add Book"
            />
          )}
        </Side1>

        <Side2>
          <ToggleArchivedButton
            setSortingParams={setSortingParams}
            sortingParams={sortingParams}
          />
          <SortMenu
            setSortingParams={setSortingParams}
            sortingParams={sortingParams}
          />
        </Side2>
      </InnerWrapper>
    </HeaderWrapper>
  )
}

DashboardHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default DashboardHeader
