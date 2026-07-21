import { useMemo, useState } from "react";

export const useClearingDrafts = ({
  operations,
  operationToDraft,
  createEmptyDraft,
}) => {
  const [draft, setDraft] = useState(createEmptyDraft);
  const [drafts, setDrafts] = useState({});

  const resolvedDrafts = useMemo(
    () =>
      Object.fromEntries(
        operations.map((operation) => [
          operation.id,
          {
            ...operationToDraft(operation),
            ...drafts[operation.id],
          },
        ])
      ),
    [operations, drafts, operationToDraft]
  );

  const updateDraft = (field, value) => {
    setDraft((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const updateRowDraft = (rowId, field, value) => {
    const operation = operations.find((item) => item.id === rowId);

    if (!operation) return;

    setDrafts((prev) => ({
      ...prev,
      [rowId]: {
        ...operationToDraft(operation),
        ...prev[rowId],
        [field]: value,
      },
    }));
  };

  const resetNewDraft = () => {
    setDraft(createEmptyDraft());
  };

  const clearRowDraft = (rowId) => {
    setDrafts((prev) => {
      const next = { ...prev };

      delete next[rowId];

      return next;
    });
  };

  const resetDrafts = () => {
    setDraft(createEmptyDraft());
    setDrafts({});
  };

  return {
    draft,
    resolvedDrafts,

    updateDraft,
    updateRowDraft,

    resetNewDraft,
    clearRowDraft,
    resetDrafts,
  };
};