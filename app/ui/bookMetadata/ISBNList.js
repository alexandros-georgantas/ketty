import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input } from 'antd'

const IconWrapper = styled(Button)`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`

const ISBNList = ({ canChangeMetadata, name }) => {
  return (
    <Form.List name={name}>
      {(fields, { add, remove }) => {
        return (
          <div>
            {fields.map(({ name: fieldName, key, ...restField }) => (
              <div key={key}>
                <Form.Item
                  {...restField}
                  name={[fieldName, 'label']}
                  style={{ display: 'inline-block', width: 'calc(30% - 18px)' }}
                  // rules={[{ required: true, message: 'ISBN is required' }]}
                >
                  <Input disabled={!canChangeMetadata} placeholder="Label" />
                </Form.Item>
                <span style={{ display: 'inline-block', width: '10px' }} />
                <Form.Item
                  {...restField}
                  name={[fieldName, 'value']}
                  style={{ display: 'inline-block', width: 'calc(70% - 18px)' }}
                  // rules={[{ required: true, message: 'ISBN is required' }]}
                >
                  <Input
                    disabled={!canChangeMetadata}
                    placeholder="ISBN: update this value before exporting versions requiring unique identifier"
                  />
                </Form.Item>
                <Form.Item style={{ display: 'inline-block', width: '26px' }}>
                  <IconWrapper
                    disabled={!canChangeMetadata || fields.length < 2}
                    icon={
                      <MinusCircleTwoTone
                        twoToneColor={fields.length < 2 ? 'lightgrey' : 'red'}
                      />
                    }
                    onClick={() => {
                      if (fields.length > 1) remove(fieldName)
                    }}
                    type="danger"
                  />
                </Form.Item>
              </div>
            ))}

            <Form.Item style={{ textAlign: 'right' }} wrapperCol={{ span: 24 }}>
              <Button
                disabled={!canChangeMetadata}
                onClick={() => add()}
                type="dashed"
              >
                <PlusOutlined /> Add Another ISBN
              </Button>
            </Form.Item>
          </div>
        )
      }}
    </Form.List>
  )
}

ISBNList.propTypes = {
  canChangeMetadata: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
}

export default ISBNList
