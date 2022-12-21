/* eslint-disable react/prop-types */
/* stylelint-disable string-quotes,font-family-no-missing-generic-family-keyword, font-family-name-quotes */
import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from '../../common/src/withLink'

const Container = styled.div`
  flex-grow: 1;
  overflow-x: hidden;
  overflow-y: hidden;
  padding: 0;
  /* padding-right: calc(${th('gridUnit')} / 2); */
  /* flex-basis: 88%; */
`

const Input = styled.input`
  border: 0;
  border-bottom: 1px solid #3f3f3f;
  color: #3f3f3f;
  flex-grow: 0;
  font-family: 'Vollkorn';
  font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')};
  outline: 0;
  padding: 0;
  /* line-height: 30px; */
  width: 100%;

  &:focus {
    border-bottom: 1px solid #0964cc;
  }
`

const Title = styled.span`
  background-color: white;
  color: #3f3f3f;
  flex-grow: 0;
  font-family: 'Vollkorn';
  font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')};
  overflow-y: hidden;
  padding-right: ${th('gridUnit')};
  word-wrap: break-word;

  &::after {
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
      '. . . . . . . . . . . . . . . . . . . . ';
    flex-grow: 0;
    float: left;
    font-size: ${th('fontSizeBaseSmall')};
    padding-top: 3px;
    white-space: nowrap;
    width: 0;
  }

  a {
    /* font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')}; */
    color: #3f3f3f;
    text-decoration: none;

    &:hover {
      color: #3f3f3f;
    }
  }
`

const BookTitle = ({
  handleKeyOnInput,
  isRenaming,
  rename,
  title,
  archived,
  bookId,
  finalized,
  canAct,
  ...rest
}) => {
  // const featureBookStructureEnabled =
  //   process.env.FEATURE_BOOK_STRUCTURE || false
  const featureBookStructureEnabled =
    (process.env.FEATURE_BOOK_STRUCTURE &&
      JSON.parse(process.env.FEATURE_BOOK_STRUCTURE)) ||
    false

  let input
  let url = `/books/${bookId}/book-builder`

  if (featureBookStructureEnabled) {
    url = finalized
      ? `/books/${bookId}/book-builder`
      : `/books/${bookId}/book-structure`
  }

  if (canAct !== undefined && canAct === false) {
    return (
      <Container>
        <Title {...rest} archived={archived}>
          {title}
        </Title>
      </Container>
    )
  }

  let bookTitle = (
    <Title {...rest} archived={archived}>
      {withLink(title, url)}
    </Title>
  )

  if (isRenaming) {
    const handleKey = event => {
      if (event.charCode !== 13) return
      event.preventDefault()
      rename(input.value)
    }

    bookTitle = (
      <Input
        autoFocus
        defaultValue={title}
        id={`renameTitle-${bookId}`}
        name="renameTitle"
        onKeyPress={handleKey}
        ref={el => (input = el)}
      />
    )
  }

  return <Container>{bookTitle}</Container>
}

export default BookTitle
