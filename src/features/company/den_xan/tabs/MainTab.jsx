import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Card, DatePicker, Spin, Typography, message } from "antd";
import dayjs from "dayjs";

import { BankOutlined } from "@ant-design/icons";
import { formatMoney } from "@/shared/utils/formatMoney";

import { useDenXanStore } from "@/store/denXan/denXanStore";
import { useDenXanExpenseStore } from "@/store/denXanExpense/denXanExpenseStore";
import { usePartnerStore } from "@/store/partner/partnerStore";
import { useDenXanOutgoingStore } from "@/store/denXanOutgoing/denXanOutgoingStore";

import IncomingTable from "../components/incoming/IncomingTable";
import DenXanSummary from "../components/DenXanSummary";
import DenXanRates from "../components/DenXanRates";
import OutgoingQuickPanel from "../components/outgoing/OutgoingQuickPanel";
import OutgoingTable from "../components/outgoing/OutgoingTable";
import PartnerCreateModal from "../components/outgoing/PartnerCreateModal";

import CommentModal from "../modals/CommentModal";
import AddIncomingModal from "../modals/AddIncomingModal";

import styles from "./MainTab.module.css";

const { Text, Title } = Typography;

const rowToDraft = (row) => ({
  total_amount: row.total_amount,
  service_percent: row.service_percent,
  mtg_amount: row.mtg_amount,
});

