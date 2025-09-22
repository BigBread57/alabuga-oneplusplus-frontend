---
to: <%= absPath %>/<%= h.changeCase.pascal(component_name) %>.tsx
---
import React from 'react'
import styles from './<%= h.changeCase.pascal(component_name) %>.module.scss'
import type { FCC } from 'src/types'

interface <%= component_name %>Props {
  prop?: any
}

const <%= h.changeCase.pascal(component_name) %>: FCC<<%= component_name %>Props> = ({prop}) => {
  return <div className={styles.container} data-testid='test-<%= component_name %>'><%= h.changeCase.pascal(component_name) %></div>
}

<%= h.changeCase.pascal(component_name) %>.displayName = '<%= h.changeCase.pascal(component_name) %>'

export default <%= h.changeCase.pascal(component_name) %>