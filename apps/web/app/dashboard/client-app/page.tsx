import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const MILESTONES: ReadonlyArray<{ id: string; key: string; done: boolean; active?: boolean; photos?: number }> = [
  { id: "H1", key: "foundation", done: true, photos: 6 },
  { id: "H2", key: "steelStructure", done: true, photos: 12 },
  { id: "H3", key: "roofSeal", done: true, photos: 8 },
  { id: "H4", key: "bioSkin", done: true, photos: 9 },
  { id: "H5", key: "exteriorCarpentry", done: true, photos: 11 },
  { id: "H6", key: "mepInstallations", done: false, active: true },
  { id: "H7", key: "drywall", done: false },
  { id: "H8", key: "interiorFinishes", done: false },
  { id: "H9", key: "finalInstallations", done: false },
  { id: "H10", key: "handover", done: false },
];

const DOC_FOLDERS = [
  { key: "basicProject", count: 4, color: "var(--verde-oliva)" },
  { key: "constructionPlans", count: 12, color: "var(--verde-oliva-dark)" },
  { key: "licenses", count: 3, color: "var(--status-blue)" },
  { key: "qualityControl", count: 7, color: "var(--status-teal)" },
  { key: "photos", count: 46, color: "var(--status-orange)" },
  { key: "certifications", count: 2, color: "var(--status-green)" },
  { key: "warranties", count: 5, color: "var(--status-brown)" },
  { key: "buildingBook", count: 1, color: "var(--admin-foreground)" },
  { key: "insurance", count: 3, color: "#6b6b6b" },
] as const;

export default function ClientAppPage() {
  const t = useTranslations("clientAppPage");

  return (
    <div className={styles.layout}>
      <div>
        <div className={shared.card}>
          <div className={styles.appTitle}>{t("title")}</div>
          <div className={shared.muted} style={{ marginBottom: 12 }}>
            {t("subtitle")}
          </div>

          {/* Overview */}
          <div className={styles.overviewCard}>
            <div className={styles.overviewHeader}>
              <div>
                <div className={styles.overviewTitle}>{t("overview.title")}</div>
                <div className={shared.muted}>{t("overview.subtitle")}</div>
              </div>
              <div className={styles.overviewProgress}>
                <div className={styles.overviewPct}>62%</div>
                <div className={styles.overviewPctLabel}>{t("overview.completed")}</div>
              </div>
            </div>
            <div className={shared.progressWrap} style={{ height: 8 }}>
              <div className={shared.progressFill} style={{ width: "62%" }} />
            </div>
            <div className={`${shared.grid3} ${styles.overviewStats}`}>
              <div className={styles.statCard}>
                <div className={shared.muted}>{t("overview.stats.currentWeek")}</div>
                <div className={styles.statValue}>10 / 22</div>
              </div>
              <div className={styles.statCard}>
                <div className={shared.muted}>{t("overview.stats.activeMilestone")}</div>
                <div className={styles.statValue}>MEP · H6</div>
              </div>
              <div className={styles.statCard}>
                <div className={shared.muted}>{t("overview.stats.estimatedDelivery")}</div>
                <div className={styles.statValue}>5 Ago 26</div>
              </div>
            </div>
          </div>

          {/* Milestones list */}
          <div className={shared.cardTitle} style={{ marginTop: 16 }}>{t("milestones.title")}</div>
          <div className={styles.milestoneList}>
            {MILESTONES.map((m, i) => (
              <div
                key={m.id}
                className={styles.milestoneRow}
                style={{ borderBottom: i < MILESTONES.length - 1 ? "1px solid var(--admin-separator)" : "none" }}
              >
                <div
                  className={styles.milestoneCircle}
                  data-done={m.done || undefined}
                  data-active={m.active || undefined}
                >
                  {m.done ? "✓" : m.id.replace("H", "")}
                </div>
                <div style={{ flex: 1 }}>
                  <div
                    className={styles.milestoneName}
                    data-done={m.done || undefined}
                    data-active={m.active || undefined}
                  >
                    {t(`milestones.items.${m.key}`)}
                  </div>
                  {m.photos && (
                    <span style={{ fontSize: 10, color: "var(--verde-oliva)" }}>
                      📷 {m.photos} {t("milestones.photos")}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div className={shared.cardTitle} style={{ marginTop: 16 }}>{t("documents.title")}</div>
          <div className={styles.docGrid}>
            {DOC_FOLDERS.map((folder) => (
              <div key={folder.key} className={styles.docFolder}>
                <div style={{ fontSize: 22, marginBottom: 4 }}>📁</div>
                <div className={styles.docFolderName}>
                  {t(`documents.folders.${folder.key}`)}
                </div>
                <div style={{ fontSize: 10, color: folder.color, fontWeight: 600 }}>
                  {folder.count} docs
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile preview */}
      <div className={styles.mobileColumn}>
        <div className={shared.muted} style={{ marginBottom: 10, textAlign: "center" }}>
          {t("mobilePreview.label")}
        </div>
        <div className={styles.mobileShell}>
          <div className={styles.mobileHeader}>
            <div className={styles.mobileBrand}>ViTAH</div>
            <div className={styles.mobileSubtitle}>{t("mobilePreview.subtitle")}</div>
          </div>
          <div className={styles.mobileBody}>
            <div className={styles.mobileCard}>
              <div className={styles.mobileCardTitle}>{t("mobilePreview.myHome")}</div>
              <div className={shared.muted} style={{ fontSize: 9, marginBottom: 6 }}>
                VTH-26-003 · Torrelavega
              </div>
              <div className={styles.mobileProgressRow}>
                <span style={{ fontSize: 10, color: "#6b6b6b" }}>{t("mobilePreview.progress")}</span>
                <span className={styles.mobilePct}>62%</span>
              </div>
              <div className={shared.progressWrap} style={{ height: 5 }}>
                <div className={shared.progressFill} style={{ width: "62%" }} />
              </div>
            </div>
            <div className={styles.mobileCard}>
              <div className={styles.mobileCardTitle} style={{ marginBottom: 7 }}>
                {t("mobilePreview.milestones")}
              </div>
              {(["H4", "H5", "H6", "H7"] as const).map((h) => (
                <div key={h} className={styles.mobileMilestone}>
                  <div className={styles.mobileMilestoneDot} data-id={h} />
                  <span className={styles.mobileMilestoneLabel}>{h}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
