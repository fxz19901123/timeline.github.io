// 引入i18next
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// 引入需要的语言文件
import en from "./en.json";
import zh from "./zh.json";

// 使用i18next.init初始化i18next
i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: en,
        },
        zh: {
            translation: zh,
        },
    },
    lng: "zh", // 默认语言
    fallbackLng: "zh", // 后备语言
    interpolation: {
        escapeValue: false, // 是否转义值
    },
});

export default i18n;
