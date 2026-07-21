import { formatMoney } from "@/shared/utils/formatMoney";

export const getIncomingColumns = ({ company, renderStatus }) => {
  const statusColumn = {
    title: "Статус",
    dataIndex: "status",
    render: renderStatus,
  };

  if (company?.schema_type === "den_xan") {
    return [
      { title: "№", render: (_, __, index) => index + 1 },
      { title: "Дистрибьютор", dataIndex: "distributor_name" },
      { title: "Общая сумма", dataIndex: "amount", render: formatMoney },
      { title: "%", dataIndex: "service_percent" },
      { title: "Прибыль", dataIndex: "profit_amount", render: formatMoney },
      { title: "MTG", dataIndex: "mtg_amount", render: formatMoney },
      { title: "DEN XAN GROUP", dataIndex: "company_amount", render: formatMoney },
      { title: "Дата", dataIndex: "transaction_date" },
      statusColumn,
      { title: "Комментарий", dataIndex: "comment" },
    ];
  }

  return [
    { title: "№", render: (_, __, index) => index + 1 },
    { title: "Фирма", dataIndex: "counterparty_name" },
    { title: "ИНН", dataIndex: "counterparty_inn" },
    { title: "Контакты", dataIndex: "counterparty_contacts" },
    { title: "Человек", dataIndex: "person_name" },
    { title: "Сумма", dataIndex: "amount", render: formatMoney },
    { title: "%", dataIndex: "service_percent" },
    { title: "После %", dataIndex: "amount_after_percent", render: formatMoney },
    { title: "Дата", dataIndex: "transaction_date" },
    statusColumn,
    { title: "Комментарий", dataIndex: "comment" },
  ];
};