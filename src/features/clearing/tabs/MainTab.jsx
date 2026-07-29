import { useEffect, useState } from "react";
import { Alert, Card, DatePicker, Flex, Space, Spin, Typography } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "dayjs/locale/ru";

import { useClearingDirectoryStore } from "@/store/clearing/clearingDirectoryStore";
import { useClearingOperationStore } from "@/store/clearing/clearingOperationStore";

import ClearingOperationTable from "@/features/clearing/components/ClearingOperationTable";
import ClearingSummary from "@/features/clearing/components/ClearingSummary";
import ClearingPeopleBalances from "@/features/clearing/components/ClearingPeopleBalances";

import ClearingPersonModal from "@/features/clearing/modals/ClearingPersonModal";

import { useClearingDrafts } from "@/features/clearing/hooks/useClearingDrafts";
import { useClearingOperations } from "@/features/clearing/hooks/useClearingOperations";
import { useClearingPeople } from "@/features/clearing/hooks/useClearingPeople";

import {
  createEmptyDraft,
  operationToDraft,
} from "@/features/clearing/utils/draftHelpers";

import styles from "./MainTab.module.css";

dayjs.locale("ru");

const { Title, Text } = Typography;

export default function MainTab() {
  const [selectedDate, setSelectedDate] = useState(dayjs());

  const dateValue = selectedDate.format("YYYY-MM-DD");

  const {
    people,
    isLoadingPeople,
    isSubmitting: isDirectorySubmitting,
    error: directoryError,
    loadPeople,
    createPerson,
    updatePerson,
    clearDirectories,
  } = useClearingDirectoryStore();

  const {
    operations,
    summary,
    peopleBalances,
    isLoading,
    isSubmitting,
    error,
    loadOperations,
    createOperation,
    updateOperation,
    deleteOperation,
    clearOperations,
  } = useClearingOperationStore();

  const {
    draft,
    resolvedDrafts,
    updateDraft,
    updateRowDraft,
    resetNewDraft,
    clearRowDraft,
    resetDrafts,
  } = useClearingDrafts({
    operations,
    operationToDraft,
    createEmptyDraft,
  });

  const {
    handleCreateOperation,
    handleUpdateOperation,
    handleDeleteOperation,
  } = useClearingOperations({
    draft,
    resolvedDrafts,
    dateValue,
    createOperation,
    updateOperation,
    deleteOperation,
    resetNewDraft,
    clearRowDraft,
  });

  const {
    personModal,
    emptyPersonForm,
    openCreatePerson,
    openEditPerson,
    closePersonModal,
    changePersonForm,
    handleSavePerson,
  } = useClearingPeople({
    people,
    createPerson,
    updatePerson,
    updateDraft,
    updateRowDraft,
  });

  useEffect(() => {
    loadPeople();

    return () => {
      clearDirectories();
    };
  }, [loadPeople, clearDirectories]);

  useEffect(() => {
    loadOperations({
      date: dateValue,
    });

    return () => {
      clearOperations();
    };
  }, [dateValue, loadOperations, clearOperations]);

  const handleDateChange = (value) => {
    if (!value) {
      return;
    }

    setSelectedDate(value);
    resetDrafts();
  };

  const pageError = error || directoryError;
  const isInitialLoading =
    (isLoading || isLoadingPeople) && operations.length === 0;

  return (
    <div className={styles.page}>
      {pageError && (
        <Alert
          type="error"
          message="Ошибка"
          description={
            typeof pageError === "string"
              ? pageError
              : JSON.stringify(pageError)
          }
          showIcon
          className={styles.alert}
        />
      )}

      <Card
        size="small"
        className={styles.toolbarCard}
        styles={{
          body: {
            padding: 14,
          },
        }}
      >
        <Flex align="center" justify="space-between" gap={16} wrap="wrap">
          <div className={styles.dateInfo}>
            <div className={styles.dateIcon}>
              <CalendarOutlined />
            </div>

            <div>
              <Text type="secondary" className={styles.dateLabel}>
                Рабочая дата
              </Text>

              <Title level={5} className={styles.dateTitle}>
                {selectedDate.format("D MMMM YYYY")}
              </Title>
            </div>
          </div>

          <Space size={10} wrap>
            <Text type="secondary">Выбрать день</Text>

            <DatePicker
              value={selectedDate}
              format="DD.MM.YYYY"
              allowClear={false}
              onChange={handleDateChange}
              className={styles.datePicker}
            />
          </Space>
        </Flex>
      </Card>

      {isInitialLoading ? (
        <div className={styles.loader}>
          <Spin size="large" />

          <Text type="secondary">Загружаем операции...</Text>
        </div>
      ) : (
        <Card
          className={styles.workspaceCard}
          title={
            <div>
              <Title level={4} className={styles.workspaceTitle}>
                Операции за {selectedDate.format("D MMMM")}
              </Title>

              <Text type="secondary" className={styles.workspaceSubtitle}>
                Добавление, редактирование и расчёт операций за выбранный день
              </Text>
            </div>
          }
          styles={{
            header: {
              minHeight: 68,
              padding: "0 20px",
            },
            body: {
              padding: 0,
            },
          }}
        >
          <div className={styles.tableSection}>
            <ClearingOperationTable
              operations={operations}
              draft={draft}
              drafts={resolvedDrafts}
              isSubmitting={isSubmitting}
              onDraftChange={updateDraft}
              onRowChange={updateRowDraft}
              onCreate={handleCreateOperation}
              onUpdate={handleUpdateOperation}
              onDelete={handleDeleteOperation}
              onCreatePerson={openCreatePerson}
              onEditPerson={openEditPerson}
            />
          </div>

          <div className={styles.summarySection}>
            <ClearingSummary summary={summary} />
          </div>

          <div className={styles.balancesSection}>
            <ClearingPeopleBalances rows={peopleBalances} />
          </div>
        </Card>
      )}

      <ClearingPersonModal
        open={Boolean(personModal)}
        title={
          personModal?.mode === "edit"
            ? "Редактировать человека"
            : "Добавить человека"
        }
        form={personModal?.form || emptyPersonForm}
        loading={isDirectorySubmitting}
        onCancel={closePersonModal}
        onChange={changePersonForm}
        onSave={handleSavePerson}
      />
    </div>
  );
}
