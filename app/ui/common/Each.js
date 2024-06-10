import { Children } from 'react'

const Each = ({ render, of, condition, fallback = null }) =>
  condition ? Children.toArray(of.map((item, i) => render(item, i))) : fallback

export default Each
