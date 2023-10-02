import React from 'react'
import PropTypes from 'prop-types'

import {useTranslation} from "react-i18next";
import { Paragraph, Text } from '../common'

const SuccessSubTitle = ({ userEmail }) => {

    const {t} = useTranslation()
    return (
    <Paragraph>
      {/* An email has been sent to <Text strong>{userEmail}</Text> containing
      further instructions. */}
        `${t('An email has been sent to')} <Text strong>{userEmail}</Text> ${t('containing further instructions.')}`
    </Paragraph>
  )
}

SuccessSubTitle.propTypes = {
  userEmail: PropTypes.string.isRequired,
}

export default SuccessSubTitle
