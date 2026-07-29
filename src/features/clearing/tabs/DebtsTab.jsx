import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Row,
  Segmented,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  PlusOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

import { useClearingDebtStore } from "@/store/clearing/clearingDebtStore";
import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";

import { formatMoney } from "@/shared/utils/formatMoney";
import { formatUsd } from "@/features/clearing/utils/formatCurrency";

import DebtPaymentModal from "@/features/clearing/modals/DebtPaymentModal";
import ManualDebtModal from "@/features/clearing/modals/ManualDebtModal";

const { Title, Text } = Typography;

const FILTER_OPTIONS = [
  {
    label: "Все",
    value: "all",
  },
  {
    label: "Просроченные",
    value: "overdue",
  },
  {
    label: "На сегодня",
    value: "due-today",
  },
];

const getDirectionView = (row) => {
  const direction = String(row?.direction || "").toUpperCase();

  if (direction === "OWES_US") {
    return {
      label: "Нам должны",
      color: "green",
    };
  }

  if (direction === "WE_OWE") {
    return {
      label: "Мы должны",
      color: "red",
    };
  }

  return {
    label: "Закрыто",
    color: "default",
  };
};

const formatDate = (value) => {
  if (!value) {
    return "—";
  }

  const [year, month, day] = value.split("-");

  if (!year || !month || !day) {
    return value;
  }

  return `${day}.${month}.${year}`;
};

