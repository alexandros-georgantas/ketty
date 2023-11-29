import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Select } from 'antd'

import { grid } from '@coko/client'

import ExportOption from './ExportOption'
import TemplateList from './TemplateList'

// #region menu options
const exportFormatOptions = [
  {
    value: 'pdf',
    label: 'PDF',
  },
  {
    value: 'epub',
    label: 'EPUB',
  },
]

const exportSizeOptions = [
  {
    value: '8.5x11',
    label: '8.5 x 11 inches, 216 x 279 mm (A4)',
  },
  {
    value: '6x9',
    label: '6 x 9 inches, 152 x 229 mm',
  },
  {
    value: '5.5x8.5',
    label: '5.5 x 8.5, 140 x 216 (A5)',
  },
]

const makeContentOptions = isEpub => [
  {
    value: 'includeTitlePage',
    label: 'Title page',
  },
  {
    value: 'includeCopyrights',
    label: 'Copyright page',
  },
  {
    value: 'includeTOC',
    label: 'Table of contents',
    disabled: isEpub,
  },
]
// .filter(Boolean)
// #endregion menu options

// #region styled
const Wrapper = styled.div`
  > div:last-child {
    margin-top: ${grid(2)};
  }
`

const MultiSelect = styled(Select)`
  min-width: 150px;
`
// #endregion styled

const ExportOptionsSection = props => {
  const {
    className,
    disabled,
    onChange,
    selectedContent,
    selectedFormat,
    selectedSize,
    selectedTemplate,
    templates,
  } = props

  const isEpub = selectedFormat === 'epub'
  const contentOptions = makeContentOptions(isEpub)
  const contentValue = selectedContent
  if (isEpub && !contentValue.includes('includeTOC'))
    contentValue.push('includeTOC')

  const handleChange = newData => {
    if (disabled) return // handle here to prevent flashing
    onChange(newData)
  }

  const handleExportFormatChange = value => {
    handleChange({ format: value })
  }

  const handleSizeChange = value => {
    handleChange({ size: value })
  }

  const handleContentChange = value => {
    handleChange({ content: value })
  }

  const handleTemplateClick = value => {
    handleChange({ template: value })
  }

  return (
    <Wrapper className={className}>
      <ExportOption inline label="format">
        <Select
          bordered={false}
          // disabled={disabled}
          onChange={handleExportFormatChange}
          options={exportFormatOptions}
          value={selectedFormat}
        />
      </ExportOption>

      {!isEpub && (
        <ExportOption inline label="size">
          <Select
            bordered={false}
            // disabled={disabled}
            onChange={handleSizeChange}
            options={exportSizeOptions}
            value={selectedSize}
          />
        </ExportOption>
      )}

      <ExportOption inline label="content">
        <MultiSelect
          allowClear
          bordered={false}
          // disabled={disabled}
          mode="multiple"
          onChange={handleContentChange}
          options={contentOptions}
          placeholder="Please select"
          showSearch={false}
          value={selectedContent}
        />
      </ExportOption>

      <ExportOption label="templates">
        <TemplateList
          // disabled={disabled}
          onTemplateClick={handleTemplateClick}
          selectedTemplate={selectedTemplate}
          templates={templates}
        />
      </ExportOption>
    </Wrapper>
  )
}

ExportOptionsSection.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedContent: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedFormat: PropTypes.string.isRequired,
  selectedSize: PropTypes.string,
  selectedTemplate: PropTypes.string,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      imageUrl: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ),
}

ExportOptionsSection.defaultProps = {
  selectedSize: null,
  selectedTemplate: null,
  templates: [],
}

export default ExportOptionsSection