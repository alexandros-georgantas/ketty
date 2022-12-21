/* eslint-disable react/prop-types */
/* stylelint-disable  no-descending-specificity */
import React from 'react'
import { th, grid } from '@pubsweet/ui-toolkit'
import styled, { css } from 'styled-components'
import { NavBarLink, Icons } from '../../../ui'

const StyledNavLinks = styled(NavBarLink)`
  align-items: center;
  display: flex;
  ${props => props.position === 'center' && center};
  ${props => props.position === 'left' && left};
  ${props => props.position === 'right' && right};
  width: 100%;

  &:hover {
    svg {
      fill: ${th('colorPrimary')};
      transition: all 0.1s ease-in;
    }
  }
`

const Text = styled.div`
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`

const center = css`
  justify-content: center;
`

const left = css`
  justify-content: flex-start;
`

const right = css`
  justify-content: flex-end;
`

const Container = styled.div`
  align-items: center;
  display: flex;
  width: 32%;
`

const Icon = styled.span`
  margin: 0 4px;

  > svg {
    display: block;
  }
`

const { previousIcon, nextIcon } = Icons

const Header = styled.div`
  align-items: center;
  display: flex;
  flex-grow: 1;
  height: ${grid(9)};
  justify-content: center;
  padding: ${grid(1)};

  > div:not(:last-child) {
    margin-right: ${grid(1)};
  }
`

const createUrl = (bookId, bookComponentId, hasLock) => {
  if (hasLock) {
    return `/books/${bookId}/bookComponents/${bookComponentId}/preview`
  }

  return `/books/${bookId}/bookComponents/${bookComponentId}`
}

const WaxHeader = ({
  nextBookComponent,
  prevBookComponent,
  bookId,
  bookTitle,
  title,
}) => (
  <Header>
    <Container>
      {prevBookComponent && (
        <StyledNavLinks
          position="left"
          to={createUrl(bookId, prevBookComponent.id, prevBookComponent.lock)}
        >
          <Icon>{previousIcon}</Icon>
          <Text>{`${prevBookComponent.title || 'Untitled'}`}</Text>
        </StyledNavLinks>
      )}
    </Container>
    <Container>
      <StyledNavLinks position="center" to={`/books/${bookId}/book-builder`}>
        <Text>{`${bookTitle} - ${title || 'Untitled'}`}</Text>
      </StyledNavLinks>
    </Container>

    <Container>
      {nextBookComponent && (
        <StyledNavLinks
          position="right"
          to={createUrl(bookId, nextBookComponent.id, nextBookComponent.lock)}
        >
          <Text>{`${nextBookComponent.title || 'Untitled'}`}</Text>
          <Icon>{nextIcon}</Icon>
        </StyledNavLinks>
      )}
    </Container>
  </Header>
)

export default WaxHeader
