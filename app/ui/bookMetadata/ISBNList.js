import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { isEmpty } from 'lodash'
import { MinusCircleTwoTone, PlusOutlined } from '@ant-design/icons'
import { Button, Form } from 'antd'
import ISBNInput from './ISBNInput'

const IconWrapper = styled(Button)`
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
  }
`

const ISBNList = ({ canChangeMetadata, name }) => {
  return (
    <Form.List
      name={name}
      rules={[
        {
          validator: async (_, rows) => {
            if (!isEmpty(rows)) {
              // Identify duplicate
              const values = {}
              const duplicates = []
              rows.forEach(row => {
                if (row) {
                  const trimmedValue = (row.value || '').trim()
                  values[trimmedValue] = (values[trimmedValue] || 0) + 1

                  if (values[trimmedValue] === 2) {
                    duplicates.push(trimmedValue)
                  }
                }
              })

              if (!isEmpty(duplicates)) {
                return Promise.reject(
                  new Error(`Duplicate ISBN values: ${duplicates.join(', ')}`),
                )
              }
            }

            // The ISBN list is valid
            return Promise.resolve()
          },
        },
      ]}
    >
      {(fields, { add, remove }, { errors }) => {
        return (
          <div>
            {fields.map(field => (
              <div key={field.key}>
                <ISBNInput
                  canChangeMetadata={canChangeMetadata}
                  field={field}
                  name="label"
                  placeholder="Label"
                  style={{ width: 'calc(30% - 18px)' }}
                />
                <span style={{ display: 'inline-block', width: '10px' }} />
                <ISBNInput
                  canChangeMetadata={canChangeMetadata}
                  field={field}
                  name="value"
                  placeholder="ISBN: update this value before exporting versions requiring unique identifier"
                  style={{ width: 'calc(70% - 18px)' }}
                  // rules={[{ required: true, message: 'ISBN is required' }]}
                />
                <Form.Item style={{ display: 'inline-block', width: '26px' }}>
                  <IconWrapper
                    disabled={!canChangeMetadata}
                    icon={
                      canChangeMetadata ? (
                        <MinusCircleTwoTone twoToneColor="red" />
                      ) : (
                        <MinusCircleTwoTone twoToneColor="lightgrey" />
                      )
                    }
                    onClick={() => {
                      remove(field.name)
                    }}
                    type="danger"
                  />
                </Form.Item>
              </div>
            ))}
            <Form.Item
              style={{ marginBottom: '0px', textAlign: 'right' }}
              wrapperCol={{ span: 24 }}
            >
              <Button
                disabled={!canChangeMetadata}
                onClick={() => add()}
                type="dashed"
              >
                <PlusOutlined /> Add{fields.length < 1 ? '' : ' Another'} ISBN
              </Button>
            </Form.Item>
            <Form.Item style={{ paddingLeft: '1em' }} wrapperCol={{ span: 24 }}>
              <Form.ErrorList errors={errors} />
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
