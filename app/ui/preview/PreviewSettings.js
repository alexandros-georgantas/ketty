import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import { Space, List, Avatar } from 'antd'
import { th, grid } from '@coko/client'
import { Checkbox, Select, Radio, Button } from '../common'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: ${grid(4)};
  width: 100%;
`

const Label = styled.span`
  padding-left: 8px;
`

const Section = styled.div`
  border-bottom: 1px solid ${th('colorBorder')};
  margin-bottom: ${grid(6)};

  ${({ grow }) => (grow ? 'flex-grow: 1;' : 'flex-shrink: 0;')};
  overflow-y: auto;

  padding-bottom: ${grid(5)};

  h3 {
    margin: 0 0 ${grid(3)} 0;
  }
  width: 100%;
`

const CenteredSection = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  margin-bottom: ${grid(6)};
`

const StyledList = styled(List)``

const StyledListItem = styled(List.Item)`
  align-items: center;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colorShadow : 'transparent'};
  cursor: pointer;
  display: flex;
  /* stylelint-disable declaration-no-important */
  justify-content: flex-start !important;
  padding-left: 8px !important;
  /* stylelint-enable declaration-no-important */
  width: 100%;
`

const StyledSpace = styled(Space)`
  margin-top: 0;
  width: 100%;
`

const PreviewSettings = props => {
  const {
    additionalExportOptions,
    templates,
    selectedTemplate,
    onSelectTemplate,
    onClickDownloadPdf,
    onClickDownloadEpub,
    onChangePageSize,
    onChangeAdditionalExportOptions,
    processInProgress,
    onChangeExportFormat,
    canExport,
    exportFormatValue,
    sizeValue,
    bookExportInProgress,
    createPreviewInProgress,
  } = props

  const showSizeDropdown = exportFormatValue === 'pdf'
  const showDownloadPdfButton = exportFormatValue === 'pdf'
  const showDownloadEpubButton = exportFormatValue === 'epub'

  const handleChangeTemplate = templateId => {
    onSelectTemplate(templateId)
  }

  const handleChangeExportFormat = value => {
    onChangeExportFormat(value)
  }

  return (
    <Wrapper>
      <CenteredSection>
        <Radio.Group
          buttonStyle="solid"
          disabled={bookExportInProgress || createPreviewInProgress}
          onChange={handleChangeExportFormat}
          options={[
            { value: 'pdf', label: 'PDF' },
            { value: 'epub', label: 'EPUB' },
          ]}
          optionType="button"
          value={exportFormatValue}
        />
      </CenteredSection>

      {showSizeDropdown && (
        <Section>
          <h3>Size</h3>
          <Select
            bordered={false}
            defaultValue={sizeValue}
            disabled={bookExportInProgress || createPreviewInProgress}
            onChange={onChangePageSize}
            options={[
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
            ]}
          />
        </Section>
      )}

      <Section>
        <h3>Content</h3>
        <StyledSpace direction="vertical">
          <Checkbox
            checked={additionalExportOptions?.includeTitlePage}
            disabled={
              !selectedTemplate ||
              !canExport ||
              bookExportInProgress ||
              createPreviewInProgress
            }
            onChange={e =>
              onChangeAdditionalExportOptions(
                'includeTitlePage',
                e.target.checked,
              )
            }
          >
            Title page
          </Checkbox>
          <Checkbox
            checked={additionalExportOptions?.includeCopyrights}
            disabled={
              !selectedTemplate ||
              !canExport ||
              bookExportInProgress ||
              createPreviewInProgress
            }
            onChange={e =>
              onChangeAdditionalExportOptions(
                'includeCopyrights',
                e.target.checked,
              )
            }
          >
            Copyright page
          </Checkbox>
          {exportFormatValue !== 'epub' && (
            <Checkbox
              checked={additionalExportOptions?.includeTOC}
              disabled={
                !selectedTemplate ||
                !canExport ||
                bookExportInProgress ||
                createPreviewInProgress
              }
              onChange={e =>
                onChangeAdditionalExportOptions('includeTOC', e.target.checked)
              }
            >
              Table of contents
            </Checkbox>
          )}
        </StyledSpace>
      </Section>

      <Section grow>
        <StyledList
          dataSource={templates}
          header={<h3>Template Selection</h3>}
          itemLayout="horizontal"
          renderItem={({ id, thumbnail, name }) => (
            <StyledListItem
              onClick={() => handleChangeTemplate(id)}
              selected={id === selectedTemplate}
            >
              <Avatar shape="square" size="large" src={thumbnail?.url} />
              <Label>{name.charAt(0).toUpperCase() + name.slice(1)}</Label>
            </StyledListItem>
          )}
          // showPagination={false}
        />
      </Section>

      <StyledSpace direction="vertical">
        {showDownloadPdfButton && (
          <Section>
            <StyledSpace direction="vertical">
              <Button
                block
                disabled={!selectedTemplate || processInProgress || !canExport}
                loading={selectedTemplate && bookExportInProgress}
                onClick={onClickDownloadPdf}
                size="large"
                type="primary"
              >
                Download PDF
              </Button>
            </StyledSpace>
          </Section>
        )}

        {showDownloadEpubButton && (
          <Section>
            <StyledSpace direction="vertical">
              <Button
                block
                disabled={!selectedTemplate || processInProgress || !canExport}
                loading={selectedTemplate && processInProgress}
                onClick={onClickDownloadEpub}
                size="large"
                type="primary"
              >
                Download EPUB
              </Button>
            </StyledSpace>
          </Section>
        )}
      </StyledSpace>
    </Wrapper>
  )
}

PreviewSettings.propTypes = {
  additionalExportOptions: PropTypes.shape({
    includeTitlePage: PropTypes.bool.isRequired,
    includeCopyrights: PropTypes.bool.isRequired,
    includeTOC: PropTypes.bool.isRequired,
  }).isRequired,
  templates: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      thumbnail: PropTypes.string,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  selectedTemplate: PropTypes.string,
  processInProgress: PropTypes.bool.isRequired,
  bookExportInProgress: PropTypes.bool.isRequired,
  createPreviewInProgress: PropTypes.bool.isRequired,
  onSelectTemplate: PropTypes.func.isRequired,
  onClickDownloadPdf: PropTypes.func.isRequired,
  onClickDownloadEpub: PropTypes.func.isRequired,
  onChangePageSize: PropTypes.func.isRequired,
  onChangeAdditionalExportOptions: PropTypes.func.isRequired,
  sizeValue: PropTypes.string,
  onChangeExportFormat: PropTypes.func.isRequired,
  exportFormatValue: PropTypes.string,
  canExport: PropTypes.bool.isRequired,
}

PreviewSettings.defaultProps = {
  exportFormatValue: 'pdf',
  sizeValue: 'a4',
  selectedTemplate: null,
}

export default PreviewSettings
