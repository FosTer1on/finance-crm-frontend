import { useEffect } from "react";
import { Layout, Typography } from "antd";
import { Outlet } from "react-router-dom";

import WorkbookTabs from "@/components/layout/WorkbookTabs";
import { useCompanyStore } from "@/store/company/companyStore";

const { Header, Content } = Layout;
const { Title, Text } = Typography;

export default function MainLayout() {
  const { companies, loadCompanies } = useCompanyStore();

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
        background: "#f6f8fb",
      }}
    >
      <Header
        style={{
          background: "#fff",
          height: 60,
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 2px 10px rgba(15,23,42,.04)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            CRM транзакций
          </Title>

          <Text type="secondary">Финансовый контроль</Text>
        </div>
      </Header>

      <Content
        style={{
          padding: 28,
          paddingBottom: 70,
        }}
      >
        <div
          style={{
            maxWidth: 1700,
            margin: "0 auto",
          }}
        >
          <Outlet />
        </div>
      </Content>

      <WorkbookTabs companies={companies} />
    </Layout>
  );
}
