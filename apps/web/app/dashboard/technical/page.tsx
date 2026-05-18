import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const WORK_QUEUE = [
  { ref: "VTH-26-002", client: "Martínez López", taskKey: "structuralCalc", priority: "high", due: "13 May", statusKey: "inProcess", color: "var(--status-orange)" },
  { ref: "VTH-26-004", client: "Fernández Díaz", taskKey: "clientReview", priority: "high", due: "15 May", statusKey: "pendingAppt", color: "var(--admin-muted)" },
  { ref: "VTH-26-005", client: "Blanco Herrero", taskKey: "basicProject", priority: "medium", due: "20 May", statusKey: "pending", color: "var(--admin-muted)" },
  { ref: "VTH-26-002", client: "Martínez López", taskKey: "buildingPermit", priority: "medium", due: "18 May", statusKey: "inReview", color: "var(--status-blue)" },
  { ref: "VTH-26-003", client: "Torres Const.", taskKey: "asBuilt", priority: "low", due: "5 Ago", statusKey: "pending", color: "var(--admin-muted)" },
] as const;

const SUB_DEPARTMENTS = [
  { key: "architecture", count: 2, color: "var(--verde-oliva)" },
  { key: "structural", count: 1, color: "var(--verde-oliva-dark)" },
  { key: "installations", count: 1, color: "var(--status-blue)" },
  { key: "documentation", count: 2, color: "var(--status-orange)" },
  { key: "bimControl", count: 1, color: "var(--status-teal)" },
] as const;

export default function TechnicalPage() {
  const t = useTranslations("technicalPage");

  return (
    <div className={styles.layout}>
      <div>
        {/* Work queue */}
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle}>{t("workQueue.title")}</div>
          {WORK_QUEUE.map((task, i) => (
            <div
              key={`${task.ref}-${task.taskKey}`}
              className={styles.taskRow}
              style={{ borderBottom: i < WORK_QUEUE.length - 1 ? "1px solid var(--admin-separator)" : "none" }}
            >
              <div
                className={shared.dot}
                style={{
                  background: task.priority === "high" ? "var(--status-orange)" : task.priority === "medium" ? "var(--verde-oliva)" : "var(--status-blue)",
                  marginTop: 4,
                }}
              />
              <div style={{ flex: 1 }}>
                <div className={styles.taskTitle}>
                  {task.ref} — {task.client}
                </div>
                <div className={shared.muted}>{t(`workQueue.tasks.${task.taskKey}`)}</div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div className={shared.muted}>{t("workQueue.due")}: {task.due}</div>
                <span
                  className={shared.chip}
                  style={{
                    background: `color-mix(in srgb, ${task.color} 13%, transparent)`,
                    color: task.color,
                  }}
                >
                  {t(`workQueue.statuses.${task.statusKey}`)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className={shared.grid2}>
          <div className={shared.card}>
            <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("nextReview.title")}</div>
            <div className={styles.reviewDate}>15 Mayo — 10:30</div>
            <div style={{ fontSize: 12, color: "#6b6b6b", marginBottom: 3 }}>
              Fernández Díaz · VTH-26-004
            </div>
            <div className={shared.muted}>{t("nextReview.detail")}</div>
          </div>
          <div className={shared.card}>
            <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("normativeAgent.title")}</div>
            <div className={shared.muted} style={{ marginBottom: 12 }}>{t("normativeAgent.subtitle")}</div>
            <div className={styles.placeholder}>
              <span className={shared.muted}>{t("normativeAgent.placeholder")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right column */}
      <div>
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("subDepartments.title")}</div>
          {SUB_DEPARTMENTS.map((dept) => (
            <div key={dept.key} className={`${styles.deptRow} ${shared.rowSep}`}>
              <div className={styles.deptInfo}>
                <div className={styles.deptDot} style={{ background: dept.color }} />
                <span style={{ fontSize: 12 }}>{t(`subDepartments.items.${dept.key}`)}</span>
              </div>
              <span
                className={shared.chip}
                style={{
                  background: `color-mix(in srgb, ${dept.color} 13%, transparent)`,
                  color: dept.color,
                  fontWeight: 700,
                }}
              >
                {dept.count}
              </span>
            </div>
          ))}
        </div>

        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("permits.title")}</div>
          <div className={styles.placeholder}>
            <span className={shared.muted}>{t("permits.placeholder")}</span>
          </div>
        </div>

        <div className={shared.card}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("dossier.title")}</div>
          <div className={styles.placeholder}>
            <span className={shared.muted}>{t("dossier.placeholder")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
