import {
  ArrowLeftOutlined,
  BankOutlined,
  CheckCircleFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { Button, Card, Space, Tag, Typography } from "antd";
import { Link } from "react-router-dom";

import { formatMoney } from "@/shared/utils/formatMoney";

import styles from "./CompanyHeader.module.css";

const { Title, Text } = Typography;

export default function CompanyHeader({
  company,
  accounts = [],
  activeAccountId,
  onAccountChange,
  isLoadingAccounts = false,
}) {
  if (!company) return null;

  const activeAccounts = accounts.filter(
    (account) => account.is_active
  );

  return (
    <Card className={styles.headerCard}>
      <div className={styles.topRow}>
        <div className={styles.companyBlock}>
          <Link to="/">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              className={styles.backButton}
            >
              Назад к фирмам
            </Button>
          </Link>

          <div className={styles.companyTitleRow}>
            <div>
              <Space size={10} wrap>
                <Title level={2} className={styles.companyTitle}>
                  {company.name}
                </Title>

                <Tag
                  color={
                    company.schema_type === "den_xan"
                      ? "purple"
                      : "blue"
                  }
                  className={styles.schemaTag}
                >
                  {company.schema_type === "den_xan"
                    ? "DEN XAN"
                    : company.schema_type}
                </Tag>

                {company.is_active && (
                  <Tag
                    color="success"
                    icon={<SafetyCertificateOutlined />}
                  >
                    Активна
                  </Tag>
                )}
              </Space>

              <Space
                size="large"
                wrap
                className={styles.companyMeta}
              >
                <Text type="secondary">
                  ID: {company.id}
                </Text>

                <Text type="secondary">
                  ИНН: {company.inn || "Не указан"}
                </Text>
              </Space>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.accountsSection}>
        <div className={styles.accountsHeading}>
          <div>
            <Title level={5} className={styles.accountsTitle}>
              Рабочий счёт
            </Title>

            <Text type="secondary">
              Все приходы и исходы будут выполняться по выбранному счёту
            </Text>
          </div>

          {activeAccounts.length > 1 && (
            <Text type="secondary">
              Выберите нужный счёт
            </Text>
          )}
        </div>

        <div className={styles.accountsGrid}>
          {isLoadingAccounts && (
            <div className={styles.emptyAccounts}>
              Загрузка счетов...
            </div>
          )}

          {!isLoadingAccounts && activeAccounts.length === 0 && (
            <div className={styles.emptyAccounts}>
              У фирмы нет активных счетов
            </div>
          )}

          {!isLoadingAccounts &&
            activeAccounts.map((account) => {
              const isActive =
                Number(activeAccountId) === Number(account.id);

              return (
                <button
                  key={account.id}
                  type="button"
                  className={`${styles.accountButton} ${
                    isActive ? styles.accountButtonActive : ""
                  }`}
                  onClick={() => onAccountChange?.(account.id)}
                >
                  <div className={styles.accountTop}>
                    <div className={styles.bankIcon}>
                      <BankOutlined />
                    </div>

                    <div className={styles.accountNames}>
                      <Text strong className={styles.bankName}>
                        {account.bank_name}
                      </Text>

                      <Text
                        type="secondary"
                        className={styles.accountName}
                      >
                        {account.account_name}
                      </Text>
                    </div>

                    {isActive && (
                      <CheckCircleFilled
                        className={styles.activeIcon}
                      />
                    )}
                  </div>

                  <div className={styles.accountBottom}>
                    <div>
                      <Text
                        type="secondary"
                        className={styles.accountBalanceLabel}
                      >
                        Баланс
                      </Text>

                      <div className={styles.accountBalance}>
                        {formatMoney(account.balance)}
                      </div>
                    </div>

                    {account.account_number && (
                      <Text
                        type="secondary"
                        className={styles.accountNumber}
                      >
                        {account.account_number}
                      </Text>
                    )}
                  </div>
                </button>
              );
            })}
        </div>
      </div>
    </Card>
  );
}