import type { FC } from 'react'
import { Drawer } from 'antd'

export interface NodeInfoDrawerProps {
  visible: boolean
  nodeId: string | null
  onClose: () => void
}

const NodeInfoDrawer: FC<NodeInfoDrawerProps> = ({
  visible,
  nodeId,
  onClose,
}) => {
  return (
    <Drawer
      title='Информация о ноде'
      placement='right'
      width={600}
      open={visible}
      onClose={onClose}
      destroyOnHidden
    >
      <div>
        <h3>Node ID: {nodeId}</h3>
        {/* Здесь будет содержимое drawer'а */}
        <p>Содержимое drawer'а будет добавлено позже</p>
      </div>
    </Drawer>
  )
}

export default NodeInfoDrawer
