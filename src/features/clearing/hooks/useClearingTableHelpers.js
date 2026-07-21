import { calculateOperationPreview } from "../utils/calculateOperationPreview";

export const useClearingTableHelpers = ({
  draft,
  drafts,
  onDraftChange,
  onRowChange,
}) => {
  const getRowDraft = (row) => {
    return row.isNew ? draft : drafts[row.id] || {};
  };

  const getCalculated = (row) => {
    if (row.isNew) {
      return calculateOperationPreview(draft);
    }

    const rowDraft = drafts[row.id];

    const hasChanged =
      rowDraft &&
      (String(rowDraft.incoming_amount) !== String(row.incoming_amount) ||
        String(rowDraft.incoming_percent) !== String(row.incoming_percent) ||
        String(rowDraft.incoming_usd_rate) !== String(row.incoming_usd_rate) ||
        String(rowDraft.outgoing_percent) !== String(row.outgoing_percent) ||
        String(rowDraft.outgoing_usd_rate) !== String(row.outgoing_usd_rate));

    if (hasChanged) {
      return calculateOperationPreview(rowDraft);
    }

    return {
      incoming_commission: row.incoming_commission,
      amount_to_give_uzs: row.amount_to_give_uzs,
      amount_to_give_usd: row.amount_to_give_usd,
      outgoing_commission: row.outgoing_commission,
      amount_to_receive_uzs: row.amount_to_receive_uzs,
      amount_to_receive_usd: row.amount_to_receive_usd,
    };
  };

  const changeValue = (row, field, value) => {
    if (row.isNew) {
      onDraftChange(field, value);
      return;
    }

    onRowChange(row.id, field, value);
  };

  return {
    getRowDraft,
    getCalculated,
    changeValue,
  };
};