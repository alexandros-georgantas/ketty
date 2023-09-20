/* eslint-disable no-console */
import React from 'react'
import { faker } from '@faker-js/faker'
import { BookMetadataForm } from '../../app/ui'
import { Form } from '../../app/ui/common'

export const Base = props => {
  const handleSubmit = values => console.log(values)

  const [form] = Form.useForm()

  return <BookMetadataForm form={form} onSubmit={handleSubmit} {...props} />
}

Base.args = {
  initialValues: {
    title: faker.lorem.words(),
    subtitle: faker.lorem.words(10),
    authors: faker.name.fullName(),
    isbn: faker.random.alphaNumeric(10),
    topPage: faker.lorem.sentence(),
    bottomPage: faker.lorem.sentence(),
    copyrightLicense: 'SCL',
  },
}

export default {
  component: BookMetadataForm,
  title: 'BookMetadata/MetadataForm',
}