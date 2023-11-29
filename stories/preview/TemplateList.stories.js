import React, { useState } from 'react'
import { faker } from '@faker-js/faker'

import TemplateList from '../../app/ui/preview/TemplateList'

const templateData = Array.from(Array(10)).map((_, j) => {
  return {
    id: String(j + 1),
    imageUrl:
      'https://fastly.picsum.photos/id/11/82/100.jpg?hmac=solY9YT1h0M-KJfh8WKXqPfbFygW52ideb5Hf1VCKgc',
    isSelected: false,
    name: faker.lorem.word(),
  }
})

export const Base = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('2')

  const handleClick = clickedId => {
    setSelectedTemplate(clickedId)
  }

  return (
    <TemplateList
      onTemplateClick={handleClick}
      selectedTemplate={selectedTemplate}
      templates={templateData}
    />
  )
}

export const Empty = () => {
  return <TemplateList onTemplateClick={() => {}} templates={[]} />
}

export const Disabled = () => {
  const handleClick = () => {}

  return (
    <TemplateList
      disabled
      onTemplateClick={handleClick}
      templates={templateData}
    />
  )
}

export default {
  component: TemplateList,
  title: 'Preview/TemplateList',
}