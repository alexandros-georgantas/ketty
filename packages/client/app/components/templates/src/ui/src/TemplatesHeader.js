/* eslint-disable react/prop-types */
import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { H3 } from '@pubsweet/ui'
import { th } from '@pubsweet/ui-toolkit'

import { Button, Icons } from '../../../../../ui'
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

const TemplatesHeader = props => {
  const {
    setSortingParams,
    sortingParams,
    title,
    canAddTemplates,
    onCreateTemplate,
  } = props

  const handleClick = () => {
    onCreateTemplate()
  }

  return (
    <HeaderWrapper>
      <InnerWrapper>
        <Side1>
          <Title>{title}</Title>
          {canAddTemplates && (
            <Button
              icon={addIcon}
              label="ADD TEMPLATE"
              onClick={handleClick}
              title="Add TEMPLATE"
            />
          )}
        </Side1>

        <Side2>
          <SortMenu
            setSortingParams={setSortingParams}
            sortingParams={sortingParams}
          />
        </Side2>
      </InnerWrapper>
    </HeaderWrapper>
  )
}

TemplatesHeader.propTypes = {
  title: PropTypes.string.isRequired,
}

export default TemplatesHeader
