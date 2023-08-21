import React from 'react'
import { InfoCircleOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import styled from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  font-size: 12px;
  justify-content: space-between;
`

const UserStatus = ({ className }) => {
  return (
    <Wrapper className={className}>
      <Space size={4}>
        <InfoCircleOutlined />
        Only the book owner can add team members who are already signed up on
        the system, and can determine their permissions. Collaborators with Edit
        access can change book content or metadata and view export previews, but
        cannot download PDF or Epub files. Collaborators with View access cannot
        change book content or metadata or download PDF or Epub files, but can
        view export previews.
      </Space>
    </Wrapper>
  )
}

export default UserStatus
