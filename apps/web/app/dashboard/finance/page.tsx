import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const KPI_ITEMS = [
  { key: "billingYtd", value: "524K€", sub: "900K€", color: "var(--verde-oliva)" },
  { key: "grossMargin", value: "28.4%", sub: "28%", color: "var(--status-green)" },
  { key: "pendingCollection", value: "78K€", sub: "6", color: "var(--status-orange)" },
  { key: "materialCost", value: "384K€", sub: "LME", color: "var(--status-blue)" },
] as const;

const BILLING_DATA = [
  { month: "Ene", revenue: 85, cost: 58 },
  { month: "Feb", revenue: 92, cost: 63 },
  { month: "Mar", revenue: 108, cost: 74 },
  { month: "Abr", revenue: 115, cost: 80 },
  { month: "May", revenue: 124, cost: 85 },
] as const;

const INVOICES = [
  { client: "Torres Const.", ref: "VTH-26-003", amount: "42.500€", due: "15 May", statusKey: "dueSoon", color: "var(--status-orange)" },
  { client: "Martínez López", ref: "VTH-26-002", amount: "18.000€", due: "28 May", statusKey: "issued", color: "var(--verde-oliva)" },
  { client: "Fernández Díaz", ref: "VTH-26-004", amount: "17.500€", due: "5 Jun", statusKey: "issued", color: "var(--verde-oliva)" },
] as const;

const COST_PROJECTS = [
  { client: "Torres 175m²", budget: 340000, spent: 211000 },
  { client: "Alonso 120m²", budget: 235000, spent: 196000 },
  { client: "García 140m²", budget: 285000, spent: 34000 },
] as const;

const MAX_REV = 130;

export default function FinancePage() {
  const t = useTranslations("financePage");

  return (
    <>
      {/* KPIs */}
      <div className={`${shared.grid4} ${shared.mb12}`}>
        {KPI_ITEMS.map((kpi) => (
          <div key={kpi.key} className={shared.cardSm}>
            <div className={shared.muted} style={{ marginBottom: 6 }}>
              {t(`kpi.${kpi.key}.label`)}
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, color: kpi.color }}>
              {kpi.value}
            </div>
            <div className={shared.muted} style={{ marginTop: 3 }}>
              {t(`kpi.${kpi.key}.sub`, { value: kpi.sub })}
            </div>
          </div>
        ))}
      </div>

      <div className={shared.grid2}>
        {/* Billing chart */}
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("chart.title")}</div>
          <div className={styles.barChart}>
            {BILLING_DATA.map((d) => (
              <div key={d.month} className={styles.barGroup}>
                <div className={styles.barCols}>
                  <div
                    className={styles.barRev}
                    style={{ height: Math.round((d.revenue / MAX_REV) * 100) }}
                  />
                  <div
                    className={styles.barCost}
                    style={{ height: Math.round((d.cost / MAX_REV) * 100) }}
                  />
                </div>
                <div className={styles.barLabel}>{d.month}</div>
              </div>
            ))}
          </div>
          <div className={styles.legend}>
            <span>
              <span className={styles.legendDotRev} />
              {t("chart.revenue")}
            </span>
            <span>
              <span className={styles.legendDotCost} />
              {t("chart.costs")}
            </span>
          </div>
          <div className={styles.summaryBox}>
            <div className={styles.summaryRow}>
              <span className={shared.muted}>{t("chart.marginYtd")}</span>
              <span className={styles.summaryValue} style={{ color: "var(--verde-oliva)" }}>140K€</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={shared.muted}>{t("chart.projectedMargin")}</span>
              <span className={styles.summaryValue} style={{ color: "var(--verde-oliva-dark)" }}>340K€</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={shared.muted}>{t("chart.capexFund")}</span>
              <span className={styles.summaryValue} style={{ color: "var(--status-orange)" }}>50K€</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Pending invoices */}
          <div className={`${shared.card} ${shared.mb12}`}>
            <div className={shared.cardTitle}>{t("invoices.title")}</div>
            {INVOICES.map((inv) => (
              <div key={`${inv.ref}-${inv.amount}`} className={`${styles.invoiceRow} ${shared.rowSep}`}>
                <div>
                  <div className={styles.invoiceClient}>{inv.client}</div>
                  <div className={shared.muted}>{inv.ref} · {t("invoices.due")} {inv.due}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className={styles.invoiceAmount}>{inv.amount}</div>
                  <span
                    className={shared.chip}
                    style={{
                      background: `color-mix(in srgb, ${inv.color} 13%, transparent)`,
                      color: inv.color,
                    }}
                  >
                    {t(`invoices.statuses.${inv.statusKey}`)}
                  </span>
                </div>
              </div>
            ))}
            <div className={styles.totalBox}>
              <span style={{ fontSize: 11, color: "#6b6b6b" }}>{t("invoices.totalPending")}</span>
              <span className={styles.totalAmount}>78.000€</span>
            </div>
          </div>

          {/* Cost control */}
          <div className={shared.card}>
            <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("costControl.title")}</div>
            {COST_PROJECTS.map((p) => {
              const pct = Math.round((p.spent / p.budget) * 100);
              return (
                <div key={p.client} style={{ marginBottom: 10 }}>
                  <div className={styles.costHeader}>
                    <span className={styles.costClient}>{p.client}</span>
                    <span className={shared.muted}>
                      €{p.spent.toLocaleString("es-ES")} / €{p.budget.toLocaleString("es-ES")}
                    </span>
                  </div>
                  <div className={shared.progressWrap}>
                    <div
                      className={shared.progressFill}
                      style={{
                        width: `${pct}%`,
                        background: pct > 85 ? "var(--status-orange)" : "var(--verde-oliva)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
