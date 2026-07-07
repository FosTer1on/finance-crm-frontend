import { Input, Modal } from "antd";

export default function CommentModal({
  open,
  modal,
  loading,
  onCancel,
  onChange,
  onSave,
}) {
  return (
    <Modal
      title={modal?.type === "incoming" ? "Комментарий прихода" : "Комментарий исхода"}
      open={open}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={loading}
    >
      <Input.TextArea
        rows={5}
        value={modal?.comment}
        onChange={(event) => onChange(event.target.value)}
      />
    </Modal>
  );
}