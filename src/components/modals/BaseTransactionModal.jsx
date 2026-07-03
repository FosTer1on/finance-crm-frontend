import { Modal } from "antd";

export default function BaseTransactionModal({
  title,
  open,
  onCancel,
  onOk,
  confirmLoading = false,
  children,
  width = 720,
}) {
  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      okText="Создать"
      cancelText="Отмена"
      width={width}
      destroyOnHidden
    >
      {children}
    </Modal>
  );
}