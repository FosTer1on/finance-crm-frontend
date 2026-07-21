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

  resetNewDraft,
  clearRowDraft,
}) => {
  const handleCreateOperation = async () => {
    if (!validateOperation(draft)) return;

    await createOperation(buildOperationPayload(draft, dateValue));

    resetNewDraft();

    message.success("Операция создана");
  };

  const handleUpdateOperation = async (row) => {
    const rowDraft = resolvedDrafts[row.id];

    if (!rowDraft) {
      message.error("Данные операции не найдены");
      return;
    }

    if (!validateOperation(rowDraft)) return;

    await updateOperation(row.id, buildOperationPayload(rowDraft, dateValue));

    clearRowDraft(row.id);

    message.success("Операция обновлена");
  };

  const handleDeleteOperation = async (row) => {
    await deleteOperation(row.id);

    clearRowDraft(row.id);

    message.success("Операция удалена");
  };

  return {
    handleCreateOperation,
    handleUpdateOperation,
    handleDeleteOperation,
  };
};
