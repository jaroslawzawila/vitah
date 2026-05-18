import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const STATIONS: ReadonlyArray<{ id: string; key: string; done: boolean; active?: boolean }> = [
  { id: "0", key: "digitalTwin", done: true },
  { id: "1", key: "steelCore", done: true },
  { id: "2", key: "bioSkin", done: true },
  { id: "3", key: "carpentry", done: true },
  { id: "4", key: "mep360", done: false, active: true },
  { id: "5", key: "energyZeb", done: false },
  { id: "6", key: "lifeFinishes", done: false },
];

const QUALITY_LEVELS = [
  { key: "standard", pricePerM2: 1650 },
  { key: "premium", pricePerM2: 1950 },
  { key: "luxury", pricePerM2: 2200 },
] as const;

export default function ShowroomPage() {
  const t = useTranslations("showroomPage");

  return (
    <div className={styles.layout}>
      <div>
        {/* Active session */}
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={styles.sessionHeader}>
            <div>
              <div className={styles.sessionTitle}>{t("activeSession.title")}</div>
              <div className={shared.muted}>{t("activeSession.subtitle")}</div>
            </div>
            <span className={shared.badgeGreen}>{t("activeSession.status")}</span>
          </div>
          <div className={styles.stations}>
            {STATIONS.map((st) => (
              <div key={st.id} className={styles.stationCol}>
                <div
                  className={styles.stationPill}
                  data-done={st.done || undefined}
                  data-active={st.active || undefined}
                >
                  {st.done ? "✓" : st.active ? "▶" : st.id}
                </div>
                <div className={styles.stationLabel}>
                  {t(`stations.${st.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Station detail */}
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={styles.stationDetailTitle}>
            {t("stationDetail.title")}
          </div>
          <div className={shared.muted} style={{ marginBottom: 12 }}>
            {t("stationDetail.subtitle")}
          </div>
          <div className={styles.configPlaceholder}>
            <span className={shared.muted}>{t("stationDetail.placeholder")}</span>
          </div>
        </div>

        {/* Upcoming visits */}
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("upcomingVisits.title")}</div>
          <div className={styles.configPlaceholder}>
            <span className={shared.muted}>{t("upcomingVisits.placeholder")}</span>
          </div>
        </div>
      </div>

      {/* Right column: Budget configurator */}
      <div>
        <div className={`${shared.card} ${shared.mb12}`}>
          <div className={shared.cardTitle}>{t("budgetConfigurator.title")}</div>
          <div className={styles.budgetSection}>
            <div className={shared.muted}>{t("budgetConfigurator.areaLabel")}</div>
            <input
              type="range"
              min="60"
              max="300"
              defaultValue="140"
              className={styles.rangeInput}
            />
            <div className={styles.areaDisplay}>140 m²</div>
          </div>
          <div className={styles.budgetSection}>
            <div className={shared.muted}>{t("budgetConfigurator.qualityLabel")}</div>
            {QUALITY_LEVELS.map((level) => (
              <button key={level.key} type="button" className={styles.qualityBtn}>
                <span>{t(`budgetConfigurator.levels.${level.key}`)}</span>
                <span className={shared.muted}>
                  {level.pricePerM2.toLocaleString("es-ES")}€/m²
                </span>
              </button>
            ))}
          </div>
          <div className={styles.totalSection}>
            <span className={styles.totalLabel}>{t("budgetConfigurator.total")}</span>
            <span className={styles.totalValue}>€273.000</span>
          </div>
        </div>

        {/* Client selections */}
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("selections.title")}</div>
          <div className={styles.configPlaceholder}>
            <span className={shared.muted}>{t("selections.placeholder")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
