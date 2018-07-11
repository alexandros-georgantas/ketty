import PropTypes from 'prop-types'
import React from 'react'
import classNames from 'classnames'
import classes from './StateIndicator.local.scss'

const mapping = {
  '-1': 'not_started',
  '0': 'started',
  '1': 'completed',
}
const stateIndicator = ({ state, withEnd }) => (
  <svg
    className={classes.svg}
    viewBox="0 0 100 10"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line
      id="line"
      stroke={mapping[state] !== 'completed' ? '#C4C4C4' : '#4A90E2'}
      x1="10%"
      x2={withEnd ? '90%' : '100%'}
      y1="49%"
      y2="49%"
    />

    <path
      className={classes.start}
      d="M6.95 0l4.95 4.95L6.95 9.9 2 4.95 6.95 0z"
      fill={mapping[state] === 'not_started' ? '#C4C4C4' : '#4A90E2'}
      id="start"
    />

    <path
      className={classNames(classes.end, {
        [classes.visible]: withEnd,
      })}
      d="M6.95 0l4.95 4.95L6.95 9.9 2 4.95 6.95 0z"
      fill={mapping[state] !== 'completed' ? '#C4C4C4' : '#4A90E2'}
      id="end"
    />

    <path
      className={classNames(classes.symbol, {
        [classes.visible]: mapping[state] === 'started',
      })}
      d="M3.01 2l3.626 2.367-.142 1.252L2.297 8 2 7.012l3.757-2.089-3.234-1.949L3.01 2zM8.374 2L12 4.367l-.143 1.252L7.661 8l-.297-.988 3.756-2.089-3.233-1.949L8.374 2z"
      fill="#4A90E2"
      id="symbol"
    />
  </svg>
)

stateIndicator.propTypes = {
  state: PropTypes.string.isRequired,
  withEnd: PropTypes.bool.isRequired,
}

export default stateIndicator
