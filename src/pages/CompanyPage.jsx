import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Alert,
  Button,
  Card,
  Col,
  Descriptions,
  Empty,
  Row,
  Space,
  Spin,
  Tabs,
  Typography,
  Tag,
} from "antd";
import { ArrowLeftOutlined, PlusOutlined } from "@ant-design/icons";
import { useCompanyStore } from "@store/company/companyStore";
import { formatMoney } from "@utils/formatMoney";
import { useBankStore } from "@store/bank/bankStore";
import IncomingTab from "@/features/company/tabs/IncomingTab";

const { Title, Text } = Typography;

export default function CompanyPage() {
  const { id } = useParams();

  const {
    selectedCompany,
    isLoading: isCompanyLoading,
    error: companyError,
    loadCompanyById,
  } = useCompanyStore();

  const {
    accounts,
    totalBalance,
    isLoading: isAccountsLoading,
    error: accountsError,
    loadAccounts,
    clearAccounts,
  } = useBankStore();

  useEffect(() => {
    loadCompanyById(id);
    loadAccounts(id);
  
    return () => {
      clearAccounts();
    };
  }, [id, loadCompanyById, loadAccounts, clearAccounts]);

  if (isCompanyLoading) {
    return <Spin />;
  }

  if (companyError) {
    return (
      <Alert
        type="error"
        message="Ошибка"
        description={String(companyError)}
        showIcon
      />
    );
  }

  if (!selectedCompany) {
    return <Empty description="Фирма не найдена" />;
  }

  const tabItems = [
    {
      key: "incoming",
      label: "Приходы",
      children: (
        <IncomingTab
          company={selectedCompany}
          onAfterStatusChange={() => loadAccounts(id)}
        />
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
      key: "report",
      label: "Отчёт",
      children: <Card title="Отчёт">Пока пусто</Card>,
    },
    {
      key: "accounts",
      label: "Счета",
      children: (
        <Card title="Банковские счета">
          {isAccountsLoading ? (
            <Spin />
          ) : accounts.length === 0 ? (
            <Empty description="Счета не найдены" />
          ) : (
            <Row gutter={[16, 16]}>
              {accounts.map((account) => (
                <Col xs={24} md={12} lg={8} key={account.id}>
                  <Card size="small">
                    <Space direction="vertical" size={4}>
                      <Text strong>{account.bank_name}</Text>
                      <Text>Название счёта: {account.account_name}</Text>
                      <Text type="secondary">
                        Номер счёта: {account.account_number || "Не указан"}
                      </Text>
                      <Text strong>{formatMoney(account.balance)}</Text>
                    </Space>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </Card>
      ),
    },
  ];

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Link to="/">
        <Button icon={<ArrowLeftOutlined />}>Назад к фирмам</Button>
      </Link>

      {accountsError && (
        <Alert
          type="error"
          message="Ошибка счетов"
          description={String(accountsError)}
          showIcon
        />
      )}

      <Card>
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <div>
            <Title level={2} style={{ marginTop: 0, marginBottom: 8 }}>
              {selectedCompany.name}
            </Title>

            <Tag
              color={
                selectedCompany.schema_type === "den_xan" ? "purple" : "blue"
              }
            >
              {selectedCompany.schema_type}
            </Tag>
          </div>

          <Descriptions bordered column={3}>
            <Descriptions.Item label="ID">
              {selectedCompany.id}
            </Descriptions.Item>
            <Descriptions.Item label="ИНН">
              {selectedCompany.inn}
            </Descriptions.Item>
            <Descriptions.Item label="Активна">
              {selectedCompany.is_active ? "Да" : "Нет"}
            </Descriptions.Item>
            <Descriptions.Item label="Общий баланс" span={3}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Text strong>{formatMoney(totalBalance)}</Text>

                {accounts.length > 0 && (
                  <Space
                    direction="vertical"
                    size="small"
                    style={{ width: "100%" }}
                  >
                    {accounts.map((account) => (
                      <Card size="small" key={account.id}>
                        <Space direction="vertical" size={2}>
                          <Text strong>{account.bank_name}</Text>
                          <Text>Название счёта: {account.account_name}</Text>
                          <Text type="secondary">
                            Номер счёта: {account.account_number || "Не указан"}
                          </Text>
                          <Text strong>
                            Баланс: {formatMoney(account.balance)}
                          </Text>
                        </Space>
                      </Card>
                    ))}
                  </Space>
                )}
              </Space>
            </Descriptions.Item>
          </Descriptions>
        </Space>
      </Card>

      <Tabs defaultActiveKey="incoming" items={tabItems} />
    </Space>
  );
}
