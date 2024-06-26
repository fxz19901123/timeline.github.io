import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './index.module.scss'

const Recommend = (props: any) => {
  const { topicsList, interestedList } = props

  const router = useRouter()

  return (
    <div className={styles.recommendWrap} >
      <div>
        <div className={styles.title}>相关话题</div>
        <div className={styles.partList}>
          {
            topicsList && topicsList.length ?
              topicsList.map((v: any) => (
                <div
                  key={v.key}
                  className={styles.partItem}
                  onClick={() => {
                    router.push(`/detail?value=${v.label}`)
                  }}
                >
                  {`${v.key}. ${v.label}`}
                </div>
              )) : null
          }
        </div>
      </div>
      <div>
        <div className={styles.title}>可能感兴趣</div>
        <div className={styles.partList}>
          {
            interestedList && interestedList.length ?
              interestedList.map((v: any) => (
                <div
                  key={v.key}
                  className={styles.partItem}
                  onClick={() => {
                    router.push(`/detail?value=${v.label}`)
                  }}
                >
                  {`${v.key}. ${v.label}`}
                </div>
              )) : null
          }
        </div>

      </div>
    </div>
  )
}

export default Recommend;