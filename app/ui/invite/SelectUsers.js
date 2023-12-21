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
  const fetchRef = useRef(0)
  const additionalSelectProps = {}

  if (unparsedSearch !== null) {
    // The first item in the search text has been auto selected
    // Reset the search value to reflect the remaining (unparsed) items
    additionalSelectProps.searchValue = unparsedSearch
  }

  const processFirstSearch = v => {
    // Split values into the current search and the remaining unparsed searches
    const [currentSearch, unparsed] = v.trimLeft().split(/\s+/g, 2)

    // IF "unparsed" is defined, a search has been triggered:
    // The user hit space or enter OR currentSearch is an email like string
    if (unparsed !== undefined) {
      // This function clears the first search once it has been processed
      const removeFirstSearch = () =>
        setUnparsedSearch(` ${v.slice(currentSearch.length).trimLeft()}`)

      fetchRef.current += 1
      const fetchId = fetchRef.current
      setFetching(true)
      fetchOptions(currentSearch).then(newOptions => {
        if (fetchId !== fetchRef.current) {
          // for fetch callback order
          return
        }

        const userOptions = newOptions.map(user => ({
          label: user.displayName,
          value: user.id,
          key: user.id,
        }))

        if (userOptions.length === 0 && value.length === 0) {
          noResultsSetter(true)
        }

        if (userOptions.length === 1 && userOptions[0].value) {
          // Exact match of the search email
          const alreadyAdded = find(value, { value: userOptions[0].value })

          if (!alreadyAdded) {
            onChange([...value, userOptions[0]])
            value.push(userOptions[0])
            noResultsSetter(false)
            removeFirstSearch()
          }
        }

        if (userOptions.length === 0 && unparsed.trim()) {
          // The first search item has no matches AND there is a second item
          // waiting to be processed; clear the first search item
          removeFirstSearch()
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
          noResultsSetter(true)
        }
      }}
      onInputKeyDown={e => {
        if (e.keyCode === 13 || e.key === 'Enter') {
          // When user hits enter, try to load the current search item
          processFirstSearch(`${e.target.value} `)
          return
        }

        const values = e.target.value.trimLeft().split(/\s+/g, 2)

        if (values.length === 1) {
          // Search contains exactly one value and no partial search
          if (values[0].search(emailRegex) === 0) {
            // When the current search term looks like an email, try to load it
            processFirstSearch(`${values[0]}${e.key} `)
            return
          }
        }

        // The user is beginning a new search; clear the value of
        // "unparsedSearch" so that they can continue typing
        // If this value is not cleared, all keystrokes are blocked
        setUnparsedSearch(null)
      }}
      onSearch={processFirstSearch}
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
