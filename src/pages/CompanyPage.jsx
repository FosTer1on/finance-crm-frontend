import { useParams, Link } from "react-router-dom";
import {
  Button,
  Card,
  Descriptions,
  Space,
  Table,
  Tabs,
  Typography,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const formatMoney = (value) =>
  new Intl.NumberFormat("ru-RU").format(value) + " сум";

const mockCompany = {
  id: 1,
  name: "ASIA CONSTRUCT BUILDING",
  inn: "000000000",
  schema: "standard",
  accounts: [
    {
      id: 1,
      bank: "Kapitalbank",
      accountName: "Основной счет",
      balance: 125000000,
    },
  ],
};

const incomingColumns = [
  { title: "№", render: (_, __, index) => index + 1 },
  { title: "Фирма", dataIndex: "companyName" },
  { title: "ИНН", dataIndex: "inn" },
  { title: "Контакты", dataIndex: "contacts" },
  { title: "Человек", dataIndex: "personName" },
  {
    title: "Сумма",
    dataIndex: "amount",
    render: formatMoney,
  },
  { title: "%", dataIndex: "percent" },
  {
    title: "После %",
    dataIndex: "afterPercent",
    render: formatMoney,
  },
  { title: "Дата", dataIndex: "date" },
  { title: "Комментарий", dataIndex: "comment" },
];

const mockIncoming = [
  {
    key: 1,
    companyName: "TEST COMPANY",
    inn: "123456789",
    contacts: "+998 90 000 00 00",
    personName: "Али",
    amount: 10000000,
    percent: 6,
    afterPercent: 9400000,
    date: "02.07.2026",
    comment: "Тестовый приход",
  },
];

export default function CompanyPage() {
  const { id } = useParams();

  const tabItems = [
    {
      key: "incoming",
      label: "Приходы",
      children: (
        <Card
          title="Приходы"
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить приход
            </Button>
          }
        >
          <Title level={5}>02.07.2026</Title>

          <Table
            columns={incomingColumns}
            dataSource={mockIncoming}
            pagination={false}
            scroll={{ x: 1200 }}
          />

          <Card size="small" style={{ marginTop: 16 }}>
            <Space size="large">
              <Text>Общая сумма: {formatMoney(10000000)}</Text>
              <Text>После %: {formatMoney(9400000)}</Text>
              <Text>Кол-во: 1</Text>
            </Space>
          </Card>
        </Card>
      ),
    },
    {
      key: "outgoing",
      label: "Исходящие",
      children: (
        <Card
          title="Исходящие"
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить исходящий
            </Button>
          }
        >
          Пока пусто
        </Card>
      ),
    },
    {
      key: "report",
      label: "Отчёт по дню",
      children: <Card title="Отчёт по дню">Пока пусто</Card>,
    },
    {
      key: "expenses",
      label: "Прочие расходы",
      children: (
        <Card
          title="Прочие расходы"
          extra={
            <Button type="primary" icon={<PlusOutlined />}>
              Добавить расход
            </Button>
          }
        >
          Пока пусто
        </Card>
      ),
    },
    {
      key: "accounts",
      label: "Счета",
      children: <Card title="Банковские счета">Пока пусто</Card>,
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Link to="/">
        <Button icon={<ArrowLeftOutlined />}>Назад к фирмам</Button>
      </Link>

      <Card>
        <Title level={2} style={{ marginTop: 0 }}>
          {mockCompany.name}
        </Title>

        <Descriptions bordered column={3}>
          <Descriptions.Item label="ID">{id}</Descriptions.Item>
          <Descriptions.Item label="ИНН">{mockCompany.inn}</Descriptions.Item>
          <Descriptions.Item label="Схема">
            {mockCompany.schema}
          </Descriptions.Item>
          <Descriptions.Item label="Основной баланс">
            {formatMoney(mockCompany.accounts[0].balance)}
          </Descriptions.Item>
          <Descriptions.Item label="Банк">
            {mockCompany.accounts[0].bank}
          </Descriptions.Item>
          <Descriptions.Item label="Счёт">
            {mockCompany.accounts[0].accountName}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Tabs defaultActiveKey="incoming" items={tabItems} />
    </Space>
  );
}