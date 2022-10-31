import React from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'
import withLink from '../../common/src/withLink'

const Container = styled.div`
  padding: 0;
  flex-grow:1;
  /* padding-right: calc(${th('gridUnit')} / 2); */
  /* flex-basis: 88%; */
  overflow-x: hidden;
  overflow-y: hidden;
`
const Input = styled.input`
  border: 0;
  padding: 0;
  flex-grow: 0;
  /* line-height: 30px; */
  font-family: 'Vollkorn';
  color: #3f3f3f;
  font-size: ${th('fontSizeHeading4')};
  border-bottom: 1px solid #3f3f3f;
  line-height: ${th('lineHeightHeading4')};
  outline: 0;
  width: 100%;
  &:focus {
    border-bottom: 1px solid #0964cc;
  }
`
const Title = styled.span`
flex-grow:0;
  background-color: white;
  color: #3f3f3f;
  padding-right: ${th('gridUnit')};
  font-family: 'Vollkorn';
  word-wrap: break-word;
  overflow-y: hidden;
  font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')};
  &:after {
    float: left;
    flex-grow:0;
    padding-top:3px;
    width: 0;
    font-size: ${th('fontSizeBaseSmall')};
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
      '. . . . . . . . . . . . . . . . . . . . ';
  }
  a {
    /* font-size: ${th('fontSizeHeading4')};
  line-height: ${th('lineHeightHeading4')}; */
    text-decoration: none;
    color: #3f3f3f;
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
