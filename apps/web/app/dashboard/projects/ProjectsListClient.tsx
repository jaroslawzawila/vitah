"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { createProject } from "../../actions/projects";
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

const TYPE_LABELS: Record<string, string> = {
  unifamiliar: "Unifamiliar",
  adosado: "Adosado",
  duplex: "Dúplex",
};

type Project = {
  id: string;
  ref: string;
  clientName: string;
  areaM2: number;
  type: string;
  phase: string;
  progressPct: number;
  budgetTotal: number;
  location: string;
  advisor: { id: string; name: string | null } | null;
};

export default function ProjectsListClient({
  projects,
}: {
  projects: Project[];
}) {
  const t = useTranslations("projectsPage");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const [state, formAction, isPending] = useActionState(
    async (
      prev: { error?: string; success?: boolean; id?: string } | null,
      formData: FormData,
    ) => {
      const result = await createProject(prev, formData);
      if (result?.success && result.id) {
        setShowForm(false);
        router.refresh();
        router.push(`/dashboard/projects/${result.id}`);
      }
      return result;
    },
    null,
  );

  return (
    <>
      <div className={styles.filters}>
        <button type="button" className={styles.filterActive}>
          {t("filters.all", { count: projects.length })}
        </button>
        <button type="button" className={styles.filterBtn}>
          ↓ {t("filters.export")}
        </button>
        <button
          type="button"
          className={styles.newProjectBtn}
          onClick={() => setShowForm(!showForm)}
        >
          + {t("newProject")}
        </button>
      </div>

      {showForm && (
        <form action={formAction} className={styles.createForm}>
          <div className={styles.createField}>
            <label>{t("createForm.ref")}</label>
            <input name="ref" required placeholder={t("createForm.refPlaceholder")} />
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.clientName")}</label>
            <input name="clientName" required placeholder={t("createForm.clientPlaceholder")} />
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.areaM2")}</label>
            <input name="areaM2" type="number" required placeholder="140" />
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.type")}</label>
            <select name="type" required>
              <option value="unifamiliar">{t("createForm.types.unifamiliar")}</option>
              <option value="adosado">{t("createForm.types.adosado")}</option>
              <option value="duplex">{t("createForm.types.duplex")}</option>
            </select>
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.location")}</label>
            <input name="location" required placeholder={t("createForm.locationPlaceholder")} />
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.budget")}</label>
            <input name="budgetTotal" type="number" step="0.01" required placeholder="285000" />
          </div>
          <div className={styles.createField}>
            <label>{t("createForm.qualityLevel")}</label>
            <select name="qualityLevel">
              <option value="standard">{t("createForm.levels.standard")}</option>
              <option value="premium">{t("createForm.levels.premium")}</option>
              <option value="luxury">{t("createForm.levels.luxury")}</option>
            </select>
          </div>
          <div className={styles.createActions}>
            <button type="submit" className={styles.createSubmit} disabled={isPending}>
              {isPending ? "..." : t("createForm.create")}
            </button>
            <button
              type="button"
              className={styles.createCancel}
              onClick={() => setShowForm(false)}
            >
              {t("createForm.cancel")}
            </button>
            {state?.error && (
              <span className={styles.createError}>
                {t(`createForm.errors.${state.error}`)}
              </span>
            )}
          </div>
        </form>
      )}

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
            {projects.map((p) => {
              const phaseColor = PHASE_COLORS[p.phase] ?? "var(--admin-muted)";
              return (
                <tr key={p.id}>
                  <td style={{ fontWeight: 600, color: "var(--verde-oliva)" }}>
                    {p.ref}
                  </td>
                  <td style={{ fontWeight: 500 }}>{p.clientName}</td>
                  <td style={{ color: "#6b6b6b" }}>
                    {p.areaM2}m² {TYPE_LABELS[p.type] ?? p.type}
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    €{(p.budgetTotal / 100).toLocaleString("es-ES")}
                  </td>
                  <td>
                    <span
                      className={shared.chip}
                      style={{
                        background: `color-mix(in srgb, ${phaseColor} 13%, transparent)`,
                        color: phaseColor,
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
                          width: `${p.progressPct}%`,
                          background: phaseColor,
                        }}
                      />
                    </div>
                    <div className={shared.muted} style={{ marginTop: 2 }}>
                      {p.progressPct}%
                    </div>
                  </td>
                  <td style={{ color: "#6b6b6b" }}>
                    {p.advisor?.name ?? "—"}
                  </td>
                  <td style={{ color: "#6b6b6b" }}>{p.location}</td>
                  <td>
                    <Link href={`/dashboard/projects/${p.id}`} className={styles.viewBtn}>
                      {t("table.view")}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
