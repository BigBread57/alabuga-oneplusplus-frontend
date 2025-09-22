import type { BaseModel } from '@/models'
import type { FCC } from '@/types'
import { Divider, Skeleton } from 'antd'
import React from 'react'

import InfiniteScroll from 'react-infinite-scroll-component'
import { useInfinityFetchData } from '@/services/base/useInfinityFetchData'

type InfinityListComponentProps = {
  model: typeof BaseModel
  noDataText?: string
  renderList: (fetchedValues: Record<string, any>) => React.ReactNode
  height?: string | number
}

const scrollableDivStyle = (height: string | number = '100vh') => ({
  height,
  overflow: 'auto',
})

const InfinityListComponent: FCC<InfinityListComponentProps> = ({
  model,
  noDataText,
  renderList,
  height = '100vh',
}) => {
  const fetchedValues = useInfinityFetchData({
    model,
    qKeyPrefix: model.modelName,
  })

  return (
    <div id='scrollableDiv' style={scrollableDivStyle()}>
      <InfiniteScroll
        dataLength={fetchedValues?.rowData?.length}
        next={fetchedValues?.fetchNextPage}
        hasMore={!!fetchedValues?.hasNextPage}
        loader={(
          <Skeleton.Node active>
            <span>Загрузка...</span>
          </Skeleton.Node>
        )}
        endMessage={
          fetchedValues?.rowData?.length
            ? (
                <Divider plain>{noDataText || 'Больше нет'}</Divider>
              )
            : null
        }
        scrollableTarget='scrollableListGrid'
        height={height}
      >
        {renderList(fetchedValues)}
      </InfiniteScroll>
    </div>
  )
}

InfinityListComponent.displayName = 'InfinityListComponent'

export default InfinityListComponent
