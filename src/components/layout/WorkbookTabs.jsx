import { Button, Space } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

export default function WorkbookTabs({ companies = [], onAddCompany }) {
  const location = useLocation();
  const navigate = useNavigate();

  const isClearingActive = location.pathname === "/clearing";

  const getCompanyActive = (companyId) =>
    location.pathname === `/companies/${companyId}`;

  return (
    <div
      style={{
        position: "fixed",
        left: 16,
        right: 16,
        bottom: 14,

        height: 48,

        padding: "6px 12px",

        background: "rgba(255,255,255,.9)",

        backdropFilter: "blur(16px)",

        border: "1px solid #e5e7eb",

        borderRadius: 14,

        boxShadow: "0 10px 35px rgba(15,23,42,.12)",

        overflowX: "auto",

        whiteSpace: "nowrap",

        zIndex: 999,
      }}
    >
      <Space size={4}>
        <Button
          size="small"
          type={isClearingActive ? "primary" : "default"}
          onClick={() => navigate("/clearing")}
        >
          Взаиморасчёты
        </Button>

        {companies.map((company) => (
          <Button
            key={company.id}
            size="small"
            type={getCompanyActive(company.id) ? "primary" : "default"}
            onClick={() => navigate(`/companies/${company.id}`)}
          >
            {company.name}
          </Button>
        ))}

        <Button
          size="small"
          icon={<PlusOutlined />}
          disabled={!onAddCompany}
          onClick={onAddCompany}
        >
          Добавить
        </Button>
      </Space>
    </div>
  );
}
