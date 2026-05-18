import { useTranslations } from "next-intl";
import shared from "../shared.module.css";
import styles from "./page.module.css";

const PHASE_COLORS: Record<string, string> = {
  showroom: "var(--verde-oliva)",
  budget: "var(--verde-oliva-light)",
  technical: "var(--verde-oliva-dark)",
  review: "var(--status-orange)",
  dossier: "var(--status-brown)",
  logistics: "var(--status-teal)",
  construction: "var(--status-blue)",
  certified: "var(--status-green)",
};

const PROJECTS = [
  { ref: "VTH-26-001", client: "García Ruiz", m2: 140, type: "Unifamiliar", phase: "showroom", pct: 12, budget: 285000, advisor: "C. Vega", location: "Santander" },
  { ref: "VTH-26-002", client: "Martínez López", m2: 98, type: "Adosado", phase: "technical", pct: 38, budget: 198000, advisor: "I. Orbegozo", location: "Camargo" },
  { ref: "VTH-26-003", client: "Torres Const.", m2: 175, type: "Dúplex", phase: "construction", pct: 62, budget: 340000, advisor: "A. Pérez", location: "Torrelavega" },
  { ref: "VTH-25-047", client: "Rodríguez Blanco", m2: 120, type: "Unifamiliar", phase: "certified", pct: 100, budget: 245000, advisor: "C. Sainz", location: "Castro Urd." },
  { ref: "VTH-26-004", client: "Fernández Díaz", m2: 160, type: "Unifamiliar", phase: "dossier", pct: 52, budget: 310000, advisor: "M. Ruiz", location: "Santander" },
  { ref: "VTH-26-005", client: "Blanco Herrero", m2: 135, type: "Unifamiliar", phase: "budget", pct: 25, budget: 265000, advisor: "L. Gómez", location: "Santander" },
] as const;

export default function ProjectsPage() {
  const t = useTranslations("projectsPage");

  return (
    <>
      <div className={styles.filters}>
        <button type="button" className={styles.filterActive}>
          {t("filters.all", { count: PROJECTS.length })}
        </button>
        <button type="button" className={styles.filterBtn}>
          ↓ {t("filters.export")}
        </button>
      </div>

      <div className={styles.tableWrapper}>
        <table className={shared.table}>
          <thead>
            <tr>
              <th>{t("table.ref")}</th>
              <th>{t("table.client")}</th>
              <th>{t("table.type")}</th>
              <th>{t("table.budget")}</th>
              <th>{t("table.phase")}</th>
              <th>{t("table.progress")}</th>
              <th>{t("table.advisor")}</th>
              <th>{t("table.location")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p) => (
              <tr key={p.ref}>
                <td style={{ fontWeight: 600, color: "var(--verde-oliva)" }}>{p.ref}</td>
                <td style={{ fontWeight: 500 }}>{p.client}</td>
                <td style={{ color: "#6b6b6b" }}>{p.m2}m² {p.type}</td>
                <td style={{ fontWeight: 600 }}>€{p.budget.toLocaleString("es-ES")}</td>
                <td>
                  <span
                    className={shared.chip}
                    style={{
                      background: `color-mix(in srgb, ${PHASE_COLORS[p.phase]} 13%, transparent)`,
                      color: PHASE_COLORS[p.phase],
                    }}
                  >
                    {t(`phases.${p.phase}`)}
                  </span>
                </td>
                <td style={{ width: 100 }}>
                  <div className={shared.progressWrap}>
                    <div
                      className={shared.progressFill}
                      style={{
                        width: `${p.pct}%`,
                        background: PHASE_COLORS[p.phase],
                      }}
                    />
                  </div>
                  <div className={shared.muted} style={{ marginTop: 2 }}>{p.pct}%</div>
                </td>
                <td style={{ color: "#6b6b6b" }}>{p.advisor}</td>
                <td style={{ color: "#6b6b6b" }}>{p.location}</td>
                <td>
                  <button type="button" className={styles.viewBtn}>
                    {t("table.view")}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
