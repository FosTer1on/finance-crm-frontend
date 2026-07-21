import { Card, InputNumber, Modal, Space, Typography } from "antd";
import { formatMoney } from "@/shared/utils/formatMoney";
import { moneyFormatter, moneyParser } from "../utils/numberInput";

const { Text } = Typography;

export default function AddIncomingModal({
  open,
  modal,
  loading,
  onCancel,
  onChange,
  onSave,
}) {
  return (
    <Modal
      title="Добавить поступление"
      open={open}
      onCancel={onCancel}
      onOk={onSave}
      confirmLoading={loading}
    >
      <Space direction="vertical" size="middle" style={{ width: "100%" }}>
        <Card size="small">
          <Space direction="vertical" size={4}>
            <Text type="secondary">Дистрибьютор</Text>
            <Text strong>{modal?.row?.distributor_name}</Text>

            <Text type="secondary">Текущая общая сумма</Text>
            <Text strong>{modal ? formatMoney(modal.row.total_amount) : "0 сум"}</Text>

            <Text type="secondary">Текущий MTG</Text>
            <Text strong>{modal ? formatMoney(modal.row.mtg_amount) : "0 сум"}</Text>
          </Space>
        </Card>

        <div>
          <Text strong>Сумма нового поступления</Text>
          <InputNumber
            min={0}
            style={{ width: "100%", marginTop: 6 }}
            placeholder="Например: 20 000 000"
            value={modal?.add_amount}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) => onChange("add_amount", value)}
          />
        </div>

        <div>
          <Text strong>Дополнительный MTG</Text>
          <InputNumber
            min={0}
            style={{ width: "100%", marginTop: 6 }}
            placeholder="Если MTG нет — оставьте 0"
            value={modal?.add_mtg_amount}
            formatter={moneyFormatter}
            parser={moneyParser}
            onChange={(value) => onChange("add_mtg_amount", value)}
          />
        </div>
      </Space>
    </Modal>
  );
}