export default function MainTab({
  company,
  accounts = [],
  totalBalance = 0,
  activeAccount,
  onAfterChange,
}) {
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isInitialLoadFinished, setIsInitialLoadFinished] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [commentModal, setCommentModal] = useState(null);
  const [addModal, setAddModal] = useState(null);
  const [rateDraft, setRateDraft] = useState({});

  const [editingOutgoing, setEditingOutgoing] = useState(null);

  const [deletingOutgoingId, setDeletingOutgoingId] = useState(null);

  const [savingIncomingIds, setSavingIncomingIds] = useState([]);
  const [savedIncomingIds, setSavedIncomingIds] = useState([]);

  const [isRateSaving, setIsRateSaving] = useState(false);
  const [areRatesSaved, setAreRatesSaved] = useState(false);

  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const [createdPartnerId, setCreatedPartnerId] = useState(null);

  const rateTimerRef = useRef(null);
  const lastSavedRatesRef = useRef(null);

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
    saveIncomingComment,
  } = useDenXanStore();

  useEffect(() => {
    setIsInitialLoadFinished(false);
  }, [company?.id]);
  
  useEffect(() => {
    if (!isLoading && day?.id) {
      setIsInitialLoadFinished(true);
    }
  }, [isLoading, day?.id]);

  const {
    partners,
    isLoading: isPartnersLoading,
    isSubmitting: isPartnerSubmitting,
    loadPartners,
    createPartner,
  } = usePartnerStore();

  const {
    outgoings,
    isLoading: isOutgoingsLoading,
    isSubmitting: isOutgoingSubmitting,
    loadOutgoings,
    createOutgoing,
    deleteOutgoing,
  } = useDenXanOutgoingStore();

  const reloadCurrentExpenses = useDenXanExpenseStore(
    (state) => state.reloadCurrentExpenses
  );

  const dateValue = selectedDate.format("YYYY-MM-DD");

  const vatDistributor = useMemo(
    () =>
      rows.find(
        (row) =>
          row.distributor_is_vat === true ||
          row.is_vat === true ||
          row.distributor_name?.trim().toUpperCase() === "НДС"
      ),
    [rows]
  );

  useEffect(() => {
    if (!company?.id) return;

    loadDaily({
      company: company.id,
      date: dateValue,
    });
  }, [company?.id, dateValue, loadDaily]);

  useEffect(() => {
    if (!company?.id) return;

    loadPartners(company.id);
  }, [company?.id, loadPartners]);

  useEffect(() => {
    if (!company?.id || !day?.id) return;

    loadOutgoings({
      company: company.id,
      day: day.id,
    });
  }, [company?.id, day?.id, loadOutgoings]);

  const resolvedRates = {
    den_xan_rate: rateDraft.den_xan_rate ?? day?.den_xan_rate ?? null,
    street_rate: rateDraft.street_rate ?? day?.street_rate ?? null,
  };

  useEffect(() => {
    if (!day?.id) return;

    const denXanRate = resolvedRates.den_xan_rate;
    const streetRate = resolvedRates.street_rate;

    if (!denXanRate || !streetRate) {
      setAreRatesSaved(false);
      return;
    }

    const nextRatesKey = JSON.stringify({
      den_xan_rate: String(denXanRate),
      street_rate: String(streetRate),
    });

    if (lastSavedRatesRef.current === nextRatesKey) {
      return;
    }

    if (rateTimerRef.current) {
      clearTimeout(rateTimerRef.current);
    }

    setAreRatesSaved(false);

    rateTimerRef.current = setTimeout(async () => {
      try {
        setIsRateSaving(true);

        await saveRates(day.id, {
          den_xan_rate: denXanRate,
          street_rate: streetRate,
        });

        lastSavedRatesRef.current = nextRatesKey;
        setRateDraft({});
        setAreRatesSaved(true);
      } catch {
        message.error("Не удалось автоматически сохранить курсы");
      } finally {
        setIsRateSaving(false);
      }
    }, 700);

    return () => {
      if (rateTimerRef.current) {
        clearTimeout(rateTimerRef.current);
      }
    };
  }, [
    day?.id,
    resolvedRates.den_xan_rate,
    resolvedRates.street_rate,
    saveRates,
  ]);

  useEffect(() => {
    if (!day?.id) return;

    if (day.den_xan_rate && day.street_rate) {
      lastSavedRatesRef.current = JSON.stringify({
        den_xan_rate: String(day.den_xan_rate),
        street_rate: String(day.street_rate),
      });

      setAreRatesSaved(true);
    } else {
      lastSavedRatesRef.current = null;
      setAreRatesSaved(false);
    }
  }, [day?.id, day?.den_xan_rate, day?.street_rate]);

  const isIncomingDirty = (row) => {
    const draft = resolvedDrafts[row.id];

    if (!draft) {
      return false;
    }

    return (
      String(draft.total_amount ?? "0") !== String(row.total_amount ?? "0") ||
      String(draft.service_percent ?? "6.00") !==
        String(row.service_percent ?? "6.00") ||
      String(draft.mtg_amount ?? "0") !== String(row.mtg_amount ?? "0")
    );
  };

  const handleCreateOutgoing = async (values) => {
    if (!day?.id) {
      message.error("Рабочий день ещё не загружен");
      return;
    }

    if (!activeAccount?.id) {
      message.error("Выберите рабочий счёт");
      return;
    }

    try {
      await createOutgoing({
        day_id: day.id,
        bank_account_id: activeAccount.id,
        partner_id: values.partner_id,
        target_bank_account_id: values.target_bank_account_id || null,
        distributor_id:
          values.is_vat && vatDistributor
            ? vatDistributor.distributor_id ??
              vatDistributor.distributor ??
              vatDistributor.id
            : null,
        amount: values.amount,
        service_percent: values.service_percent ?? "9.00",
        comment: values.comment || "",
      });

      await refreshDayData();

      message.success("Исход создан");
    } catch {
      message.error("Не удалось создать исход");
      throw new Error("Outgoing operation creation failed");
    }
  };

  const resolvedDrafts = useMemo(
    () =>
      Object.fromEntries(
        rows.map((row) => [
          row.id,
          {
            ...rowToDraft(row),
            ...drafts[row.id],
          },
        ])
      ),
    [rows, drafts]
  );

  const updateDraft = (rowId, field, value) => {
    const row = rows.find((item) => item.id === rowId);

    if (!row) return;

    setDrafts((previous) => ({
      ...previous,
      [rowId]: {
        ...rowToDraft(row),
        ...previous[rowId],
        [field]: value ?? "0",
      },
    }));
  };

  const clearRowDraft = (rowId) => {
    setDrafts((previous) => {
      const next = { ...previous };
      delete next[rowId];
      return next;
    });
  };

  const handleSaveComment = async () => {
    if (!commentModal?.row?.id) return;

    try {
      await saveIncomingComment(
        commentModal.row.id,
        commentModal.comment || ""
      );

      setCommentModal(null);
      message.success("Комментарий сохранён");
    } catch {
      message.error("Не удалось сохранить комментарий");
    }
  };

  const handleAutoSaveIncoming = async (row, draftOverride = null) => {
    if (!row?.id) {
      return;
    }

    if (savingIncomingIds.includes(row.id)) {
      return;
    }

    const draft = draftOverride || resolvedDrafts[row.id];

    if (!draft) {
      return;
    }

    const isDirty =
      String(draft.total_amount ?? "0") !== String(row.total_amount ?? "0") ||
      String(draft.service_percent ?? "6.00") !==
        String(row.service_percent ?? "6.00") ||
      String(draft.mtg_amount ?? "0") !== String(row.mtg_amount ?? "0");

    if (!isDirty) {
      return;
    }

    setSavingIncomingIds((previous) => [...previous, row.id]);

    setSavedIncomingIds((previous) => previous.filter((id) => id !== row.id));

    try {
      await saveIncoming(row.id, {
        total_amount: draft.total_amount || "0",
        mtg_amount: draft.mtg_amount || "0",
        service_percent: draft.service_percent || "6.00",
      });

      await refreshDayData();
      clearRowDraft(row.id);

      setSavedIncomingIds((previous) => [
        ...previous.filter((id) => id !== row.id),
        row.id,
      ]);

      window.setTimeout(() => {
        setSavedIncomingIds((previous) =>
          previous.filter((id) => id !== row.id)
        );
      }, 1500);
    } catch {
      message.error(
        `Не удалось сохранить приход: ${row.distributor_name || "строка"}`
      );
    } finally {
      setSavingIncomingIds((previous) =>
        previous.filter((id) => id !== row.id)
      );
    }
  };

  const handleAddIncoming = async () => {
    if (!addModal?.row?.id) return;

    try {
      await addIncoming(addModal.row.id, {
        add_amount: addModal.add_amount || "0",
        add_mtg_amount: addModal.add_mtg_amount || "0",
      });

      await refreshDayData();

      setAddModal(null);
      clearRowDraft(addModal.row.id);

      message.success("Сумма добавлена");
    } catch {
      message.error("Не удалось добавить сумму");
    }
  };

  const restoreScrollPosition = (position) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.scrollTo(0, position);
      });
    });
  };

  const refreshDayData = async () => {
    const scrollPosition = window.scrollY;

    const tasks = [reloadCurrentExpenses(), onAfterChange?.()];

    if (company?.id && date) {
      tasks.push(
        loadDaily({
          company: company.id,
          date: dayjs(date).format("YYYY-MM-DD"),
        })
      );
    }

    await Promise.all(tasks);

    restoreScrollPosition(scrollPosition);
  };

  const handleCreatePartner = async (payload) => {
    try {
      const partner = await createPartner(payload);

      setCreatedPartnerId(partner.id);
      setIsPartnerModalOpen(false);

      message.success("Фирма добавлена");

      return partner;
    } catch {
      message.error("Не удалось добавить фирму");
      throw new Error("Partner creation failed");
    }
  };

  const handleDeleteOutgoing = async (outgoing) => {
    if (!outgoing?.id) return;

    try {
      setDeletingOutgoingId(outgoing.id);

      await deleteOutgoing(outgoing.id);

      await refreshDayData();

      message.success("Исход удалён");
    } catch {
      message.error("Не удалось удалить исход");
    } finally {
      setDeletingOutgoingId(null);
    }
  };

  const handleDateChange = (value) => {
    if (!value) return;

    setSelectedDate(value);
    setDrafts({});
    setRateDraft({});
    setSavingIncomingIds([]);
    setSavedIncomingIds([]);
    setCommentModal(null);
    setAddModal(null);
  };

  if (isLoading && !isInitialLoadFinished) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: 48,
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {error && (
        <Alert
          type="error"
          message="Ошибка загрузки"
          description={
            typeof error === "string"
              ? error
              : "Не удалось загрузить данные DEN XAN"
          }
          showIcon
        />
      )}

      <div className={styles.toolbar}>
        <div className={styles.dateBlock}>
          <Text className={styles.toolbarLabel}>Рабочая дата</Text>

          <DatePicker
            value={selectedDate}
            format="DD.MM.YYYY"
            allowClear={false}
            onChange={handleDateChange}
            className={styles.datePicker}
          />
        </div>

        <div className={styles.balanceBlock}>
          <div className={styles.balanceIcon}>
            <BankOutlined />
          </div>

          <div className={styles.balanceContent}>
            <Text type="secondary" className={styles.toolbarLabel}>
              Общий баланс
            </Text>

            <Text strong className={styles.balanceValue}>
              {formatMoney(totalBalance)}
            </Text>

            {activeAccount && (
              <Text type="secondary" className={styles.activeAccountName}>
                Активный счёт: {activeAccount.bank_name}
              </Text>
            )}
          </div>
        </div>

        <DenXanRates
          rates={resolvedRates}
          saving={isRateSaving}
          saved={areRatesSaved}
          onChange={(field, value) =>
            setRateDraft((previous) => ({
              ...previous,
              [field]: value,
            }))
          }
        />
      </div>

      <div className={styles.workspace}>
        <Card
          className={styles.section}
          title={
            <div className={styles.sectionHeader}>
              <div>
                <Title level={4} className={styles.sectionTitle}>
                  Поступления
                </Title>

                <Text className={styles.sectionDescription}>
                  {date
                    ? dayjs(date).format("D MMMM YYYY")
                    : "Выбранный рабочий день"}
                </Text>
              </div>
            </div>
          }
          styles={{
            body: {
              padding: 0,
            },
          }}
        >
          <IncomingTable
            rows={rows}
            drafts={resolvedDrafts}
            updateDraft={updateDraft}
            savingRowIds={savingIncomingIds}
            savedRowIds={savedIncomingIds}
            onAdd={(row) =>
              setAddModal({
                row,
                add_amount: "0",
                add_mtg_amount: "0",
              })
            }
            onComment={(row) =>
              setCommentModal({
                row,
                comment: row.incoming_comment || "",
              })
            }
            onAutoSave={handleAutoSaveIncoming}
          />
        </Card>

        <OutgoingQuickPanel
          partners={partners}
          accounts={accounts}
          vatDistributor={vatDistributor}
          isPartnersLoading={isPartnersLoading}
          isSubmitting={isOutgoingSubmitting}
          createdPartnerId={createdPartnerId}
          onCreatedPartnerApplied={() => setCreatedPartnerId(null)}
          onCreate={handleCreateOutgoing}
          onAddPartner={() => setIsPartnerModalOpen(true)}
        />
      </div>

      <Card
        className={styles.outgoingSection}
        title={
          <div className={styles.sectionHeader}>
            <Title level={4} className={styles.sectionTitle}>
              Исходы
            </Title>

            <Text className={styles.sectionDescription}>
              {date
                ? dayjs(date).format("D MMMM YYYY")
                : "Выбранный рабочий день"}
            </Text>
          </div>
        }
        styles={{
          body: {
            padding: 0,
          },
        }}
      >
        <OutgoingTable
          outgoings={outgoings}
          isLoading={isOutgoingsLoading}
          deletingId={deletingOutgoingId}
          onEdit={(outgoing) => setEditingOutgoing(outgoing)}
          onDelete={handleDeleteOutgoing}
        />
      </Card>

      <DenXanSummary summary={summary} />

      <CommentModal
        open={Boolean(commentModal)}
        modal={commentModal}
        loading={isSubmitting}
        onCancel={() => setCommentModal(null)}
        onChange={(comment) =>
          setCommentModal((previous) => ({
            ...previous,
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
          setAddModal((previous) => ({
            ...previous,
            [field]: value,
          }))
        }
        onSave={handleAddIncoming}
      />

      <PartnerCreateModal
        open={isPartnerModalOpen}
        companyId={company?.id}
        isSubmitting={isPartnerSubmitting}
        onCancel={() => setIsPartnerModalOpen(false)}
        onCreate={handleCreatePartner}
      />
    </div>
  );
}
