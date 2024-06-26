import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Input } from 'antd';
import { useRouter } from 'next/navigation';
import Layouts from '@/components/Layouts';
import axios from "axios";
import styles from './index.module.scss'

const Home = (props: any) => {
  const { data } = props

  const router = useRouter()

  const [options, setOptions] = useState<any[]>([]); // 渐进式搜索数据
  const [searchValue, setSearchValue] = useState<string>(''); // 搜索关键词

  useEffect(() => {
    document.title = '时间线'
  }, [])

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
    router.push(`/detail?value=${v}`)
  }

  return (
    <div className="App">
      <Layouts>
        <div className={styles.contentWrap}>
          <div className={styles.titleBlock}>
            <h1 className={styles.title}>时间线</h1>
            <div className={styles.searchInput} >
              <AutoComplete
                onChange={(v) => { setSearchValue(v) }}
                value={searchValue}
                options={options}
                onSearch={searchSuggestReq}
                onSelect={(v) => { handleSearch(v) }}
                style={{ width: '100%' }}
              >
                <Input
                  size='large'
                  placeholder="你想了解……"
                  allowClear
                  style={{ width: '100%' }}
                // onPressEnter={() => {
                //   { handleSearch(searchValue) }
                // }}
                />
              </AutoComplete>
              <Button
                type='primary'
                disabled={!searchValue}
                size='large'
                onClick={() => {
                  handleSearch(searchValue)
                }}
                style={{ marginLeft: '6px' }}
              >
                AI 生成
              </Button>
            </div>
            <div className={styles.hot}>
              <p className={styles.hotTitle}>你可能感兴趣:</p>
              <div className={styles.hotList}>
                {
                  data && data.length ?
                    data.map((v: any) => (
                      <div
                        onClick={() => {
                          handleSearch(v.label)
                        }}
                        className={styles.list}
                        key={v.key}
                      >
                        {`${v.key}. ${v.label}`}
                      </div>
                    )) : null
                }
              </div>
            </div>
          </div>
        </div>
      </Layouts>
    </div>
  )
};

export default Home;

// 服务端获取数据
export const getServerSideProps = async () => {
  // 获取首页'可能感兴趣'的数据
  const data: any = await axios.get("https://www.wiseal.cn/timeline/latest");
  const newData = data.data.data.map((item: any, index: number) => ({
    key: index + 1,
    label: item.subject
  }))
  return {
    props: {
      data: newData,
    }
  };
}