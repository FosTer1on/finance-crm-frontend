import { Card, Tabs } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import MainTab from "./tabs/MainTab";

dayjs.locale("ru");

export default function DenXanPage({ company, onAfterChange }) {
  const tabItems = [
    {
      key: "main",
      label: "Главная",
      children: <MainTab company={company} onAfterChange={onAfterChange} />,
    },
    {
      key: "expenses",
      label: "Прочие расходы",
      children: <Card>Скоро сделаем прочие расходы</Card>,
    },
    {
      key: "reports",
      label: "Отчёт",
      children: <Card>Скоро сделаем отчёт</Card>,
    },
    {
      key: "accounts",
      label: "Счета",
      disabled: true,
      children: null,
    },
  ];

  return <Tabs defaultActiveKey="main" items={tabItems} />;
}