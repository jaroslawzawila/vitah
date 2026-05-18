import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const KPI_ITEMS = [
  { key: "issued2026", value: "23", sub: "40", color: "var(--verde-oliva)" },
  { key: "pendingApproval", value: "3", sub: "", color: "var(--status-orange)" },
  { key: "autoGenActive", value: "1", sub: "", color: "var(--status-blue)" },
] as const;

const RECENT_CERTS = [
  { ref: "VTH-25-047", client: "Rodríguez Blanco", date: "15 Oct 25", blower: "0.48 ACH", nzeb: true, m2: 120 },
  { ref: "VTH-25-041", client: "Pérez Hermanos", date: "28 Sep 25", blower: "0.52 ACH", nzeb: true, m2: 98 },
  { ref: "VTH-25-038", client: "Alonso García", date: "10 Sep 25", blower: "0.61 ACH", nzeb: false, m2: 145 },
] as const;

const CERT_SPECS = [
  { key: "blowerDoor", value: "0.48 ACH@50Pa" },
  { key: "energy", value: "nZEB Clase A+" },
  { key: "structure", value: "Garantía 50 años" },
  { key: "airtightness", value: "Passivhaus EnerPHit" },
  { key: "acoustics", value: "Clase A DB-HR" },
  { key: "buildingBook", value: "Digital · QR" },
] as const;

export default function CertificationsPage() {
  const t = useTranslations("certificationsPage");

  return (
    <>
      {/* KPIs */}
      <div className={`${shared.grid3} ${shared.mb12}`}>
        {KPI_ITEMS.map((kpi) => (
          <div key={kpi.key} className={shared.cardSm}>
            <div className={shared.muted} style={{ marginBottom: 6 }}>
              {t(`kpi.${kpi.key}.label`)}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: kpi.color }}>
              {kpi.value}
            </div>
            <div className={shared.muted} style={{ marginTop: 3 }}>
              {t(`kpi.${kpi.key}.sub`, { value: kpi.sub })}
            </div>
          </div>
        ))}
      </div>

      <div className={shared.grid2}>
        {/* Recent certifications */}
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("recent.title")}</div>
          {RECENT_CERTS.map((cert) => (
            <div key={cert.ref} className={styles.certCard}>
              <div className={styles.certHeader}>
                <div>
                  <div className={styles.certClient}>
                    {cert.client} — {cert.m2}m²
                  </div>
                  <div className={shared.muted}>
                    {cert.ref} · {t("recent.issued")} {cert.date}
                  </div>
                </div>
                <div className={styles.shieldIcon}>🛡</div>
              </div>
              <div className={styles.certBadges}>
                <span className={shared.badgeBlue}>Blower Door {cert.blower}</span>
                {cert.nzeb ? (
                  <span className={shared.badgeGreen}>nZEB Clase A+ ✓</span>
                ) : (
                  <span className={shared.badgeMuted}>Clase B</span>
                )}
                <span className={shared.badgeGreen}>{t("recent.warranty50")}</span>
              </div>
            </div>
          ))}
          <div className={styles.autoDetection}>
            🤖 <strong className={styles.autoDetectionHighlight}>{t("recent.autoDetection.title")}:</strong>{" "}
            {t("recent.autoDetection.description")}
          </div>
        </div>

        {/* Certificate preview */}
        <div className={shared.card}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--admin-foreground)", marginBottom: 6 }}>
            {t("preview.title")}
          </div>
          <div className={shared.muted} style={{ marginBottom: 12 }}>
            {t("preview.subtitle")}
          </div>
          <div className={styles.certPreview}>
            <div className={styles.certBrand}>ViTAH</div>
            <div className={styles.certSubtitle}>{t("preview.certTitle")}</div>
            <div className={styles.certShield}>🛡</div>
            <div className={styles.certName}>RODRÍGUEZ BLANCO</div>
            <div className={shared.muted} style={{ marginBottom: 14 }}>
              {t("preview.projectDescription")}
            </div>
            <div className={styles.specGrid}>
              {CERT_SPECS.map((spec) => (
                <div key={spec.key} className={styles.specItem}>
                  <div className={shared.muted} style={{ fontSize: 9 }}>
                    {t(`preview.specs.${spec.key}`)}
                  </div>
                  <div className={styles.specValue}>{spec.value}</div>
                </div>
              ))}
            </div>
            <div className={styles.certDate}>
              {t("preview.issuedDigitally")} · 15 Oct 2025 · ViTAH OS v2.4
            </div>
          </div>
          <button type="button" className={styles.downloadBtn}>
            ⬇ {t("preview.download")}
          </button>
        </div>
      </div>
    </>
  );
}
