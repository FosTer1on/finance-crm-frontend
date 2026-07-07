import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useCompanyStore } from "@/store/company/companyStore";

export default function CompanyBottomTabs() {
  const { id } = useParams();
  const { companies, loadCompanies } = useCompanyStore();

  useEffect(() => {
    if (companies.length === 0) {
      loadCompanies();
    }
  }, [companies.length, loadCompanies]);

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        height: 48,
        background: "#fff",
        borderTop: "1px solid #d9d9d9",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 6,
        zIndex: 100,
        overflowX: "auto",
      }}
    >
      {companies.map((company) => {
        const active = String(company.id) === String(id);

        return (
          <Link key={company.id} to={`/companies/${company.id}`}>
            <Button
              size="small"
              type={active ? "primary" : "default"}
              style={{ borderRadius: "6px 6px 0 0" }}
            >
              {company.name}
            </Button>
          </Link>
        );
      })}

      <Button size="small" icon={<PlusOutlined />} disabled>
        Добавить
      </Button>
    </div>
  );
}