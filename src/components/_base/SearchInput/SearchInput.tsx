import type { FCC } from '@/types'
import { SearchOutlined } from '@ant-design/icons'
import { Button, Form, Input, Space } from 'antd'
import debounce from 'lodash/debounce'

import React, { useCallback, useEffect, useMemo } from 'react'

import styles from './SearchInput.module.scss'

type SearchInputProps = {
  searchStr?: string
  onSearch: (value: string) => void
}

const SearchInput: FCC<SearchInputProps> = ({ searchStr, onSearch }) => {
  const [form] = Form.useForm()

  // Используем useMemo для мемоизации debounced функции
  const debouncedOnSearch = useMemo(() => debounce(onSearch, 800), [onSearch])

  const handleSubmit = useCallback(() => {
    const { search } = form.getFieldsValue()
    debouncedOnSearch(search)
  }, [form, debouncedOnSearch])

  // Очищаем таймер при размонтировании компонента
  useEffect(() => {
    return () => {
      debouncedOnSearch.cancel()
    }
  }, [debouncedOnSearch])

  useEffect(() => {
    // необходимо для того, чтобы при изменении фильтров,
    // начальные значения устанавливались заново
    form.setFieldsValue({
      search: searchStr,
    })
  }, [searchStr, form])

  const handleInputChange = useCallback(() => {
    handleSubmit()
  }, [handleSubmit])

  return (
    <Form
      form={form}
      initialValues={{
        search: searchStr,
      }}
      layout="inline"
      className={styles.formContainer}
    >
      <Space direction="horizontal" size={0}>
        <Form.Item name="search">
          <Input
            className={styles.inputContainer}
            size="large"
            allowClear
            placeholder="Поиск..."
            onChange={handleInputChange}
          />
        </Form.Item>
        <div className={styles.searchBtn}>
          <Button size="large" icon={<SearchOutlined />} onClick={handleSubmit}>
            Поиск
          </Button>
        </div>
      </Space>
    </Form>
  )
}

export default SearchInput
