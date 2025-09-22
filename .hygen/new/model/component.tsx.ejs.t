---
to: src/models/<%= h.changeCase.pascalCase(model_name) %>.ts
---
import { BaseModel } from 'src/models/Base'

import type { BaseModelProps } from '@/models/Base'

export interface <%= h.changeCase.pascalCase(model_name) %>ModelProps extends BaseModelProps {
  name: string
}

export class <%= h.changeCase.pascalCase(model_name) %>Model extends BaseModel {
  static modelName = '<%= h.changeCase.camelCase(model_name) %>'

  static url() {
    return '<%= url %>'
  }
}
