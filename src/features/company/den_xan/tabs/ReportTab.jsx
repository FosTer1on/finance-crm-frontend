import { useEffect, useState } from "react";
import { Alert, Button, Card, DatePicker, Space, Spin, Typography } from "antd";

import { useDenXanReportStore } from "@/store/denXanReport/denXanReportStore";
import {
  getReportPeriod,
  REPORT_PERIODS,
  serializeReportPeriod,
} from "@/utils/reportPeriods";
import ReportSummaryCards from "../components/report/ReportSummaryCards";
import DistributorReportTable from "../components/report/DistributorReportTable";
import OperationsReportTable from "../components/report/OperationsReportTable";
import ExpensesReportTable from "../components/report/ExpensesReportTable";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const INITIAL_PERIOD = getReportPeriod(REPORT_PERIODS.MONTH);

export default function ReportTab({ company }) {
  const [periodType, setPeriodType] = useState(REPORT_PERIODS.MONTH);

  const [dateFrom, setDateFrom] = useState(INITIAL_PERIOD.dateFrom);
  const [dateTo, setDateTo] = useState(INITIAL_PERIOD.dateTo);

  const { report, isLoading, error, loadReport, clearReport } =
    useDenXanReportStore();

  const loadData = async (from = dateFrom, to = dateTo) => {
    if (!company?.id || !from || !to) return;

    const period = serializeReportPeriod({
      dateFrom: from,
      dateTo: to,
    });

    await loadReport({
      company: company.id,
      ...period,
    });
  };

  useEffect(() => {
    if (!company?.id) return;
  
    loadReport({
      company: company.id,
      ...serializeReportPeriod({
        dateFrom: INITIAL_PERIOD.dateFrom,
        dateTo: INITIAL_PERIOD.dateTo,
      }),
    });
  
    return () => {
      clearReport();
    };
  }, [company?.id, loadReport, clearReport]);

  const handleQuickPeriod = async (type) => {
    const period = getReportPeriod(type);

    setPeriodType(type);
    setDateFrom(period.dateFrom);
    setDateTo(period.dateTo);

    await loadData(period.dateFrom, period.dateTo);
  };

  const handleCustomPeriod = async (values) => {
    if (!values?.[0] || !values?.[1]) return;

    setPeriodType(REPORT_PERIODS.CUSTOM);
    setDateFrom(values[0]);
    setDateTo(values[1]);

    await loadData(values[0], values[1]);
  };

  if (isLoading && !report) {
    return <Spin />;
  }

  return (
    <Space direction="vertical" size="middle" style={{ width: "100%" }}>
      {error && (
        <Alert
          type="error"
          message="Ошибка"
          description={String(error)}
          showIcon
        />
      )}

      <Card>
        <Space wrap>
          <Button
            type={periodType === REPORT_PERIODS.TODAY ? "primary" : "default"}
            onClick={() => handleQuickPeriod(REPORT_PERIODS.TODAY)}
          >
            Сегодня
          </Button>

          <Button
            type={
              periodType === REPORT_PERIODS.YESTERDAY ? "primary" : "default"
            }
            onClick={() => handleQuickPeriod(REPORT_PERIODS.YESTERDAY)}
          >
            Вчера
          </Button>

          <Button
            type={periodType === REPORT_PERIODS.WEEK ? "primary" : "default"}
            onClick={() => handleQuickPeriod(REPORT_PERIODS.WEEK)}
          >
            Неделя
          </Button>

          <Button
            type={periodType === REPORT_PERIODS.MONTH ? "primary" : "default"}
            onClick={() => handleQuickPeriod(REPORT_PERIODS.MONTH)}
          >
            Месяц
          </Button>

          <RangePicker
            value={[dateFrom, dateTo]}
            format="DD.MM.YYYY"
            onChange={handleCustomPeriod}
          />

          <Text type="secondary">
            Период: {dateFrom.format("DD.MM.YYYY")} —{" "}
            {dateTo.format("DD.MM.YYYY")}
          </Text>
        </Space>
      </Card>

      {report && (
        <>
          <ReportSummaryCards summary={report.summary} />

          <DistributorReportTable rows={report.distributors || []} />

          <OperationsReportTable rows={report.operations || []} />

          <ExpensesReportTable rows={report.expenses || []} />
        </>
      )}
    </Space>
  );
}
