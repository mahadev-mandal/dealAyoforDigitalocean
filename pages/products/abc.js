import React from 'react'
import { withAuth } from '../../HOC/withAuth'

function abc() {
  return (
    <div>abc</div>
  )
}

export default withAuth(abc)