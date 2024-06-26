import React, { useEffect, useState } from 'react';
import axios from "axios";
import DetailMobile from './Mobile';
import DetailComputer from './Computer';


const Detail = (props: any) => {
  const { title } = props
  const [terminal, setTerminal] = useState<string>('unkown'); // 使用终端

  useEffect(() => {
    if (!title) return
    document.title = `${title} - 时间线`
  }, [title])

  useEffect(() => {
    detectTerminal()
  }, [])

  // 识别使用终端
  const detectTerminal = () => {
    const userAgent = navigator.userAgent
    if (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|ipad|tablet|playbook/i.test(userAgent)) {
      setTerminal('mobile')
    } else if (/win32|win64|mac|macintosh|macintel|m68k|powerpc|sgi|sunspider|x11g|linux|unix|bsd/i.test(userAgent)) {
      setTerminal('pc')
    }
  }

  return (
    <>
      {
        terminal === 'pc' ? <DetailComputer {...props} /> : <DetailMobile {...props} />
      }
    </>
  )
};

export default Detail;

// 服务端获取数据
export const getServerSideProps = async (context: any) => {
  // 获取时间线的数据
  const { query: { value } } = context;
  const timelineData: any = await axios.get("https://www.wiseal.cn/timeline/create", {
    params: {
      query: value
    }
  });
  const timelineList = timelineData.data.data.eventRespVOList.map((item: any) => {
    return {
      label: item.time,
      children: item.eventInfo,
    }
  })

  // 获取相关话题数据
  const topicsListData: any = await axios.get("https://www.wiseal.cn/timeline/related-topic", {
    params: {
      query: value
    }
  });
  const topicsList = topicsListData.data.data.map((item: string, index: number) => {
    return {
      key: index + 1,
      label: item
    }
  })

  // 获取感兴趣数据
  const interestedData: any = await axios.get("https://www.wiseal.cn/timeline/recommend", {
    params: {
      query: value
    }
  });
  const interestedList = interestedData.data.data.map((item: any, index: number) => {
    return {
      key: index + 1,
      label: item.subject
    }
  })

  return {
    props: {
      title: value,
      timelineList,
      topicsList,
      interestedList
    }
  };
}