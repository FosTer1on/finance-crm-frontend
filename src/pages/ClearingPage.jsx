import {
  Space,
  Tabs,
  Typography,
} from "antd";

import MainTab from "@/features/clearing/tabs/MainTab";
import ReportTab from "@/features/clearing/tabs/ReportTab";

const { Title, Text } = Typography;

export default function ClearingPage() {
  const items = [
    {
      key: "main",
      label: "Главная",
      children: <MainTab />,
    },
    {
      key: "report",
      label: "Отчёт",
      children: <ReportTab />,
    },
  ];

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{ width: "100%" }}
    >
      <div>
        <Title
          level={2}
          style={{ marginBottom: 4 }}
        >
          Взаиморасчёты
        </Title>

        <Text type="secondary">
          Переводы между фирмами и расчёты по ответственным лицам
        </Text>
      </div>

      <Tabs
        defaultActiveKey="main"
        items={items}
        destroyInactiveTabPane={false}
      />
    </Space>
  );
}