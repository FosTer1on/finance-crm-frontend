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
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        height: 38,
        padding: "4px 10px",
        background: "#fff",
        borderTop: "1px solid #d9d9d9",
        overflowX: "auto",
        whiteSpace: "nowrap",
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