export default function DebtsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [paymentDebt, setPaymentDebt] = useState(null);
  const [manualDebtOpen, setManualDebtOpen] = useState(false);

  const {
    debts,
    selectedPerson,

    isLoading,
    isLoadingPerson,
    isSubmitting,
    error,

    loadDebts,
    selectPerson,
    createManualDebt,
    createPayment,
    clearSelectedPerson,
    clearDebts,
  } = useClearingDebtStore();

  const { people, companies, loadPeople, loadCompanies, clearDirectories } =
    useClearingDirectoryStore();

  useEffect(() => {
    loadPeople();
    loadCompanies();

    return () => {
      clearDirectories();
      clearDebts();
    };
  }, [loadPeople, loadCompanies, clearDirectories, clearDebts]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      clearSelectedPerson();

      loadDebts({
        search: search.trim(),
        filter,
      });
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search, filter, loadDebts, clearSelectedPerson]);

  const handleFilterChange = (value) => {
    setFilter(value);
  };

  const handlePaymentSubmit = async (payload) => {
    if (!paymentDebt || !selectedPerson) {
      return;
    }

    await createPayment(paymentDebt.id, selectedPerson.person_id, payload);

    setPaymentDebt(null);
  };

  const handleReload = async () => {
    await loadDebts({
      search: search.trim(),
      filter,
    });

    if (selectedPerson?.person_id) {
      await selectPerson(selectedPerson.person_id);
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "Ответственное лицо",
        dataIndex: "person_name",
        key: "person_name",
        width: 140,
        render: (value, row) => (
          <Space direction="vertical" size={2}>
            <Text strong>{value}</Text>

            <Space size={6} wrap>
              {row.has_overdue && (
                <Tag color="error" icon={<ClockCircleOutlined />}>
                  Просрочено: {row.overdue_count}
                </Tag>
              )}

              {row.has_due_today && (
                <Tag color="warning" icon={<CalendarOutlined />}>
                  Сегодня: {row.due_today_count}
                </Tag>
              )}
            </Space>
          </Space>
        ),
      },
      {
        title: "Направление",
        dataIndex: "direction",
        key: "direction",
        width: 90,
        render: (_, row) => {
          const view = getDirectionView(row);

          return <Tag color={view.color}>{view.label}</Tag>;
        },
      },
      {
        title: "Баланс",
        dataIndex: "balance",
        key: "balance",
        width: 90,
        align: "center",
        render: (value, row) => {
          const directionView = getDirectionView(row);

          return (
            <Text
              strong
              type={
                directionView.color === "red"
                  ? "danger"
                  : directionView.color === "green"
                  ? "success"
                  : undefined
              }
            >
              {formatMoney(value)}
            </Text>
          );
        },
      },
      {
        title: "Долгов",
        dataIndex: "debts_count",
        key: "debts_count",
        width: 85,
        align: "center",
        render: (value) => <Badge count={value || 0} showZero />,
      },
      {
        title: "Ближайший срок",
        dataIndex: "nearest_due_date",
        key: "nearest_due_date",
        width: 130,
        render: formatDate,
      },
    ],
    []
  );

  const detailColumns = useMemo(
    () => [
      {
        title: "Фирма",
        key: "company",
        width: 170,
        render: (_, row) =>
          row.company_name || row.company?.name || "Без фирмы",
      },
      {
        title: "Дата",
        dataIndex: "debt_date",
        key: "debt_date",
        width: 105,
        render: formatDate,
      },
      {
        title: "Направление",
        key: "direction",
        width: 120,
        render: (_, row) => {
          const view = getDirectionView({
            direction: row.direction,
            signed_balance:
              row.direction === "receivable"
                ? row.remaining_amount
                : -Number(row.remaining_amount || 0),
          });

          return <Tag color={view.color}>{view.label}</Tag>;
        },
      },
      {
        title: "Первоначально",
        dataIndex: "original_amount",
        key: "original_amount",
        width: 150,
        align: "right",
        render: formatMoney,
      },
      {
        title: "Остаток",
        dataIndex: "remaining_amount",
        key: "remaining_amount",
        width: 150,
        align: "right",
        render: (value) => <Text strong>{formatMoney(value)}</Text>,
      },
      {
        title: "Курс USD",
        dataIndex: "usd_rate",
        key: "usd_rate",
        width: 115,
        align: "right",
        render: (value) => (value ? formatMoney(value) : "—"),
      },
      {
        title: "Остаток USD",
        key: "remaining_usd",
        width: 125,
        align: "right",
        render: (_, row) => {
          const remainingAmount = Number(row.remaining_amount || 0);
          const usdRate = Number(row.usd_rate || 0);

          if (!usdRate) {
            return "—";
          }

          return formatUsd(remainingAmount / usdRate);
        },
      },
      {
        title: "Срок",
        dataIndex: "due_date",
        key: "due_date",
        width: 105,
        render: formatDate,
      },
      {
        title: "Действия",
        key: "actions",
        width: 120,
        fixed: "right",
        render: (_, row) => (
          <Button
            size="small"
            type="primary"
            onClick={(event) => {
              event.stopPropagation();
              setPaymentDebt(row);
            }}
          >
            Погасить
          </Button>
        ),
      },
      {
        title: "Комментарий",
        dataIndex: "comment",
        key: "comment",
        width: 220,
        ellipsis: true,
        render: (value) => value || "—",
      },
    ],
    [setPaymentDebt]
  );

  const selectedDirection = selectedPerson
    ? getDirectionView(selectedPerson)
    : null;

  const handleManualDebtSubmit = async (payload) => {
    const personSummary = await createManualDebt(payload);

    setManualDebtOpen(false);

    if (personSummary?.person_id) {
      await selectPerson(personSummary.person_id);
    }
  };

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {error && (
        <Alert
          type="error"
          message="Ошибка"
          description={
            typeof error === "string" ? error : JSON.stringify(error)
          }
          showIcon
        />
      )}

      <Card size="small">
        <Row gutter={[12, 12]} align="middle">
          <Col flex="auto">
            <Input
              value={search}
              allowClear
              placeholder="Поиск по имени"
              onChange={(event) => {
                setSearch(event.target.value);
              }}
            />
          </Col>

          <Col>
            <Segmented
              value={filter}
              options={FILTER_OPTIONS}
              onChange={handleFilterChange}
            />
          </Col>

          <Col>
            <Button
              icon={<ReloadOutlined />}
              loading={isLoading}
              onClick={handleReload}
            >
              Обновить
            </Button>
          </Col>

          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setManualDebtOpen(true)}
            >
              Добавить долг
            </Button>
          </Col>
        </Row>
      </Card>

      <Row gutter={[16, 16]} align="stretch">
        <Col xs={24} xl={9}>
          <Card
            title="Ответственные лица"
            styles={{
              body: {
                padding: 0,
              },
            }}
          >
            <Table
              rowKey="person_id"
              columns={columns}
              dataSource={debts}
              loading={isLoading}
              pagination={false}
              size="small"
              scroll={{
                x: 820,
                y: 540,
              }}
              locale={{
                emptyText: <Empty description="Открытых долгов нет" />,
              }}
              rowClassName={(row) =>
                Number(selectedPerson?.person_id) === Number(row.person_id)
                  ? "ant-table-row-selected"
                  : ""
              }
              onRow={(row) => ({
                onClick: () => {
                  selectPerson(row.person_id);
                },
                style: {
                  cursor: "pointer",
                },
              })}
            />
          </Card>
        </Col>

        <Col xs={24} xl={15}>
          <Card
            title={
              selectedPerson
                ? `Долги: ${selectedPerson.person_name}`
                : "Детализация"
            }
            extra={
              selectedPerson && selectedDirection ? (
                <Space>
                  <Tag color={selectedDirection.color}>
                    {selectedDirection.label}
                  </Tag>

                  <Text strong>{formatMoney(selectedPerson.balance)}</Text>
                </Space>
              ) : null
            }
          >
            {isLoadingPerson ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  padding: 60,
                }}
              >
                <Spin />
              </div>
            ) : !selectedPerson ? (
              <Empty description="Выберите человека в таблице слева" />
            ) : (
              <Space
                direction="vertical"
                size="middle"
                style={{ width: "100%" }}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} sm={8}>
                    <Card size="small">
                      <Text type="secondary">Общий остаток</Text>

                      <Title level={4} style={{ margin: "4px 0 0" }}>
                        {formatMoney(selectedPerson.balance)}
                      </Title>
                    </Card>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Card size="small">
                      <Text type="secondary">Открытых долгов</Text>

                      <Title level={4} style={{ margin: "4px 0 0" }}>
                        {selectedPerson.debts_count || 0}
                      </Title>
                    </Card>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Card size="small">
                      <Text type="secondary">Просроченных</Text>

                      <Title
                        level={4}
                        type={
                          selectedPerson.overdue_count ? "danger" : undefined
                        }
                        style={{ margin: "4px 0 0" }}
                      >
                        {selectedPerson.overdue_count || 0}
                      </Title>
                    </Card>
                  </Col>
                </Row>

                <Table
                  rowKey="id"
                  columns={detailColumns}
                  dataSource={selectedPerson.details || []}
                  pagination={false}
                  size="small"
                  scroll={{
                    x: 1250,
                    y: 390,
                  }}
                  locale={{
                    emptyText: "Нет открытых долгов",
                  }}
                />
              </Space>
            )}
          </Card>
        </Col>
      </Row>
      <DebtPaymentModal
        open={Boolean(paymentDebt)}
        debt={paymentDebt}
        loading={isSubmitting}
        onCancel={() => setPaymentDebt(null)}
        onSubmit={handlePaymentSubmit}
      />
      <ManualDebtModal
        open={manualDebtOpen}
        people={people}
        companies={companies}
        loading={isSubmitting}
        onCancel={() => setManualDebtOpen(false)}
        onSubmit={handleManualDebtSubmit}
      />
    </Space>
  );
}
