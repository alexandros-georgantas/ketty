import { clone } from 'lodash'

import 'fontsource-fira-sans'
import 'typeface-fira-sans-condensed'
import 'fontsource-merriweather'
import 'typeface-vollkorn'
import 'typeface-inter'

import { theme } from '@coko/client'

import {
  FormContainer,
  TextField,
  Heading,
  Button,
  Logo,
  Action,
  LogoLink,
} from './elements'

const ketidaTheme = clone(theme)

ketidaTheme.fontInterface = 'Fira Sans'
ketidaTheme.fontHeading = 'Fira Sans Condensed'
ketidaTheme.fontReading = 'Vollkorn'
ketidaTheme.colorBackgroundTabs = '#e1ebff'
ketidaTheme.colorBackgroundToolBar = '#fff'
ketidaTheme.fontWriting = 'Merriweather'
ketidaTheme.fontTools = 'Inter'
ketidaTheme.colorSelection = '#C5D7FE'
ketidaTheme.colorBackgroundButton = '#0042C7'

ketidaTheme.cssOverrides = {
  ui: {
    TextField,
    H1: Heading.H1,
    Button,
    Action,
    AppBar: {
      LogoLink,
    },
  },
  Login: {
    FormContainer,
    Logo,
  },
}

export default ketidaTheme
