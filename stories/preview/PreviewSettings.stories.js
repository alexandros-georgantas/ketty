/* eslint-disable no-console */
import React from 'react'
import styled from 'styled-components'
import { faker } from '@faker-js/faker'
import { PreviewSettings } from '../../app/ui/preview'
import { createData, randomPick } from '../_helpers'

const numberOfTemplates = 10

const templateTitles = [
  'Traditional',
  'Poetry',
  'Modern',
  'Memoir',
  'Classic',
  'Beatrix',
]

const templates = createData(numberOfTemplates, i => ({
  id: faker.datatype.uuid(),
  thumbnail: faker.image.imageUrl(200, 200, 'abstract', true),
  name: randomPick(templateTitles),
}))

const selectedTemplate = randomPick(templates)

const Wrapper = styled.div`
  height: 800px;
  max-width: 800px;
`

export const Base = () => {
  const handleChange = pageSize => console.log(`Page size: ${pageSize}`)

  const handleDownloadEpub = () => console.log('Download EPUB clicked')

  const handleDownloadPdf = () => console.log('Download PDF clicked')

  const handleChangeContent = content => console.log(content)

  const handleSelectTemplate = templateId =>
    console.log(`Template selected: ${templateId}`)

  const handleChangeExportFormat = exportFormat =>
    console.log(`Export format: ${exportFormat}`)

  return (
    <Wrapper>
      <PreviewSettings
        additionalExportOptions={{
          includeTitlePage: true,
          includeCopyrights: true,
          includeTOC: true,
        }}
        exportFormatValue="pdf"
        onChangeContent={handleChangeContent}
        onChangeExportFormat={handleChangeExportFormat}
        onChangePageSize={handleChange}
        onClickDownloadEpub={handleDownloadEpub}
        onClickDownloadPdf={handleDownloadPdf}
        onSelectTemplate={handleSelectTemplate}
        selectedTemplate={selectedTemplate.id}
        templates={templates}
      />
    </Wrapper>
  )
}

export default {
  component: PreviewSettings,
  title: 'Preview/PreviewSettings',
}
