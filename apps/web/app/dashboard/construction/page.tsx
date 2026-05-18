import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const MILESTONES: ReadonlyArray<{ id: string; key: string; done: boolean; date: string; photos?: number; active?: boolean }> = [
  { id: "H1", key: "foundation", done: true, date: "15 Ene", photos: 6 },
  { id: "H2", key: "steelStructure", done: true, date: "28 Ene", photos: 12 },
  { id: "H3", key: "roofSeal", done: true, date: "10 Feb", photos: 8 },
  { id: "H4", key: "bioSkin", done: true, date: "5 Mar", photos: 9 },
  { id: "H5", key: "exteriorCarpentry", done: true, date: "22 Mar", photos: 11 },
  { id: "H6", key: "mepRoughIn", done: false, date: "Est. 20 May", active: true },
  { id: "H7", key: "drywall", done: false, date: "Est. 3 Jun" },
  { id: "H8", key: "interiorFinishes", done: false, date: "Est. 25 Jun" },
  { id: "H9", key: "finalInstallations", done: false, date: "Est. 10 Jul" },
  { id: "H10", key: "handover", done: false, date: "Est. 5 Ago" },
];

const ACTIVE_SITES: ReadonlyArray<{ client: string; ref: string; pct: number; color: string; noteKey?: string }> = [
  { client: "Torres Const.", ref: "VTH-26-003", pct: 62, color: "var(--verde-oliva)" },
  { client: "Alonso García", ref: "VTH-25-052", pct: 85, color: "var(--verde-oliva-dark)" },
  { client: "García Ruiz", ref: "VTH-26-001", pct: 0, color: "var(--admin-muted)", noteKey: "pendingPermit" },
];

const QC_ITEMS = [
  { key: "layout", value: "±5mm", pass: true },
  { key: "structurePlumb", value: "0.2%", pass: true },
  { key: "blowerDoor", value: "0.6 ACH@50Pa", pass: true },
  { key: "thermochipSeal", value: "", pass: true },
  { key: "mepRoughIn", value: "", pass: false },
] as const;

export default function ConstructionPage() {
  const t = useTranslations("constructionPage");

  return (
    <div className={styles.layout}>
      <div>
        {/* Project header */}
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={styles.projectHeader}>
            <div>
              <div className={styles.projectTitle}>Torres Const. — VTH-26-003</div>
              <div className={shared.muted}>{t("projectInfo.subtitle")}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className={styles.progressBig}>62%</div>
              <div className={shared.muted}>{t("projectInfo.week", { current: 10, total: 22 })}</div>
            </div>
          </div>
          <div className={shared.progressWrap} style={{ height: 8 }}>
            <div className={shared.progressFill} style={{ width: "62%" }} />
          </div>
        </div>

        {/* Milestones */}
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("milestones.title")}</div>
          {MILESTONES.map((m) => (
            <div
              key={m.id}
              className={styles.milestoneRow}
              data-active={m.active || undefined}
            >
              <div
                className={styles.milestoneCircle}
                data-done={m.done || undefined}
                data-active={m.active || undefined}
              >
                {m.done ? "✓" : m.id.replace("H", "")}
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div
                    className={styles.milestoneName}
                    data-done={m.done || undefined}
                    data-active={m.active || undefined}
                  >
                    {t(`milestones.items.${m.key}`)}
                  </div>
                  {m.photos ? (
                    <span className={shared.muted}>
                      📷 {m.photos} {t("milestones.photos")}
                    </span>
                  ) : null}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 10 }}>
                  <div className={shared.muted}>{m.date}</div>
                  {m.active && (
                    <span className={styles.activeLabel}>● {t("milestones.inProgress")}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div>
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("activeSites.title")}</div>
          {ACTIVE_SITES.map((site) => (
            <div key={site.ref} style={{ marginBottom: 12 }}>
              <div className={styles.siteHeader}>
                <span className={styles.siteClient}>{site.client}</span>
                <span style={{ fontSize: 11, color: site.color, fontWeight: 600 }}>{site.pct}%</span>
              </div>
              <div className={shared.progressWrap}>
                <div className={shared.progressFill} style={{ width: `${site.pct}%`, background: site.color }} />
              </div>
              <div className={shared.muted} style={{ marginTop: 2 }}>
                {site.ref}{site.noteKey ? ` — ${t(`activeSites.notes.${site.noteKey}`)}` : ""}
              </div>
            </div>
          ))}
        </div>

        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("photos.title")}</div>
          <div className={styles.photoGrid}>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} type="button" className={n <= 2 ? styles.photoFilled : styles.photoEmpty}>
                <span style={{ fontSize: 20 }}>{n <= 2 ? "🖼" : "📷"}</span>
                <span className={styles.photoLabel}>
                  {n <= 2 ? t("photos.view") : t("photos.upload")}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className={shared.card}>
          <div className={shared.cardTitle} style={{ fontSize: 12 }}>{t("qualityControl.title")}</div>
          {QC_ITEMS.map((qc) => (
            <div key={qc.key} className={`${styles.qcRow} ${shared.rowSep}`}>
              <div>
                <div className={styles.qcName}>{t(`qualityControl.items.${qc.key}.name`)}</div>
                <div className={shared.muted}>{t(`qualityControl.items.${qc.key}.detail`)}</div>
              </div>
              <span className={qc.pass ? styles.qcPass : styles.qcPending}>
                {qc.pass ? "✓" : "…"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
