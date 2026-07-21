import { Table } from "antd";

import { useClearingTableHelpers } from "../hooks/useClearingTableHelpers";
import { useClearingOperationColumns } from "../hooks/useClearingOperationColumns";

export default function ClearingOperationTable({
  operations = [],
  draft,
  drafts,
  isSubmitting,
  onDraftChange,
  onRowChange,
  onCreate,
  onUpdate,
  onDelete,
  onCreatePerson,
  onEditPerson,
}) {
  const rows = [
    {
      id: "__new__",
      isNew: true,
    },
    ...operations,
  ];

  const { getRowDraft, getCalculated, changeValue } = useClearingTableHelpers({
    draft,
    drafts,
    onDraftChange,
    onRowChange,
  });

  const columns = useClearingOperationColumns({
    isSubmitting,
    getRowDraft,
    getCalculated,
    changeValue,
    onCreate,
    onUpdate,
    onDelete,
    onCreatePerson,
    onEditPerson,
  });

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={rows}
      pagination={false}
      scroll={{
        x: 2200,
      }}
    />
  );
}
