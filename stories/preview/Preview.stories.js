/* eslint-disable no-console */
import React, { useState, useEffect } from 'react'
import { faker } from '@faker-js/faker'
import styled from 'styled-components'
import { Preview } from '../../app/ui'
import { createData, randomPick } from '../_helpers'

const Wrapper = styled.div`
  height: 1000px;
`

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
  thumbnail:
    Math.random() < 0.5
      ? faker.image.imageUrl(200, 200, 'abstract', true)
      : null,
  name: randomPick(templateTitles),
}))

export const Base = () => {
  const [previewLink, setPreviewLink] = useState('')

  const [previewParams, setPreviewParams] = useState({
    exportFormat: 'pdf',
    size: 'a4',
    content: {
      title: true,
      copyright: true,
      toc: true,
    },
    template: null,
  })

  useEffect(() => {
    if (
      previewParams.exportFormat &&
      previewParams.size &&
      previewParams.template
    ) {
      setPreviewLink(
        previewParams.exportFormat === 'pdf'
          ? 'https://ketida.community/features/'
          : '',
      )
    }
  }, [previewParams])

  const handleDownloadPdf = () => {
    console.log('Download PDF clicked')
  }

  const handleDownloadEpub = () => {
    console.log('Download EPUB clicked')
  }

  const handleSelectTemplate = template => {
    setPreviewParams({
      ...previewParams,
      template,
    })
  }

  const handleChangePageSize = size => {
    setPreviewParams({
      ...previewParams,
      size,
    })
  }

  const handleChangeExportFormat = exportFormat => {
    setPreviewParams({
      ...previewParams,
      exportFormat,
    })
  }

  const handleContentChange = content => {
    setPreviewParams({
      ...previewParams,
      content,
    })
  }

  return (
    <Wrapper>
      <Preview
        additionalExportOptions={{
          includeTitlePage: true,
          includeCopyrights: true,
          includeTOC: true,
        }}
        exportFormatValue={previewParams.exportFormat}
        onChangeContent={handleContentChange}
        onChangeExportFormat={handleChangeExportFormat}
        onChangePageSize={handleChangePageSize}
        onClickDownloadEpub={handleDownloadEpub}
        onClickDownloadPdf={handleDownloadPdf}
        onSelectTemplate={handleSelectTemplate}
        previewLink={previewLink}
        selectedTemplate={previewParams.template}
        sizeValue={previewParams.size}
        templates={templates}
      />
    </Wrapper>
  )
}

export default {
  component: Preview,
  title: 'Preview/Preview',
}
