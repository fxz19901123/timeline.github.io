import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Input } from 'antd'
import Timeline from '@/components/Timeline';
import Recommend from '@/components/Recommend';
import { useRouter } from 'next/navigation';
import Layouts from '@/components/Layouts';
import axios from "axios";
import styles from './index.module.scss'
import { fontStyle } from 'html2canvas/dist/types/css/property-descriptors/font-style';
import { color } from 'html2canvas/dist/types/css/types/color';

const DetailMobile = (props: any) => {
  const { title, timelineList, topicsList, interestedList } = props

  const router = useRouter()

  const [searchValue, setSearchValue] = useState<string>(''); // 搜索关键词
  const [options, setOptions] = useState<any[]>([]); // 渐进式搜索数据

  useEffect(() => {
    setSearchValue(title)
  }, [title])

  // 渐进式搜索数据
  const searchSuggestReq = async (text: string) => {
    const data: any = await axios.get("https://www.wiseal.cn/timeline/suggest", {
      params: {
        query: text
      }
    });
    const newData = data?.data?.data?.map((item: any) => {
      return {
        value: item.subject,
        label: item.subject
      }
    })
    setOptions(newData || [])
  }

  // 回车搜索、点击按钮搜索
  const handleSearch = (v: string) => {
    if (!v) return
    router.push(`/detail?value=${v}`)
  }

  return (
    <Layouts>
      <div className={styles.contentWrap}>
        <div className={styles.searchInput}>
          {/* <Space> */}
          <AutoComplete
            onChange={(v) => { setSearchValue(v) }}
            value={searchValue}
            options={options}
            onSearch={searchSuggestReq}
            onSelect={(v) => { handleSearch(v) }}
            style={{ width: '70vw' }}
          >
            <Input
              placeholder="请输入关键词"
              allowClear
              style={{ height: '36px' }}
            // onPressEnter={() => {
            //   { handleSearch(searchValue) }
            // }}
            />
          </AutoComplete>
          <Button
            style={{ marginLeft: 6, height: '36px' }}
            type='primary'
            disabled={!searchValue}
            onClick={() => {
              handleSearch(searchValue)
            }}
          >
            生成
          </Button>
          {/* </Space> */}
        </div>
        <div className={styles.content}>
          <Timeline
            items={timelineList}
          // showMode='alternate' 
          />
          <div className={styles.recommendContent}>
            <Recommend
              topicsList={topicsList}
              interestedList={interestedList}
            />
          </div>
        </div>
      </div>
    </Layouts>
  )
};

export default DetailMobile;
