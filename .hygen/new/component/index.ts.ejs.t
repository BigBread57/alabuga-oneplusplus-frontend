---
to: <%= absPath %>/index.ts
---
import <%= h.changeCase.pascal(component_name) %> from './<%= h.changeCase.pascal(component_name) %>'

export { <%= h.changeCase.pascal(component_name) %> }
