'use client'

import type { BaseModel } from '@/models'
import type { FCC } from '@/types'
import { Button, Col, Divider, Row, Spin, Typography } from 'antd'

import { useTranslations } from 'next-intl'
import React, { useMemo } from 'react'
import { useApiOptions } from '@/hooks/useApiOptions'

import { useInfinityFetchData } from '@/services/base/useInfinityFetchData'
import styles from './FetchMoreItemsComponent.module.scss'

const { Text } = Typography

type FetchMoreItemsComponentProps = {
  baseURL?: string
  model: typeof BaseModel
  defFilters?: Record<string, any>
  options?: Record<string, any>
  extra?: ({
    isLoading,
    isFetching,
    refetch,
  }: {
    refetch: () => void
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  renderItems: ({
    data,
    mergedOptionsIntoData,
    dataCount,
    fetchNextPage,
    isLoading,
    isFetching,
    refetch,
  }: {
    data: any[]
    mergedOptionsIntoData: any[]
    fetchNextPage: () => void
    refetch: () => void
    dataCount: number
    isLoading: boolean
    isFetching: boolean
  }) => React.ReactNode
  lengthPostfixPlural?: string
  optionsFieldList?: (string | Record<string, string[]>)[]
  isClearRender?: boolean
  isParentCounter?: boolean
}

const FetchMoreItemsComponent: FCC<FetchMoreItemsComponentProps> = ({
  model: Model,
  defFilters,
  renderItems,
  options,
  lengthPostfixPlural,
  optionsFieldList,
  extra,
  isClearRender,
  isParentCounter,
  baseURL,
}) => {
  const t = useTranslations('FetchMoreItemsComponent')
  const {
    rowData: rawData = [],
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    dataCount,
    refetch,
  }: any = useInfinityFetchData({
    baseURL,
    model: Model,
    defFilters,
    options,
  })

  const { mergeOptionsIntoData } = useApiOptions(
    Model.modelName,
    optionsFieldList,
  )

  const rData = useMemo(
    () => rawData?.map((item: any) => mergeOptionsIntoData(item)),
    [rawData, mergeOptionsIntoData],
  )

  if (isClearRender) {
    // когда нужно просто подгрузить данные
    return renderItems({
      data: rawData,
      mergedOptionsIntoData: rData,
      fetchNextPage,
      dataCount,
      isFetching,
      isLoading,
      refetch,
    })
  }

  return (
    <>
      {!isParentCounter
        ? (
            <Row gutter={40}>
              <Col span={24} className={styles.dataLengthContainer}>
                <Text strong>
                  {isLoading ? t('loading') : `${t('found')} ${dataCount || 0}`}
                </Text>
                {lengthPostfixPlural}
              </Col>
            </Row>
          )
        : null}
      {extra?.({
        isLoading,
        isFetching,
        refetch,
      })}
      <Spin spinning={isLoading} />
      {renderItems({
        data: rawData,
        mergedOptionsIntoData: rData,
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
      {!hasNextPage && dataCount
        ? (
            <Divider>{t('no_more_items')}</Divider>
          )
        : null}
    </>
  )
}

FetchMoreItemsComponent.displayName = 'FetchMoreItemsComponent'

export default FetchMoreItemsComponent
