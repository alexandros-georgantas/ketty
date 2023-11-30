import React from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

import { th, grid } from '@coko/client'

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

  > span {
    padding-bottom: ${grid(0.5)};
  }

  /* stylelint-disable-next-line order/properties-alphabetical-order */
  ${props =>
    props.selected &&
    css`
      font-weight: bold;
      transition: font-weight 0.1s ease-in;

      > span {
        border-bottom: 2px solid ${th('colorPrimary')};
        transition: border 0.1s ease-in;
      }
    `}
`

const TemplateImg = styled.img`
  border-color: transparent;
  border-radius: ${th('borderRadius')};
  border-style: solid;
  border-width: 3px;
  cursor: pointer;
  height: 100px;
  opacity: ${props => (props.selected ? 1 : 0.5)};
  transition: border 0.1s ease-in, opacity 0.1s ease-in;
  width: 82px;

  &:hover {
    border-color: ${th('colorBorder')};
    opacity: 1;
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

      <Name selected={isSelected}>
        <span>{name}</span>
      </Name>
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
