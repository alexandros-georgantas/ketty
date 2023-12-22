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
  const [unresolvedSearch, setUnresolvedSearch] = useState(null)
  const [fetching, setFetching] = useState(false)
  const fetchRef = useRef(0)
  const additionalSelectProps = {}

  if (unresolvedSearch !== null) {
    // The last item in the search text has been auto selected
    // Reset the search value to reflect the remaining (unresolved) items
    additionalSelectProps.searchValue = unresolvedSearch
  }

  const processLastSearch = searchString => {
    // Split values into the last search and previous unresolved searches
    const searchStrings = searchString.trim().split(/\s+/g)

    // Lookup only the most recently entered search
    const lastSearch = searchStrings[searchStrings.length - 1]

    // This function clears the last search once it has been processed
    const removeLastSearch = () =>
      setUnresolvedSearch(
        ` ${searchString
          .slice(0, searchString.length - lastSearch.length)
          .trim()} `,
      )

    fetchRef.current += 1
    const fetchId = fetchRef.current
    setFetching(true)
    fetchOptions(lastSearch).then(newOptions => {
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
          removeLastSearch()
        }
      }

      setFetching(false)
    })
  }

  return (
    <StyledSelect
      {...additionalSelectProps}
      disabled={!canChangeAccess}
      filterOption={false}
      labelInValue
      mode="multiple"
      notFoundContent={fetching ? <Spin spinning /> : null}
      onChange={newValue => {
        onChange(newValue)

        if (newValue.length === 0) {
          noResultsSetter(true)
        } else {
          noResultsSetter(false)
        }
      }}
      onDropdownVisibleChange={open => {
        if (!open && value.length === 0) {
          noResultsSetter(true)
        }
      }}
      onInputKeyDown={e => {
        // Do nothing if there is no search text
        const trimmedSearch = e.target.value.trim()

        if (trimmedSearch) {
          // If user hits enter: process the last search
          if (e.keyCode === 13 || e.key === 'Enter') {
            processLastSearch(trimmedSearch)
            return
          }

          // If user hits space (cursor after search): process the last search
          const isWhiteSpace = !e.key.trim()

          const isCursorAfterSearches =
            e.target.selectionStart >= e.target.value.trimRight().length

          if (isWhiteSpace && isCursorAfterSearches) {
            processLastSearch(trimmedSearch)
            return
          }

          // If last search looks like email address, process it
          // Ignore control keys (eg: alt, back, ctrl, delete etc)
          if (e.keyCode > 40 && isCursorAfterSearches) {
            const searchString = [
              e.target.value.slice(0, e.target.selectionStart),
              e.key,
              e.target.value.slice(e.target.selectionStart),
            ].join('')

            const values = searchString.split(/\s+/g)

            if (
              values.length &&
              values[values.length - 1].search(emailRegex) === 0
            ) {
              processLastSearch(searchString)
              return
            }
          }
        }

        // The user is beginning or updating a search; clear the value of
        // "unresolvedSearch" so that they can continue typing
        // If this value is not set to null, all keystrokes are blocked
        setUnresolvedSearch(null)
      }}
      onSearch={searchString => {
        /* const values = searchString.trim().split(/\s+/g)

        if (
          values.length &&
          values[values.length - 1].search(emailRegex) === 0
        ) {
          // TODO - if you need to edit the email after a typo, this could
          // trigger a search per input character. Restore debounce?
          processLastSearch(searchString.trim())
          return
        } */
      }}
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
