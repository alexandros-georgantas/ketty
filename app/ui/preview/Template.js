import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { th } from '@coko/client'

import fallback from '../../../static/imageFallback.png'

const Wrapper = styled.div`
  cursor: pointer;
  display: inline-flex;
  flex-direction: column;
  max-width: 85px;
  object-fit: cover;
`

const Name = styled.div`
  align-items: center;
  text-align: center;
  text-transform: capitalize;
  word-wrap: break-word;
`

const TemplateImg = styled.img`
  border-color: transparent;
  border-radius: ${th('borderRadius')};
  border-style: solid;
  border-width: 3px;
  cursor: pointer;
  height: 100px;
  transition: border 0.2s ease-in;
  width: 82px;

  &:hover {
    border-color: ${th('colorBorder')};
  }

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.selected &&
    css`
      border-color: ${th('colorPrimary')};

      &:hover {
        border-color: ${th('colorPrimary')};
      }
    `}
`

const Template = props => {
  const { className, id, imageUrl, isSelected, name, onClick } = props

  const handleClick = () => onClick(id)

  return (
    <Wrapper className={className} key={id} onClick={handleClick}>
      <TemplateImg
        alt={name}
        selected={isSelected}
        src={imageUrl || fallback}
      />
      <Name>{name}</Name>
    </Wrapper>
  )
}

Template.propTypes = {
  id: PropTypes.string.isRequired,
  imageUrl: PropTypes.string,
  isSelected: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
}

Template.defaultProps = {
  imageUrl: null,
}

export default Template
