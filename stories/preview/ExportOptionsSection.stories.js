import React, { useState } from 'react'
import { faker } from '@faker-js/faker'

import ExportOptionsSection from '../../app/ui/preview/ExportOptionsSection'
import { defaultProfile } from '../../app/pages/Exporter.page'

const templateData = Array.from(Array(10)).map((_, j) => {
  return {
    id: String(j + 1),
    imageUrl:
      'https://fastly.picsum.photos/id/11/82/100.jpg?hmac=solY9YT1h0M-KJfh8WKXqPfbFygW52ideb5Hf1VCKgc',
    name: faker.lorem.word(),
  }
})

export const Base = () => {
  const [values, setValues] = useState({
    format: defaultProfile.format,
    size: defaultProfile.size,
    content: defaultProfile.content,
    template: templateData[2].id,
  })

  const handleChange = newValues => {
    setValues({ ...values, ...newValues })
  }

  return (
    <ExportOptionsSection
      disabled={false}
      onChange={handleChange}
      selectedContent={values.content}
      selectedFormat={values.format}
      selectedSize={values.size}
      selectedTemplate={values.template}
      templates={templateData}
    />
  )
}

export const Disabled = () => {
  const handleTemplateClick = () => {}

  return (
    <ExportOptionsSection
      disabled
      onChange={() => {}}
      onTemplateClick={handleTemplateClick}
      selectedContent={['includeTitlePage']}
      selectedFormat={defaultProfile.format}
      selectedSize={defaultProfile.size}
      selectedTemplate={templateData[2].id}
      templates={templateData}
    />
  )
}

export default {
  component: ExportOptionsSection,
  title: 'Preview/ExportOptionsSection',
}
