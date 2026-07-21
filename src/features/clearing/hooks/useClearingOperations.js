import { message } from "antd";

import {
  buildOperationPayload,
  validateOperation,
} from "../utils/operationHelpers";

export const useClearingOperations = ({
  draft,
  resolvedDrafts,
  dateValue,
  createOperation,
  updateOperation,
  deleteOperation,
  setDraft,
  setDrafts,
  createEmptyDraft,
}) => {
  const handleCreateOperation = async () => {
    if (!validateOperation(draft)) return;

    await createOperation(buildOperationPayload(draft, dateValue));

    setDraft(createEmptyDraft());

    message.success("Операция создана");
  };

  const handleUpdateOperation = async (row) => {
    const rowDraft = resolvedDrafts[row.id];

    if (!rowDraft) {
      message.error("Данные операции не найдены");
      return;
    }

    if (!validateOperation(rowDraft)) return;

    await updateOperation(
      row.id,
      buildOperationPayload(rowDraft, dateValue)
    );

    setDrafts((prev) => {
      const next = { ...prev };
      delete next[row.id];
      return next;
    });

    message.success("Операция обновлена");
  };

  const handleDeleteOperation = async (row) => {
    await deleteOperation(row.id);

    message.success("Операция удалена");
  };

  return {
    handleCreateOperation,
    handleUpdateOperation,
    handleDeleteOperation,
  };
};