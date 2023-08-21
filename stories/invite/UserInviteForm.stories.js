/* eslint-disable no-console */
import React from 'react'
import { faker } from '@faker-js/faker'
import styled from 'styled-components'
import { UserInviteForm } from '../../app/ui'
import { Form } from '../../app/ui/common'
import { createData } from '../_helpers'

const FormWrapper = styled.div`
  display: flex;
  flex-direction: row;

  .ant-form-item {
    flex: 1;
  }
`

const usersCount = 10

async function fetchUserList(username) {
  return new Promise(resolve => {
    setTimeout(() => {
      const users = createData(usersCount, () => ({
        id: faker.datatype.uuid(),
        displayName: faker.name.fullName(),
      }))

      resolve(users)
    }, 1000)
  })
}

export const Base = () => {
  const [form] = Form.useForm()

  const handleInvite = values => console.log('Invite: ', values)

  return (
    <FormWrapper>
      <UserInviteForm
        fetchOptions={fetchUserList}
        form={form}
        onInvite={handleInvite}
      />
    </FormWrapper>
  )
}

export default {
  component: UserInviteForm,
  title: 'Invite/UserInviteForm',
}
