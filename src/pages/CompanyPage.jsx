import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Alert, Button, Card, Empty, Space, Spin, Tabs } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";

import { useCompanyStore } from "@store/company/companyStore";
import { useBankStore } from "@store/bank/bankStore";

import IncomingTab from "@/features/company/tabs/IncomingTab";
import OutgoingTab from "@/features/company/tabs/OutgoingTab";
import ExpenseTab from "@/features/company/tabs/ExpenseTab";
import DenXanPage from "@/features/company/den_xan/DenXanPage";

import CompanyAccountsCard from "@/components/company/CompanyAccountsCard";
import CompanyHeader from "@/components/company/CompanyHeader";

export default function CompanyPage() {
  const { id } = useParams();

  const [activeAccountId, setActiveAccountId] = useState(null);

  const {
    selectedCompany,
    isLoading: isCompanyLoading,
    error: companyError,
    loadCompanyById,
  } = useCompanyStore();

  const {
    accounts,
    allAccounts,
    totalBalance,
    isLoading: isAccountsLoading,
    isAllAccountsLoading,
    error: accountsError,
    loadAccounts,
    loadAllAccounts,
    clearAccounts,
  } = useBankStore();

  useEffect(() => {
    loadCompanyById(id);
    loadAccounts(id);
    loadAllAccounts();

    return () => {
      clearAccounts();
    };
  }, [id, loadCompanyById, loadAccounts, loadAllAccounts, clearAccounts]);

  useEffect(() => {
    const activeAccounts = accounts.filter((account) => account.is_active);

    if (activeAccounts.length === 0) {
      setActiveAccountId(null);
      return;
    }

    const accountStillExists = activeAccounts.some(
      (account) => Number(account.id) === Number(activeAccountId)
    );

    if (!accountStillExists) {
      setActiveAccountId(activeAccounts[0].id);
    }
  }, [accounts, activeAccountId]);

  const activeAccount = useMemo(
    () =>
      accounts.find(
        (account) => Number(account.id) === Number(activeAccountId)
      ) || null,
    [accounts, activeAccountId]
  );

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

  if (selectedCompany.schema_type === "den_xan") {
    return (
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        {accountsError && (
          <Alert
            type="error"
            message="Ошибка счетов"
            description={String(accountsError)}
            showIcon
          />
        )}

        <CompanyHeader
          company={selectedCompany}
          accounts={accounts}
          activeAccountId={activeAccountId}
          onAccountChange={setActiveAccountId}
          isLoadingAccounts={isAccountsLoading}
        />

        <DenXanPage
          company={selectedCompany}
          accounts={accounts}
          allAccounts={allAccounts}
          totalBalance={totalBalance}
          activeAccount={activeAccount}
          activeAccountId={activeAccountId}
          onAfterChange={async () => {
            await Promise.all([loadAccounts(id), loadAllAccounts()]);
          }}
        />
      </Space>
    );
  }

  const tabItems = [
    {
      key: "incoming",
      label: "Приходы",
      children: (
        <IncomingTab
          company={selectedCompany}
          accounts={accounts}
          onAfterStatusChange={() => loadAccounts(id)}
        />
      ),
    },
    {
      key: "outgoing",
      label: "Исходящие",
      children: (
        <OutgoingTab
          company={selectedCompany}
          accounts={accounts}
          onAfterStatusChange={() => loadAccounts(id)}
        />
      ),
    },
    {
      key: "expenses",
      label: "Прочие расходы",
      children: (
        <ExpenseTab
          company={selectedCompany}
          onAfterStatusChange={() => loadAccounts(id)}
        />
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
