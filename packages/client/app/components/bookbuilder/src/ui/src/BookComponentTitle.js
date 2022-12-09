/* eslint-disable react/prop-types */
import React from 'react'
import { find, indexOf } from 'lodash'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from '../../../../common/src/withLink'

const Container = styled.div`
  padding: 0;
  padding-top: 3px;
  flex-basis: ${({ lock, isToplevel }) => {
    if (lock && !isToplevel) {
      return '83%'
    }

    return '88%'
  }};
  overflow-x: hidden;
  overflow-y: hidden;
`

const Title = styled.span`
  background-color: white;
  padding-right: ${th('gridUnit')};
  font-family: 'Vollkorn';
  word-wrap: break-word;
  overflow-y: hidden;
  font-size: ${th('fontSizeHeading3')};
  line-height: 35px;
  &:before {
    counter-increment: ${({ showNumber, componentType }) =>
      showNumber ? componentType : ''};
    content: ${({ showNumber, componentType }) =>
      showNumber ? `counter(${componentType})". "` : ''};
  }
  &:after {
    float: left;
    padding-top: 3px;
    font-size: ${th('fontSizeBaseSmall')};
    width: 0;
    white-space: nowrap;
    content: '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . '
      '. . . . . . . . . . . . . . . . . . . . ';
  }
  a {
    text-decoration: none !important;
    color: ${th('colorText')} !important;
    &:hover {
      color: ${th('colorText')} !important;
    }
  }
`

const BookComponentTitle = ({
  bookComponentId,
  bookId,
  applicationParameter,
  uploading,
  lock,
  history,
  isToplevel,
  divisionType,
  componentType,
  title,
}) => {
  const { config: divisions } = find(applicationParameter, {
    context: 'bookBuilder',
    area: 'divisions',
  })

  let componentTitle = title || 'Untitled'

  if (lock) {
    const { username } = lock
    componentTitle = `${title || 'Untitled'} (locked by ${username})`
  }

  const { showNumberBeforeComponents } = find(divisions, ['name', divisionType])
  // const featureBookStructureEnabled =
  //   process.env.FEATURE_BOOK_STRUCTURE || false

  const featureBookStructureEnabled =
    (process.env.FEATURE_BOOK_STRUCTURE &&
      JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
    false

  const showNumber =
    indexOf(showNumberBeforeComponents, componentType) > -1 || false

  let bookComponentTitle = (
    <Title
      componentType={componentType}
      showNumber={!featureBookStructureEnabled && showNumber}
    >
      {componentTitle || 'Untitled'}
    </Title>
  )
  const url = `/books/${bookId}/bookComponents/${bookComponentId}`

  if (
    (lock === null || lock === undefined) &&
    !uploading &&
    componentType !== 'toc' &&
    componentType !== 'endnotes'
  ) {
    bookComponentTitle = (
      <Title
        componentType={componentType}
        showNumber={!featureBookStructureEnabled && showNumber}
      >
        {withLink(componentTitle || 'Untitled', url)}
      </Title>
    )
  }

  return (
    <Container
      componentType={componentType}
      isToplevel={isToplevel}
      lock={lock}
    >
      {bookComponentTitle}
    </Container>
  )
}

export default BookComponentTitle
