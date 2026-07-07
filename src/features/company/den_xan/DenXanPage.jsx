import { useEffect, useState } from "react";
import {
  Alert,
  Card,
  DatePicker,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";

import { useDenXanStore } from "@/store/denXan/denXanStore";

import DenXanTable from "./components/DenXanTable";
import DenXanSummary from "./components/DenXanSummary";
import CommentModal from "./modals/CommentModal";
import AddIncomingModal from "./modals/AddIncomingModal";

const { Text } = Typography;

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
        service_percent: row.service_percent,
        mtg_amount: row.mtg_amount,
        outgoing_amount: row.outgoing_amount,
        outgoing_percent: row.outgoing_percent,
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
      service_percent: draft?.service_percent || "6.00",
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
      outgoing_percent: draft?.outgoing_percent || "9.00",
      outgoing_partner_id: row.outgoing_partner || null,
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
        <DenXanTable
          rows={rows}
          drafts={drafts}
          isSubmitting={isSubmitting}
          updateDraft={updateDraft}
          onAdd={(row) =>
            setAddModal({
              row,
              add_amount: "0",
              add_mtg_amount: "0",
            })
          }
          onIncomingComment={(row) =>
            setCommentModal({
              type: "incoming",
              row,
              comment: row.incoming_comment || "",
            })
          }
          onOutgoingComment={(row) =>
            setCommentModal({
              type: "outgoing",
              row,
              comment: row.outgoing_comment || "",
            })
          }
          onSaveIncoming={handleSaveIncoming}
          onSaveOutgoing={handleSaveOutgoing}
        />

        <DenXanSummary summary={summary} />
      </Card>

      <CommentModal
        open={Boolean(commentModal)}
        modal={commentModal}
        loading={isSubmitting}
        onCancel={() => setCommentModal(null)}
        onChange={(comment) =>
          setCommentModal((prev) => ({
            ...prev,
            comment,
          }))
        }
        onSave={handleSaveComment}
      />

      <AddIncomingModal
        open={Boolean(addModal)}
        modal={addModal}
        loading={isSubmitting}
        onCancel={() => setAddModal(null)}
        onChange={(field, value) =>
          setAddModal((prev) => ({
            ...prev,
            [field]: value,
          }))
        }
        onSave={handleAddIncoming}
      />
    </Space>
  );
}
