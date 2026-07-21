import { useEffect, useState } from "react";
import { Alert, Button, Card, DatePicker, Space, Spin, Typography } from "antd";

import { useClearingReportStore } from "@/store/clearingReport/clearingReportStore";

import {
  getReportPeriod,
  REPORT_PERIODS,
  serializeReportPeriod,
} from "@/shared/utils/reportPeriods";

import ReportSummaryCards from "../components/report/ReportSummaryCards";
import PeopleReportTable from "../components/report/PeopleReportTable";
import OperationsReportTable from "../components/report/OperationsReportTable";

const { RangePicker } = DatePicker;
const { Text } = Typography;

const INITIAL_PERIOD = getReportPeriod(REPORT_PERIODS.MONTH);

export default function ReportTab() {
  const [periodType, setPeriodType] = useState(REPORT_PERIODS.MONTH);
  const [dateFrom, setDateFrom] = useState(INITIAL_PERIOD.dateFrom);
  const [dateTo, setDateTo] = useState(INITIAL_PERIOD.dateTo);

  const { report, isLoading, error, loadReport, clearReport } =
    useClearingReportStore();

  const loadData = async (from = dateFrom, to = dateTo) => {
    if (!from || !to) {
      return;
    }

    await loadReport(
      serializeReportPeriod({
        dateFrom: from,
        dateTo: to,
      })
    );
  };

  useEffect(() => {
    loadReport(
      serializeReportPeriod({
        dateFrom: INITIAL_PERIOD.dateFrom,
        dateTo: INITIAL_PERIOD.dateTo,
      })
    );

    return () => {
      clearReport();
    };
  }, [loadReport, clearReport]);

  const handleQuickPeriod = async (type) => {
    const period = getReportPeriod(type);

    setPeriodType(type);
    setDateFrom(period.dateFrom);
    setDateTo(period.dateTo);

    await loadData(period.dateFrom, period.dateTo);
  };

  const handleCustomPeriod = async (values) => {
    if (!values?.[0] || !values?.[1]) {
      return;
    }

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
            allowClear={false}
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

          <PeopleReportTable rows={report.people || []} />

          <OperationsReportTable rows={report.operations || []} />
        </>
      )}
    </Space>
  );
}
