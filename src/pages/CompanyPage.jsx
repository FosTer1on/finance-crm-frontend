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
import CompanyAccountsCard from "@/components/company/CompanyAccountsCard";
import CompanyHeader from "@/components/company/CompanyHeader";

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
        <CompanyAccountsCard
          accounts={accounts}
          totalBalance={totalBalance}
          isLoading={isAccountsLoading}
        />
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

      <CompanyHeader company={selectedCompany} totalBalance={totalBalance} />

      <Tabs defaultActiveKey="incoming" items={tabItems} />
    </Space>
  );
}
