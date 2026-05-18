import { useTranslations } from "next-intl";
import shared from "./shared.module.css";
import styles from "./page.module.css";

const KPI_ITEMS = [
  { key: "activeProjects", value: "18", sub: "+3", color: "var(--verde-oliva)", icon: "◎" },
  { key: "activeSites", value: "6", sub: "2", color: "var(--status-blue)", icon: "◉" },
  { key: "monthlyBilling", value: "124K€", sub: "+12%", color: "var(--verde-oliva-dark)", icon: "◈" },
  { key: "certifications2026", value: "23", sub: "40", color: "var(--status-green)", icon: "◆" },
] as const;

const PIPELINE_STAGES = [
  { key: "showroom", count: 3, color: "var(--verde-oliva)" },
  { key: "budget", count: 2, color: "var(--verde-oliva-light)" },
  { key: "technical", count: 4, color: "var(--verde-oliva-dark)" },
  { key: "review", count: 1, color: "var(--status-orange)" },
  { key: "dossier", count: 2, color: "var(--status-brown)" },
  { key: "logistics", count: 2, color: "var(--status-teal)" },
  { key: "construction", count: 3, color: "var(--status-blue)" },
  { key: "certified", count: 8, color: "var(--status-green)" },
] as const;

const SYSTEM_STATUS = [
  { key: "web", status: "online", color: "var(--status-green)" },
  { key: "platform", status: "active", color: "var(--verde-oliva)" },
  { key: "apps", status: "active", color: "var(--verde-oliva)" },
  { key: "sync", status: "realtime", color: "var(--status-blue)" },
  { key: "bim", status: "connected", color: "var(--verde-oliva-dark)" },
] as const;

export default function DashboardPage() {
  const t = useTranslations("dashboardPage");

  return (
    <>
      {/* KPI Cards */}
      <div className={`${shared.grid4} ${shared.mb12}`}>
        {KPI_ITEMS.map((kpi) => (
          <div key={kpi.key} className={shared.cardSm}>
            <div className={styles.kpiRow}>
              <div>
                <div className={shared.muted} style={{ marginBottom: 6 }}>
                  {t(`kpi.${kpi.key}.label`)}
                </div>
                <div className={styles.kpiValue} style={{ color: kpi.color }}>
                  {kpi.value}
                </div>
                <div className={styles.kpiSub} style={{ color: kpi.color }}>
                  {t(`kpi.${kpi.key}.sub`, { value: kpi.sub })}
                </div>
              </div>
              <div
                className={styles.kpiIcon}
                style={{ background: `color-mix(in srgb, ${kpi.color} 10%, transparent)`, color: kpi.color }}
              >
                {kpi.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline */}
      <div className={`${shared.card} ${shared.mb12}`}>
        <div className={shared.cardTitle}>{t("pipeline.title", { count: 6 })}</div>
        <div className={styles.pipeline}>
          {PIPELINE_STAGES.map((stage, i) => (
            <div key={stage.key} className={styles.pipelineGroup}>
              <div className={styles.pipelineStage}>
                <div
                  className={styles.pipelineCount}
                  style={{ background: stage.color }}
                >
                  {stage.count}
                </div>
                <div className={styles.pipelineLabel}>
                  {t(`pipeline.stages.${stage.key}`)}
                </div>
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div className={styles.pipelineSep}>›</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Activity + System Status */}
      <div className={shared.grid2}>
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("activity.title")}</div>
          <div className={styles.activityPlaceholder}>
            <span className={shared.muted}>{t("activity.placeholder")}</span>
          </div>
        </div>
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("systemStatus.title")}</div>
          {SYSTEM_STATUS.map((item) => (
            <div key={item.key} className={styles.statusRow}>
              <div>
                <div className={styles.statusLabel}>
                  {t(`systemStatus.items.${item.key}.label`)}
                </div>
                <div className={shared.muted}>
                  {t(`systemStatus.items.${item.key}.detail`)}
                </div>
              </div>
              <span
                className={shared.chip}
                style={{
                  background: `color-mix(in srgb, ${item.color} 10%, transparent)`,
                  color: item.color,
                }}
              >
                {t(`systemStatus.statuses.${item.status}`)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
