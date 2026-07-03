import { Link } from "react-router-dom";
import { formatMoney } from "@utils/formatMoney";

export const getOutgoingColumns = ({ renderStatus }) => {
  return [
    { title: "№", render: (_, __, index) => index + 1 },
    {
      title: "Получатель",
      dataIndex: "receiver_company_name",
      render: (value, record) => {
        if (record.partner_to_company) {
          return <Link to={`/companies/${record.partner_to_company}`}>{value}</Link>;
        }

        return value || "-";
      },
    },
    { title: "ИНН", dataIndex: "receiver_inn" },
    { title: "Контакты", dataIndex: "receiver_contacts" },
    { title: "Человек", dataIndex: "person_name" },
    { title: "Сумма", dataIndex: "amount", render: formatMoney },
    { title: "%", dataIndex: "service_percent" },
    { title: "После %", dataIndex: "amount_after_percent", render: formatMoney },
    { title: "Дата", dataIndex: "transaction_date" },
    {
      title: "Статус",
      dataIndex: "status",
      render: renderStatus,
    },
    { title: "Комментарий", dataIndex: "comment" },
  ];
};