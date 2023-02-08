/* stylelint-disable string-quotes */
import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  width: 100%;
`

const Spinner = styled.div`
  background: url('/loader.gif');
  height: 50px;
  width: 50px;
`

const Loading = () => (
  <Wrapper>
    <Spinner />
  </Wrapper>
)

export default Loading
