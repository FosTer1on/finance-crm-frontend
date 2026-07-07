import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Space,
  Spin,
  Table,
  Typography,
  message,
} from "antd";
import { EditOutlined, PlusOutlined, SaveOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

import { useDenXanStore } from "@/store/denXan/denXanStore";
import { formatMoney } from "@/utils/formatMoney";

const { Title, Text } = Typography;

export default function DenXanPage({ company, onAfterChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const [drafts, setDrafts] = useState({});
  const [commentModal, setCommentModal] = useState(null);
  const [addModal, setAddModal] = useState(null);

  const {
    date,
    rows,
    summary,
    isLoading,
    isSubmitting,
    error,
    loadDaily,
    saveIncoming,
    addIncoming,
    saveOutgoing,
    saveIncomingComment,
    saveOutgoingComment,
  } = useDenXanStore();

  const dateValue = selectedDate.format("YYYY-MM-DD");

  useEffect(() => {
    if (!company?.id) return;

    loadDaily({
      company: company.id,
      date: dateValue,
    });
  }, [company?.id, dateValue, loadDaily]);

  useEffect(() => {
    const nextDrafts = {};

    rows.forEach((row) => {
      nextDrafts[row.id] = {
        total_amount: row.total_amount,
        mtg_amount: row.mtg_amount,
        outgoing_amount: row.outgoing_amount,
      };
    });

    setDrafts(nextDrafts);
  }, [rows]);

  const updateDraft = (rowId, field, value) => {
    setDrafts((prev) => ({
      ...prev,
      [rowId]: {
        ...prev[rowId],
        [field]: value ?? "0",
      },
    }));
  };

  const handleSaveIncoming = async (row) => {
    const draft = drafts[row.id];

    await saveIncoming(row.id, {
      total_amount: draft?.total_amount || "0",
      mtg_amount: draft?.mtg_amount || "0",
    });

    message.success("Приход сохранён");

    if (onAfterChange) {
      onAfterChange();
    }
  };

  const handleSaveOutgoing = async (row) => {
    const draft = drafts[row.id];

    await saveOutgoing(row.id, {
      outgoing_amount: draft?.outgoing_amount || "0",
    });

    message.success("Исход сохранён");

    if (onAfterChange) {
      onAfterChange();
    }
  };

  const handleSaveComment = async () => {
    if (!commentModal) return;

    if (commentModal.type === "incoming") {
      await saveIncomingComment(commentModal.row.id, commentModal.comment);
    } else {
      await saveOutgoingComment(commentModal.row.id, commentModal.comment);
    }

    setCommentModal(null);
    message.success("Комментарий сохранён");
  };

  const handleAddIncoming = async () => {
    if (!addModal) return;

    await addIncoming(addModal.row.id, {
      add_amount: addModal.add_amount || "0",
      add_mtg_amount: addModal.add_mtg_amount || "0",
    });

    setAddModal(null);
    message.success("Сумма добавлена");

    if (onAfterChange) {
      onAfterChange();
    }
  };

  const columns = useMemo(
    () => [
      {
        title: "",
        width: 56,
        render: (_, row) => (
          <Button
            size="small"
            icon={<PlusOutlined />}
            onClick={() =>
              setAddModal({
                row,
                add_amount: "0",
                add_mtg_amount: "0",
              })
            }
          />
        ),
      },
      {
        title: "Дистрибьютор",
        dataIndex: "distributor_name",
        width: 180,
      },
      {
        title: "Общая сумма",
        width: 210,
        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={drafts[row.id]?.total_amount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              parser={(value) => value?.replace(/\s/g, "") || "0"}
              onChange={(value) => updateDraft(row.id, "total_amount", value)}
            />

            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                setCommentModal({
                  type: "incoming",
                  row,
                  comment: row.incoming_comment || "",
                })
              }
            />
          </Space>
        ),
      },
      {
        title: "%",
        dataIndex: "service_percent",
        width: 70,
        render: (value) => Number(value).toFixed(0),
      },
      {
        title: "Прибыль",
        dataIndex: "profit_amount",
        width: 160,
        render: formatMoney,
      },
      {
        title: "MTG",
        width: 180,
        render: (_, row) => (
          <InputNumber
            min={0}
            style={{ width: 150 }}
            value={drafts[row.id]?.mtg_amount}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            }
            parser={(value) => value?.replace(/\s/g, "") || "0"}
            onChange={(value) => updateDraft(row.id, "mtg_amount", value)}
          />
        ),
      },
      {
        title: "Поступило на счет",
        dataIndex: "amount_to_account",
        width: 180,
        render: formatMoney,
      },
      {
        title: "Сохранить",
        width: 120,
        render: (_, row) => (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => handleSaveIncoming(row)}
          >
            Save
          </Button>
        ),
      },
      {
        title: "Сумма исхода",
        width: 210,
        render: (_, row) => (
          <Space>
            <InputNumber
              min={0}
              style={{ width: 150 }}
              value={drafts[row.id]?.outgoing_amount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              parser={(value) => value?.replace(/\s/g, "") || "0"}
              onChange={(value) =>
                updateDraft(row.id, "outgoing_amount", value)
              }
            />

            <Button
              size="small"
              icon={<EditOutlined />}
              onClick={() =>
                setCommentModal({
                  type: "outgoing",
                  row,
                  comment: row.outgoing_comment || "",
                })
              }
            />
          </Space>
        ),
      },
      {
        title: "Фирма исхода",
        dataIndex: "outgoing_company_name",
        width: 160,
      },
      {
        title: "Сохранить",
        width: 120,
        render: (_, row) => (
          <Button
            type="primary"
            icon={<SaveOutlined />}
            loading={isSubmitting}
            onClick={() => handleSaveOutgoing(row)}
          >
            Save
          </Button>
        ),
      },
    ],
    [drafts, isSubmitting]
  );

  if (isLoading) {
    return <Spin />;
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {error && (
        <Alert
          type="error"
          message="Ошибка"
          description={String(error)}
          showIcon
        />
      )}

      <Space>
        <Text strong>Дата:</Text>
        <DatePicker
          value={selectedDate}
          format="YYYY-MM-DD"
          onChange={(value) => {
            if (value) setSelectedDate(value);
          }}
        />
      </Space>

      <Card title={date ? dayjs(date).format("D MMMM") : "День"}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={rows}
          pagination={false}
          scroll={{ x: 1600 }}
        />

        {summary && (
          <Card size="small" style={{ marginTop: 16 }}>
            <Space wrap size="large">
              <Text>
                Прибыль: <b>{formatMoney(summary.profit)}</b>
              </Text>
              <Text>
                MTG: <b>{formatMoney(summary.mtg)}</b>
              </Text>
              <Text>
                На счет DEN XAN:{" "}
                <b>{formatMoney(summary.to_den_xan_account)}</b>
              </Text>
              <Text>
                Нужно отдать: <b>{formatMoney(summary.need_to_give)}</b>
              </Text>
              <Text>
                Сумма исходов: <b>{formatMoney(summary.outgoing_total)}</b>
              </Text>
            </Space>
          </Card>
        )}
      </Card>

      <Modal
        title={
          commentModal?.type === "incoming"
            ? "Комментарий прихода"
            : "Комментарий исхода"
        }
        open={Boolean(commentModal)}
        onCancel={() => setCommentModal(null)}
        onOk={handleSaveComment}
        confirmLoading={isSubmitting}
      >
        <Input.TextArea
          rows={5}
          value={commentModal?.comment}
          onChange={(event) =>
            setCommentModal((prev) => ({
              ...prev,
              comment: event.target.value,
            }))
          }
        />
      </Modal>

      <Modal
        title="Добавить поступление"
        open={Boolean(addModal)}
        onCancel={() => setAddModal(null)}
        onOk={handleAddIncoming}
        confirmLoading={isSubmitting}
      >
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
          <Card size="small">
            <Space direction="vertical" size={4}>
              <Text type="secondary">Дистрибьютор</Text>
              <Text strong>{addModal?.row?.distributor_name}</Text>

              <Text type="secondary">Текущая общая сумма</Text>
              <Text strong>
                {addModal ? formatMoney(addModal.row.total_amount) : "0 сум"}
              </Text>

              <Text type="secondary">Текущий MTG</Text>
              <Text strong>
                {addModal ? formatMoney(addModal.row.mtg_amount) : "0 сум"}
              </Text>
            </Space>
          </Card>

          <div>
            <Text strong>Сумма нового поступления</Text>
            <InputNumber
              min={0}
              style={{ width: "100%", marginTop: 6 }}
              placeholder="Например: 20 000 000"
              value={addModal?.add_amount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              parser={(value) => value?.replace(/\s/g, "") || "0"}
              onChange={(value) =>
                setAddModal((prev) => ({
                  ...prev,
                  add_amount: value,
                }))
              }
            />
          </div>

          <div>
            <Text strong>Дополнительный MTG</Text>
            <InputNumber
              min={0}
              style={{ width: "100%", marginTop: 6 }}
              placeholder="Если MTG нет — оставьте 0"
              value={addModal?.add_mtg_amount}
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
              }
              parser={(value) => value?.replace(/\s/g, "") || "0"}
              onChange={(value) =>
                setAddModal((prev) => ({
                  ...prev,
                  add_mtg_amount: value,
                }))
              }
            />
          </div>
        </Space>
      </Modal>
    </Space>
  );
}
