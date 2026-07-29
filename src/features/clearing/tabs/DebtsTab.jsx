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

const getDirectionView = (direction) => {
  const normalizedDirection = String(direction || "").toUpperCase();

  if (normalizedDirection === "OWES_US") {
    return {
      label: "Нам должны",
      color: "green",
    };
  }

  if (normalizedDirection === "WE_OWE") {
    return {
      label: "Мы должны",
      color: "red",
    };
  }

  return {
    label: "Нет долга",
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

const formatCurrency = (value, currency) => {
  const formattedValue = formatMoney(value || 0);

  if (currency === "USD") {
    return `$${formattedValue}`;
  }

  return `${formattedValue} сум`;
};

const CurrencyBalance = ({ value, direction, currency }) => {
  const numericValue = Number(value || 0);
  const directionView = getDirectionView(direction);

  if (numericValue === 0) {
    return <Text type="secondary">—</Text>;
  }

  return (
    <Space direction="vertical" size={2}>
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
        {formatCurrency(value, currency)}
      </Text>

      <Tag color={directionView.color}>{directionView.label}</Tag>
    </Space>
  );
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
    createGroupPayment,
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

  const handlePaymentSubmit = async (payload) => {
    if (!paymentDebt || !selectedPerson) {
      return;
    }

    if (paymentDebt.group_key) {
      await createGroupPayment(selectedPerson.person_id, {
        person_id: selectedPerson.person_id,
        debt_date: paymentDebt.debt_date,
        debt_currency: paymentDebt.currency,
        ...payload,
      });
    } else {
      await createPayment(paymentDebt.id, selectedPerson.person_id, payload);
    }

    setPaymentDebt(null);
  };

  const handleManualDebtSubmit = async (payload) => {
    const personSummary = await createManualDebt(payload);

    setManualDebtOpen(false);

    if (personSummary?.person_id) {
      await selectPerson(personSummary.person_id);
    }
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

  const peopleColumns = useMemo(
    () => [
      {
        title: "Ответственное лицо",
        dataIndex: "person_name",
        key: "person_name",
        width: 180,
        render: (value, row) => (
          <Space direction="vertical" size={4}>
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
        title: "Баланс UZS",
        key: "balance_uzs",
        width: 170,
        align: "center",
        render: (_, row) => (
          <CurrencyBalance
            value={row.balance_uzs}
            direction={row.direction_uzs}
            currency="UZS"
          />
        ),
      },
      {
        title: "Баланс USD",
        key: "balance_usd",
        width: 150,
        align: "center",
        render: (_, row) => (
          <CurrencyBalance
            value={row.balance_usd}
            direction={row.direction_usd}
            currency="USD"
          />
        ),
      },
      {
        title: "Дней",
        dataIndex: "debts_count",
        key: "debts_count",
        width: 80,
        align: "center",
        render: (value) => <Badge count={value || 0} showZero />,
      },
      {
        title: "Операций",
        dataIndex: "operations_count",
        key: "operations_count",
        width: 90,
        align: "center",
        render: (value) => <Badge count={value || 0} showZero color="blue" />,
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

  const childColumns = useMemo(
    () => [
      {
        title: "Фирма",
        key: "company",
        width: 180,
        render: (_, row) => row.company_name || "Без фирмы",
      },
      {
        title: "Тип",
        dataIndex: "source_type",
        key: "source_type",
        width: 110,
        render: (value) => (value === "OPERATION" ? "Операция" : "Ручной долг"),
      },
      {
        title: "Направление",
        key: "direction",
        width: 120,
        render: (_, row) => {
          const view = getDirectionView(row.direction);

          return <Tag color={view.color}>{view.label}</Tag>;
        },
      },
      {
        title: "Первоначально",
        dataIndex: "original_amount",
        key: "original_amount",
        width: 150,
        align: "right",
        render: (value, row) => formatCurrency(value, row.currency),
      },
      {
        title: "Остаток",
        dataIndex: "remaining_amount",
        key: "remaining_amount",
        width: 150,
        align: "right",
        render: (value, row) => (
          <Text strong>{formatCurrency(value, row.currency)}</Text>
        ),
      },
      {
        title: "Курс USD",
        dataIndex: "usd_rate",
        key: "usd_rate",
        width: 120,
        align: "right",
        render: (value) => (value ? `${formatMoney(value)} сум` : "—"),
      },
      {
        title: "Срок",
        dataIndex: "due_date",
        key: "due_date",
        width: 105,
        render: formatDate,
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
    []
  );

  const groupColumns = useMemo(
    () => [
      {
        title: "Дата",
        dataIndex: "debt_date",
        key: "debt_date",
        width: 110,
        render: formatDate,
      },
      {
        title: "Валюта",
        dataIndex: "currency",
        key: "currency",
        width: 90,
        align: "center",
        render: (value) => (
          <Tag color={value === "USD" ? "blue" : "gold"}>{value}</Tag>
        ),
      },
      {
        title: "Итог",
        key: "direction",
        width: 130,
        render: (_, row) => {
          const view = getDirectionView(row.direction);

          return <Tag color={view.color}>{view.label}</Tag>;
        },
      },
      {
        title: "Остаток",
        dataIndex: "remaining_amount",
        key: "remaining_amount",
        width: 170,
        align: "right",
        render: (value, row) => (
          <Text strong>{formatCurrency(value, row.currency)}</Text>
        ),
      },
      {
        title: "Долгов в группе",
        dataIndex: "debts_count",
        key: "debts_count",
        width: 125,
        align: "center",
        render: (value) => <Badge count={value || 0} showZero />,
      },
      {
        title: "Ближайший срок",
        dataIndex: "due_date",
        key: "due_date",
        width: 130,
        render: (_, row) => {
          if (row.is_overdue) {
            return <Tag color="error">{formatDate(row.due_date)}</Tag>;
          }

          if (row.is_due_today) {
            return <Tag color="warning">Сегодня</Tag>;
          }

          return formatDate(row.due_date);
        },
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

              setPaymentDebt({
                ...row,
                person_id: selectedPerson?.person_id,
                person_name: selectedPerson?.person_name,
              });
            }}
          >
            Погасить итог
          </Button>
        ),
      },
    ],
    [selectedPerson]
  );

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
              onChange={setFilter}
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
        <Col xs={24} xl={10}>
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
              columns={peopleColumns}
              dataSource={debts}
              loading={isLoading}
              pagination={false}
              size="small"
              scroll={{
                x: 900,
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

        <Col xs={24} xl={14}>
          <Card
            title={
              selectedPerson
                ? `Долги: ${selectedPerson.person_name}`
                : "Детализация"
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
                style={{
                  width: "100%",
                }}
              >
                <Row gutter={[12, 12]}>
                  <Col xs={24} md={12}>
                    <Card size="small">
                      <Text type="secondary">Итоговый баланс UZS</Text>

                      <Title
                        level={4}
                        style={{
                          margin: "4px 0 8px",
                        }}
                      >
                        {formatCurrency(selectedPerson.balance_uzs, "UZS")}
                      </Title>

                      <Tag
                        color={
                          getDirectionView(selectedPerson.direction_uzs).color
                        }
                      >
                        {getDirectionView(selectedPerson.direction_uzs).label}
                      </Tag>
                    </Card>
                  </Col>

                  <Col xs={24} md={12}>
                    <Card size="small">
                      <Text type="secondary">Итоговый баланс USD</Text>

                      <Title
                        level={4}
                        style={{
                          margin: "4px 0 8px",
                        }}
                      >
                        {formatCurrency(selectedPerson.balance_usd, "USD")}
                      </Title>

                      <Tag
                        color={
                          getDirectionView(selectedPerson.direction_usd).color
                        }
                      >
                        {getDirectionView(selectedPerson.direction_usd).label}
                      </Tag>
                    </Card>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Card size="small">
                      <Text type="secondary">Дневных итогов</Text>

                      <Title
                        level={4}
                        style={{
                          margin: "4px 0 0",
                        }}
                      >
                        {selectedPerson.debts_count || 0}
                      </Title>
                    </Card>
                  </Col>

                  <Col xs={24} sm={8}>
                    <Card size="small">
                      <Text type="secondary">Исходных долгов</Text>

                      <Title
                        level={4}
                        style={{
                          margin: "4px 0 0",
                        }}
                      >
                        {selectedPerson.operations_count || 0}
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
                        style={{
                          margin: "4px 0 0",
                        }}
                      >
                        {selectedPerson.overdue_count || 0}
                      </Title>
                    </Card>
                  </Col>
                </Row>

                <Table
                  rowKey="group_key"
                  columns={groupColumns}
                  dataSource={selectedPerson.details || []}
                  pagination={false}
                  size="small"
                  scroll={{
                    x: 900,
                    y: 390,
                  }}
                  expandable={{
                    expandedRowRender: (group) => (
                      <Table
                        rowKey="id"
                        columns={childColumns}
                        dataSource={group.children || []}
                        pagination={false}
                        size="small"
                        scroll={{
                          x: 1100,
                        }}
                        locale={{
                          emptyText: "Нет исходных долгов",
                        }}
                      />
                    ),
                    rowExpandable: (group) =>
                      Array.isArray(group.children) &&
                      group.children.length > 0,
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
