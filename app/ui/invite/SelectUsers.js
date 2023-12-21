import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import find from 'lodash/find'
import styled from 'styled-components'
import { Spin, Select } from '../common'

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/

const StyledSelect = styled(Select)`
  &.ant-select {
    width: 100%;
  }
`

const SelectUsers = ({
  fetchOptions,
  value,
  onChange,
  noResultsSetter,
  canChangeAccess,
}) => {
  const [unparsedSearch, setUnparsedSearch] = useState(null)
  const [fetching, setFetching] = useState(false)
  const [options, setOptions] = useState([])
  const fetchRef = useRef(0)
  const additionalSelectProps = {}

  if (unparsedSearch !== null) {
    // The first item in the search text has been auto selected
    // Reset the search value to reflect the remaining (unparsed) items
    additionalSelectProps.searchValue = unparsedSearch
  }

  const loadOptions = v => {
    // Split values on whitespace; the last value is incomplete OR ''
    const values = v.trimLeft().split(/\s+/g, 2)

    if (values.length > 1) {
      // Multiple values imply that the user hit space or enter OR that an email
      // like string was detected; in each of these cases, "v" will have an
      // appended whitespace character
      const currentSearch = values[0]
      fetchRef.current += 1
      const fetchId = fetchRef.current
      setOptions([])
      setFetching(true)
      fetchOptions(currentSearch).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        const userOptions = newOptions.map(user => ({
          label: user.displayName,
          value: user.id,
        }))

        if (userOptions.length === 0 && value.length === 0) {
          noResultsSetter(true)
        }

        if (userOptions.length === 1 && userOptions[0].value) {
          // Exact match of the search email
          const alreadyAdded = find(value, { value: userOptions[0].value })

          if (!alreadyAdded) {
            onChange([
              ...value,
              { ...userOptions[0], key: userOptions[0].value },
            ])
            value.push({ ...userOptions[0], key: userOptions[0].value })
            setOptions([])
            noResultsSetter(false)
            setUnparsedSearch(` ${v.slice(currentSearch.length).trimLeft()}`)
          }
        } else {
          setOptions(userOptions)
        }

        setFetching(false)
      })
    }
  }

  return (
    <StyledSelect
      {...additionalSelectProps}
      disabled={!canChangeAccess}
      filterOption={false}
      labelInValue
      mode="multiple"
      notFoundContent={fetching ? <Spin spinning /> : null}
      onDropdownVisibleChange={open => {
        if (!open && value.length === 0) {
          setOptions([])
          noResultsSetter(true)
        }
      }}
      onInputKeyDown={e => {
        if (e.keyCode === 13 || e.key === 'Enter') {
          // When user hits enter, try to load the current search item
          loadOptions(`${e.target.value} `)
          return
        }

        const values = e.target.value.trimLeft().split(/\s+/g, 2)

        if (values.length === 1) {
          // Search contains exactly one value and no partial search
          if (values[0].search(emailRegex) === 0) {
            // When the current search term looks like an email, try to load it
            loadOptions(`${values[0]}${e.key} `)
            return
          }
        }

        // The user is beginning a new search; clear the value of
        // "unparsedSearch" so that they can continue typing
        // If this value is not cleared, all keystrokes are blocked
        setUnparsedSearch(null)
      }}
      onSearch={loadOptions}
      options={options}
      placeholder="Email, comma separated"
      value={value}
    />
  )
}

SelectUsers.propTypes = {
  fetchOptions: PropTypes.func.isRequired,
  noResultsSetter: PropTypes.func.isRequired,
  value: PropTypes.arrayOf(
    PropTypes.shape({
      disabled: PropTypes.bool,
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      title: PropTypes.string,
      value: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func,
  canChangeAccess: PropTypes.bool.isRequired,
}

SelectUsers.defaultProps = {
  value: [],
  onChange: () => {},
}

export default SelectUsers
