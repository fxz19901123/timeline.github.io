import React, { useEffect, useState } from 'react';
import { Button, AutoComplete, Input, Row, Col, Divider, Select, Space, Modal } from 'antd';
import Layouts from '@/components/Layouts';
import Timeline from '@/components/Timeline';
import Recommend from '@/components/Recommend';
import html2canvas from 'html2canvas'
import { useRouter } from 'next/navigation';
import axios from "axios";
import styles from './index.module.scss'

const showOptions = [
  {
    label: "单侧展示",
    value: "left",
  },
  {
    label: "交错展示",
    value: "alternate",
  },
  // {
  //   label: "右侧展示",
  //   value: "right",
  // },
];

const DetailComputer = (props: any) => {
  const { title, timelineList, topicsList, interestedList } = props

  const router = useRouter()

  const [searchValue, setSearchValue] = useState<string>(''); // 搜索关键词
  const [showMode, setShowMode] = useState<string>('alternate'); // 时间线展示方式
  const [options, setOptions] = useState<any[]>([]); // 渐进式搜索数据
  const [open, setOpen] = useState<boolean>(false); // 导出窗口状态
  const [countdown, setCountdown] = useState<number>(8); // 导出倒计时

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

  // 导出图片
  const handleExport = () => {
    const exportDom = document.getElementById("timelineExport");
    if (exportDom) {
      html2canvas(exportDom, {
        scale: 2
      }).then((canvas: any) => {
        let dataURL = canvas.toDataURL("image/png");
        if (dataURL !== "") {
          var img = dataURL;
          var alink = document.createElement("a");
          alink.href = img;
          alink.download = new Date().getTime() + ".png";
          alink.click();
        }
      });
    }
  }

  useEffect(() => {
    if (!open) return
    const timer = setInterval(() => {
      if (countdown > 1) {
        setCountdown(countdown - 1);
      } else {
        clearInterval(timer);
        handleExport();
        setOpen(false)
        setCountdown(8)
      }
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, [countdown, open]);

  return (
    <Layouts>
      <div className={styles.contentWrap}>
        <div className={styles.searchInput} >
          <Space align='start'>
            <AutoComplete
              onChange={(v) => { setSearchValue(v) }}
              value={searchValue}
              options={options}
              onSearch={searchSuggestReq}
              onSelect={(v) => { handleSearch(v) }}
              style={{ width: '400px' }}
            >
              <Input
                placeholder="请输入关键词"
                allowClear
                style={{ height: '36px' }}
              // onPressEnter={() => {
              //   handleSearch(searchValue)
              // }}
              />
            </AutoComplete>
            <Button
              type='primary'
              disabled={!searchValue}
              style={{ height: '36px' }}
              onClick={() => {
                handleSearch(searchValue)
              }}
            >
              立即生成
            </Button>
          </Space>
        </div>
        <Row wrap={false} style={{ height: '100%' }}>
          <Col flex='auto' >
            <div className={styles.timelinePart}>
              <div className={styles.timelineHeader}>
                <div className={styles.title}>{title}</div>
                <Space>
                  <Select
                    value={showMode}
                    options={showOptions}
                    style={{ width: '100px' }}
                    onChange={(v) => {
                      setShowMode(v)
                    }}
                  />
                  <Button type='primary' onClick={() => { setOpen(true) }}>导出图片</Button>
                </Space>
              </div>
              <div className={styles.timelineContent} id='timelineExport'>
                <Timeline items={timelineList} showMode={showMode} />
              </div>
            </div>
          </Col>
          <Divider type='vertical' style={{ height: '100%', margin: '0 24px' }} />
          <Col flex='400px' >
            <div className={styles.recommendContent}>
              <Recommend
                topicsList={topicsList}
                interestedList={interestedList}
              />
            </div>
          </Col>
        </Row>
      </div>
      <Modal
        title={false}
        centered
        open={open}
        onCancel={() => setOpen(false)}
        footer={false}
        closable={false}
        width={'70%'}
      >
        <div>
          <div className={styles.countdown}>
            {`正在导出中，倒计时 ${countdown} 秒`}
          </div>
          <div className={styles.placeholder}></div>
        </div>
      </Modal>
    </Layouts>
  )
};

export default DetailComputer;