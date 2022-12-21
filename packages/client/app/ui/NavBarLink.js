import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { th, grid } from '@pubsweet/ui-toolkit'

const NavBarLink = styled(Link)`
  color: ${({ active }) =>
    active === 'true' ? th('colorPrimary') : th('colorText')};
  display: inline-block;
  font-family: ${th('fontInterface')};
  font-size: ${th('fontSizeBase')};
  font-weight: ${({ active }) => (active ? 'bold' : 'normal')};
  line-height: ${th('lineHeightBase')};
  padding: ${grid(0.5)};
  text-decoration: none;

  &:hover {
    background: ${th('colorBackgroundHue')};
    color: ${th('colorPrimary')};
  }

  &:link,
  &:visited {
    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    line-height: ${th('lineHeightBase')};
    text-decoration: none;
  }

  &:active,
  &:focus {
    color: ${th('colorPrimary')};
    font-family: ${th('fontInterface')};
    font-size: ${th('fontSizeBase')};
    font-weight: bold;
    line-height: ${th('lineHeightBase')};
    text-decoration: none;
  }
`

export default NavBarLink
