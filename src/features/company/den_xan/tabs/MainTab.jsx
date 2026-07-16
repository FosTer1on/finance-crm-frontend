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
import { usePartnerStore } from "@/store/partner/partnerStore";

import DenXanTable from "../components/DenXanTable";
import DenXanSummary from "../components/DenXanSummary";
import CommentModal from "../modals/CommentModal";
import AddIncomingModal from "../modals/AddIncomingModal";
import CreatePartnerModal from "../modals/CreatePartnerModal";
import PartnerInfoModal from "../modals/PartnerInfoModal";
import DenXanRates from "../components/DenXanRates";
import { useDenXanExpenseStore } from "@/store/denXanExpense/denXanExpenseStore";

const { Text } = Typography;

export default function MainTab({ company, onAfterChange }) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [drafts, setDrafts] = useState({});
  const [commentModal, setCommentModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [partnerModal, setPartnerModal] = useState(null);
  const [partnerInfoModal, setPartnerInfoModal] = useState(null);
  const [rateDraft, setRateDraft] = useState({
    den_xan_rate: null,
    street_rate: null,
  });

  const {
    day,
    date,
    rows,
    summary,
    isLoading,
    isSubmitting,
    error,
    loadDaily,
    saveRates,
    saveIncoming,
    addIncoming,
    saveOutgoing,
    saveIncomingComment,
    saveOutgoingComment,
  } = useDenXanStore();

  const {
    partners,
    loadPartners,
    clearPartners,
    createPartner,
    updatePartner,
    isSubmitting: isPartnerSubmitting,
  } = usePartnerStore();

  const reloadCurrentExpenses = useDenXanExpenseStore(
    (state) => state.reloadCurrentExpenses
  );

  const dateValue = selectedDate.format("YYYY-MM-DD");

  useEffect(() => {
    if (!company?.id) return;

    loadDaily({ company: company.id, date: dateValue });
    loadPartners(company.id);

    return () => {
      clearPartners();
    };
  }, [company?.id, dateValue, loadDaily, loadPartners, clearPartners]);

  useEffect(() => {
    setRateDraft({
      den_xan_rate: day?.den_xan_rate ?? null,
      street_rate: day?.street_rate ?? null,
    });
  }, [day]);

  useEffect(() => {
    const nextDrafts = {};

    const defaultPartner = partners.find(
      (partner) => partner.is_default
    );

    rows.forEach((row) => {
      nextDrafts[row.id] = {
        total_amount: row.total_amount,
        service_percent: row.service_percent,
        mtg_amount: row.mtg_amount,
        outgoing_amount: row.outgoing_amount,
        outgoing_percent: row.outgoing_percent,
        outgoing_partner_id: row.outgoing_partner || defaultPartner?.id || null,
      };
    });

    setDrafts(nextDrafts);
  }, [rows, partners]);

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
      service_percent:
        draft?.service_percent || "6.00",
    });
  
    await reloadCurrentExpenses();
  
    message.success("Приход сохранён");
    onAfterChange?.();
  };

  const handleSaveOutgoing = async (row) => {
    const draft = drafts[row.id];
  
    await saveOutgoing(row.id, {
      outgoing_amount:
        draft?.outgoing_amount || "0",
      outgoing_percent:
        draft?.outgoing_percent || "9.00",
      outgoing_partner_id:
        draft?.outgoing_partner_id || null,
    });
  
    await reloadCurrentExpenses();
  
    message.success("Исход сохранён");
    onAfterChange?.();
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
      add_mtg_amount:
        addModal.add_mtg_amount || "0",
    });
  
    await reloadCurrentExpenses();
  
    setAddModal(null);
    message.success("Сумма добавлена");
    onAfterChange?.();
  };

  const handleUpdatePartner = async () => {
    if (!partnerInfoModal?.id) return;

    if (!partnerInfoModal.name?.trim()) {
      message.error("Введите название фирмы");
      return;
    }

    await updatePartner(partnerInfoModal.id, {
      name: partnerInfoModal.name,
      inn: partnerInfoModal.inn || "",
      contacts: partnerInfoModal.contacts || "",
      comment: partnerInfoModal.comment || "",
    });

    setPartnerInfoModal(null);
    message.success("Фирма исхода обновлена");
  };

  const handleCreatePartner = async () => {
    if (!partnerModal?.name?.trim()) {
      message.error("Введите название фирмы");
      return;
    }

    await createPartner({
      from_company_id: company.id,
      name: partnerModal.name,
      service_percent: null,
      inn: partnerModal.inn || "",
      comment: partnerModal.comment || "",
    });

    setPartnerModal(null);
    message.success("Фирма исхода создана");
  };

  const handleSaveRates = async () => {
    if (!day?.id) {
      message.error("Рабочий день не найден");
      return;
    }

    if (!rateDraft.den_xan_rate || !rateDraft.street_rate) {
      message.error("Введите оба курса");
      return;
    }

    await saveRates(day.id, {
      den_xan_rate: rateDraft.den_xan_rate,
      street_rate: rateDraft.street_rate,
    });

    message.success("Курсы сохранены");
  };

  if (isLoading) return <Spin />;

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

      <Space style={{ display: "flex", justifyContent: "space-between" }}>
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
        <DenXanRates
          rates={rateDraft}
          loading={isSubmitting}
          onChange={(field, value) =>
            setRateDraft((prev) => ({
              ...prev,
              [field]: value,
            }))
          }
          onSave={handleSaveRates}
        />
      </Space>

      <Card title={date ? dayjs(date).format("D MMMM") : "День"}>
        <DenXanTable
          rows={rows}
          drafts={drafts}
          partners={partners}
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
          onPartnerInfo={(partnerId) => {
            const partner = partners.find((item) => item.id === partnerId);

            if (!partner) {
              message.error("Выберите фирму исхода");
              return;
            }

            setPartnerInfoModal({
              id: partner.id,
              name: partner.name || "",
              inn: partner.inn || "",
              contacts: partner.contacts || "",
              comment: partner.comment || "",
            });
          }}
          onCreatePartner={() =>
            setPartnerModal({
              name: "",
              inn: "",
              comment: "",
            })
          }
        />

        <DenXanSummary summary={summary} />
      </Card>

      <CommentModal
        open={Boolean(commentModal)}
        modal={commentModal}
        loading={isSubmitting}
        onCancel={() => setCommentModal(null)}
        onChange={(comment) =>
          setCommentModal((prev) => ({ ...prev, comment }))
        }
        onSave={handleSaveComment}
      />

      <AddIncomingModal
        open={Boolean(addModal)}
        modal={addModal}
        loading={isSubmitting}
        onCancel={() => setAddModal(null)}
        onChange={(field, value) =>
          setAddModal((prev) => ({ ...prev, [field]: value }))
        }
        onSave={handleAddIncoming}
      />

      <PartnerInfoModal
        open={Boolean(partnerInfoModal)}
        form={
          partnerInfoModal || { name: "", inn: "", contacts: "", comment: "" }
        }
        loading={isPartnerSubmitting}
        onCancel={() => setPartnerInfoModal(null)}
        onChange={(field, value) =>
          setPartnerInfoModal((prev) => ({ ...prev, [field]: value }))
        }
        onSave={handleUpdatePartner}
      />

      <CreatePartnerModal
        open={Boolean(partnerModal)}
        form={partnerModal || { name: "", inn: "", comment: "" }}
        loading={isPartnerSubmitting}
        onCancel={() => setPartnerModal(null)}
        onChange={(field, value) =>
          setPartnerModal((prev) => ({ ...prev, [field]: value }))
        }
        onSave={handleCreatePartner}
      />
    </Space>
  );
}
