import React, { useEffect, useState } from 'react';
import { Timeline, Watermark } from "antd";
import styles from './index.module.scss'

const TimelinePro = (props: any) => {
  const { items, showMode } = props

  const [timelineItems, setTimelineItems] = useState<any[]>(items); // 数据

  useEffect(() => {
    if (items && items.length) {
      const newItems = items.map((item: any) => ({
        children: (
          <>
            <div className={styles.lineLabel} >{item.label}</div>
            <div className={styles.lineChild} >{item.children}</div>
          </>
        ),
        dot: <div className={styles.lineDot} />
      }))
      setTimelineItems(newItems)
    }
  }, [items])

  return (
    <div className={styles.lineWrap} >
      <Watermark
        content='time-line.wiseal.cn'
        gap={[150, 150]}
        width={200}
        font={{ fontSize: 18 }}
      >
        <Timeline items={timelineItems} mode={showMode === 'alternate' ? 'alternate' : undefined} />
      </Watermark>
    </div>
  )
}

export default TimelinePro;