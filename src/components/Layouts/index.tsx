import React, { useEffect, useState } from "react";
import { Layout, Select, Space } from "antd";
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import '../../../i18n/config'
import styles from './index.module.scss'

const option: any = {
  zh: [
    { value: "zh", label: "简体中文" },
    { value: "en", label: "英语" },
  ],
  en: [
    { value: "zh", label: "Chinese" },
    { value: "en", label: "English" },
  ],
};

const { Header, Content, Footer } = Layout

const LayoutGlobal = (props: any) => {
  const router = useRouter()
  const { children } = props
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState<string>('zh'); // 当前选择的语言

  // 切换语言
  const handleChange = (value: string) => {
    i18n.changeLanguage(value)
    setLanguage(value)
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lan = window.navigator.language !== 'zh-CN' ? 'en' : 'zh'
      handleChange(lan)
      setLanguage(lan)
    }
  }, [])

  return (
    <Layout style={{ height: '100%' }}>
      <Header className={styles.header}>
        <div className={styles.headerBox}>
          <div className={styles.logo}>
            <Image
              src="/logo.png"
              alt="logo"
              objectFit="cover"
              width={44}
              height={32}
            />
            <div className={styles.logoText} onClick={() => { router.push('/') }}>{t('gameName')}</div>
          </div>
          <Space size='middle'>
            <a
              style={{ color: '#000000E0' }}
              type='text'
              onClick={() => { router.push('/docs') }}
            >
              {t('docs')}
            </a>
            <Select
              style={{ width: '100px' }}
              value={language}
              onChange={handleChange}
              options={option[i18n.language]}
            />
          </Space>
        </div>
      </Header>
      <Content className={styles.content}>
        {children}
      </Content>
      {/* <Footer
        className={styles.footer}>
        TimeLine ©2024 Created by MuYou
      </Footer> */}
    </Layout>
  )
}

export default LayoutGlobal
