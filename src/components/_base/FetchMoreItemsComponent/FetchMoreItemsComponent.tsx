import type { BaseModel } from '@/models'
import type { FCC } from '@/types'
import { Button, Col, Divider, Row, Spin, Typography } from 'antd'

import React, { useMemo } from 'react'
import { useApiOptions } from '@/hooks/useApiOptions'
import { useInfinityFetchData } from '@/services/base/useInfinityFetchData'

import styles from './FetchMoreItemsComponent.module.scss'

const { Text } = Typography

type FetchMoreItemsComponentProps = {
  model: typeof BaseModel
  defFilters?: Record<string, any>
  options?: Record<string, any>
  extra?: ({
    isLoading,
    isFetching,
  }: {
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  renderItems: ({
    data,
    dataCount,
    fetchNextPage,
    isLoading,
    isFetching,
    refetch,
  }: {
    data: any[]
    fetchNextPage: () => void
    refetch: () => void
    dataCount: number
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  lengthPostfixPlural?: string
  optionsFieldList?: (string | Record<string, string[]>)[]
}

const FetchMoreItemsComponent: FCC<FetchMoreItemsComponentProps> = ({
  model: Model,
  defFilters,
  renderItems,
  options,
  lengthPostfixPlural,
  optionsFieldList,
  extra,
}) => {
  const {
    rowData,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    dataCount,
    refetch,
  }: any = useInfinityFetchData({
    model: Model,
    defFilters,
    options,
  })

  const { mergeOptionsIntoData } = useApiOptions(
    Model.modelName,
    optionsFieldList,
  )

  const rData = useMemo(
    () => rowData?.map((item: any) => mergeOptionsIntoData(item)),
    [rowData, mergeOptionsIntoData],
  )
  return (
    <>
      <Row gutter={40}>
        <Col span={24} className={styles.dataLengthContainer}>
          <Text strong>
            {isLoading ? 'Ищем..' : `Найдено ${dataCount || 0} `}
          </Text>
          {lengthPostfixPlural}
        </Col>
      </Row>
      {extra?.({
        isLoading,
        isFetching,
      })}
      <Spin spinning={isLoading} />
      {renderItems({
        data: rData,
        fetchNextPage,
        dataCount,
        isFetching,
        isLoading,
        refetch,
      })}
      {hasNextPage
        ? (
            <Row justify='center' className={styles.fetchMoreBtnWrapper}>
              <Button
                type='dashed'
                danger
                loading={isFetching}
                onClick={fetchNextPage}
              >
                Показать еще
              </Button>
            </Row>
          )
        : null}
      {!hasNextPage && dataCount ? <Divider>Больше нет</Divider> : null}
    </>
  )
}

FetchMoreItemsComponent.displayName = 'FetchMoreItemsComponent'

export default FetchMoreItemsComponent
