import { formatMoney } from "@utils/formatMoney";

export const getExpenseColumns = ({ renderStatus }) => [
  { title: "№", render: (_, __, index) => index + 1 },
  { title: "Название расхода", dataIndex: "name" },
  { title: "Сумма", dataIndex: "amount", render: formatMoney },
  { title: "Дата", dataIndex: "expense_date" },
  {
    title: "Статус",
    dataIndex: "status",
    render: renderStatus,
  },
  { title: "Комментарий", dataIndex: "comment" },
];