/* eslint-disable react/prop-types,react/jsx-no-useless-fragment */
import React, { useState } from 'react'
import styled from 'styled-components'
import { th } from '@pubsweet/ui-toolkit'

const Container = styled.div`
  display: flex;
  width: 100%;
  /* padding: 8px; */
  flex-direction: column;
  margin-bottom: 8px;
`

const Header = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  padding-left: ${({ hasHandle }) => (hasHandle ? '0' : '38px')};
  margin-bottom: 4px;
`
// const grabIcon = (
//   <svg
//     enableBackground="new 0 0 24 24"
//     fill="#000000"
//     height="24px"
//     viewBox="0 0 24 24"
//     width="24px"
//     xmlns="http://www.w3.org/2000/svg"
//   >
//     <g>
//       <rect fill="none" height="24" width="24" />
//     </g>
//     <g>
//       <g>
//         <g>
//           <path d="M20,9H4v2h16V9z M4,15h16v-2H4V15z" />
//         </g>
//       </g>
//     </g>
//   </svg>
// )

const grabFreeMove = (
  <svg
    fill="#000000"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />
  </svg>
)

const collapseIcon = (
  <svg
    fill="#000000"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z" />
  </svg>
)

const expandIcon = (
  <svg
    fill="#000000"
    height="24px"
    viewBox="0 0 24 24"
    width="24px"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
  </svg>
)

const AccordionIcon = styled.div`
  display: flex;
  align-items: center;
`

const StyledIcon = styled.i`
  height: 24px;
  padding-right: 8px;
  &:hover {
    svg {
      fill: ${th('colorPrimary')};
    }
  }
  &:active {
    svg {
      fill: ${th('colorPrimary')};
    }
  }
  &:focus {
    svg {
      fill: ${th('colorPrimary')};
    }
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
`

const DraggableItem = ({
  active = false,
  isAccordion,
  externalHandler = undefined,
  headerComponent,
  level = undefined,
  headerActionComponents,
  children,
  dragHandleProps,
  grabFreeMoveIcon,
  hasHandle = true,
}) => {
  const [isActive, setIsActive] = useState(active)

  const renderIcon = () => {
    if (!externalHandler) {
      if (isActive) {
        return <StyledIcon>{collapseIcon}</StyledIcon>
      }

      return <StyledIcon>{expandIcon}</StyledIcon>
    }

    if (active) {
      return <StyledIcon>{collapseIcon}</StyledIcon>
    }

    return <StyledIcon>{expandIcon}</StyledIcon>
  }

  return (
    <Container>
      <Header hasHandle={hasHandle}>
        {dragHandleProps && (
          <StyledIcon {...dragHandleProps}>{grabFreeMove}</StyledIcon>
        )}
        {isAccordion && (
          <AccordionIcon
            onClick={() => {
              if (!externalHandler) {
                return setIsActive(!isActive)
              }

              return externalHandler(level)
            }}
          >
            {renderIcon()}
          </AccordionIcon>
        )}
        <Wrapper>
          {headerComponent}
          {headerActionComponents}
        </Wrapper>
      </Header>
      {!externalHandler && isActive && <>{children}</>}
      {externalHandler && active && <>{children}</>}
    </Container>
  )
}

export default DraggableItem
