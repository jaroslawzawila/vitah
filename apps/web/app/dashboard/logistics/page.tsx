import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const KPI_ITEMS = [
  { key: "activeOrders", value: "12", color: "var(--verde-oliva)" },
  { key: "inTransit", value: "4", color: "var(--status-blue)" },
  { key: "delivered", value: "8", color: "var(--status-green)" },
  { key: "pendingGeneration", value: "3", color: "var(--status-orange)" },
] as const;

const ORDERS = [
  { ref: "VTH-26-003", material: "Perfiles Acero S350 GD — 8.4 tn", supplier: "ArcelorMittal", ordered: "15 Abr", eta: "18 May", statusKey: "inTransit", color: "var(--status-blue)" },
  { ref: "VTH-26-003", material: "Panel Thermochip 140mm — 340 m²", supplier: "Termochip España", ordered: "20 Abr", eta: "22 May", statusKey: "confirmed", color: "var(--verde-oliva)" },
  { ref: "VTH-26-004", material: "Carpintería PVC Antracita — 18 ud", supplier: "Rehau Ibérica", ordered: "28 Abr", eta: "2 Jun", statusKey: "ordered", color: "var(--verde-oliva-light)" },
  { ref: "VTH-26-003", material: "Aerotermia Mitsubishi Ecodan 14kW", supplier: "Mitsubishi Electric", ordered: "1 May", eta: "26 May", statusKey: "confirmed", color: "var(--verde-oliva)" },
  { ref: "VTH-26-004", material: "Membrana Tyvek PLUS — 520 m²", supplier: "DuPont", ordered: "5 May", eta: "15 May", statusKey: "delivered", color: "var(--status-green)" },
  { ref: "VTH-26-005", material: "Estructura CNC — Fabricación Propia", supplier: "Nave Camargo", ordered: "—", eta: "—", statusKey: "pending", color: "var(--admin-muted)" },
] as const;

const JIT_STAGES: ReadonlyArray<{ key: string; week: string; done: boolean; active?: boolean }> = [
  { key: "foundation", week: "Sem 8", done: true },
  { key: "steelDelivery", week: "Sem 9", done: true },
  { key: "structureAssembly", week: "Sem 10", done: false, active: true },
  { key: "thermochip", week: "Sem 11", done: false },
  { key: "envelope", week: "Sem 12", done: false },
  { key: "carpentry", week: "Sem 14", done: false },
  { key: "mep", week: "Sem 18", done: false },
  { key: "delivery", week: "Sem 22", done: false },
];

export default function LogisticsPage() {
  const t = useTranslations("logisticsPage");

  return (
    <>
      {/* KPIs */}
      <div className={`${shared.grid4} ${shared.mb12}`}>
        {KPI_ITEMS.map((kpi) => (
          <div key={kpi.key} className={shared.cardSm}>
            <div className={shared.muted} style={{ marginBottom: 6 }}>
              {t(`kpi.${kpi.key}`)}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className={`${styles.tableWrapper} ${shared.mb12}`}>
        <div className={styles.tableHeader}>
          <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
            {t("orders.title")}
          </div>
          <button type="button" className={styles.newOrderBtn}>
            + {t("orders.newOrder")}
          </button>
        </div>
        <table className={shared.table}>
          <thead>
            <tr>
              <th>{t("orders.project")}</th>
              <th>{t("orders.material")}</th>
              <th>{t("orders.supplier")}</th>
              <th>{t("orders.ordered")}</th>
              <th>{t("orders.eta")}</th>
              <th>{t("orders.status")}</th>
            </tr>
          </thead>
          <tbody>
            {ORDERS.map((o, i) => (
              <tr key={`${o.ref}-${i}`}>
                <td style={{ fontWeight: 600, color: "var(--verde-oliva)" }}>{o.ref}</td>
                <td>{o.material}</td>
                <td style={{ color: "#6b6b6b" }}>{o.supplier}</td>
                <td style={{ color: "#6b6b6b" }}>{o.ordered}</td>
                <td style={{ fontWeight: 500 }}>{o.eta}</td>
                <td>
                  <span
                    className={shared.chip}
                    style={{
                      background: `color-mix(in srgb, ${o.color} 13%, transparent)`,
                      color: o.color,
                    }}
                  >
                    {t(`orders.statuses.${o.statusKey}`)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* JIT Timeline */}
      <div className={shared.card}>
        <div className={shared.cardTitle}>{t("jit.title")}</div>
        <div className={styles.jitTimeline}>
          {JIT_STAGES.map((stage) => (
            <div key={stage.key} className={styles.jitStage}>
              <div className={styles.jitLabel}>{t(`jit.stages.${stage.key}`)}</div>
              <div
                className={styles.jitBar}
                data-done={stage.done || undefined}
                data-active={stage.active || undefined}
              >
                {stage.done ? "✓" : stage.active ? "●" : ""}
              </div>
              <div
                className={styles.jitWeek}
                data-done={stage.done || undefined}
                data-active={stage.active || undefined}
              >
                {stage.week}
              </div>
            </div>
          ))}
        </div>
        <div className={shared.muted} style={{ marginTop: 10, textAlign: "center" }}>
          {t("jit.description")}
        </div>
      </div>
    </>
  );
}
