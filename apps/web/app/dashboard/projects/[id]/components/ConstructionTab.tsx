"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProjectWithRelations } from "../../../../actions/projects";
import {
  updateMilestoneStatus,
  createQualityCheck,
  updateQualityCheck,
  deleteQualityCheck,
} from "../../../../actions/projects";
import shared from "../../../shared.module.css";
import styles from "../page.module.css";

const STATUS_COLORS: Record<string, string> = {
  completed: "var(--status-green)",
  in_progress: "var(--status-blue)",
  pending: "var(--admin-muted)",
};

const QC_COLORS: Record<string, string> = {
  pass: "var(--status-green)",
  fail: "var(--error)",
  pending: "var(--admin-muted)",
};

export default function ConstructionTab({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const t = useTranslations("projectDetailPage");
  const router = useRouter();
  const [showQcForm, setShowQcForm] = useState(false);
  const [qcName, setQcName] = useState("");
  const [qcDetail, setQcDetail] = useState("");

  async function handleMilestoneToggle(
    milestoneId: string,
    currentStatus: string,
  ) {
    const nextStatus =
      currentStatus === "pending"
        ? "in_progress"
        : currentStatus === "in_progress"
          ? "completed"
          : "pending";
    await updateMilestoneStatus(
      milestoneId,
      nextStatus as "pending" | "in_progress" | "completed",
    );
    router.refresh();
  }

  async function handleAddQc() {
    if (!qcName || !qcDetail) return;
    await createQualityCheck(project.id, { name: qcName, detail: qcDetail });
    setQcName("");
    setQcDetail("");
    setShowQcForm(false);
    router.refresh();
  }

  async function handleQcResult(id: string, result: "pass" | "fail", measuredValue?: string) {
    await updateQualityCheck(id, { result, measuredValue });
    router.refresh();
  }

  async function handleDeleteQc(id: string) {
    await deleteQualityCheck(id);
    router.refresh();
  }

  return (
    <>
      {/* Milestones */}
      <div className={`${shared.card} ${shared.mb16}`}>
        <div className={shared.cardTitle}>{t("construction.milestones")}</div>
        {project.milestones.length === 0 ? (
          <div className={shared.muted}>{t("construction.noMilestones")}</div>
        ) : (
          project.milestones.map((milestone) => (
            <div key={milestone.id} className={styles.milestoneRow}>
              <span className={styles.milestoneCode}>{milestone.code}</span>
              <span className={styles.milestoneName}>{milestone.name}</span>
              {milestone.photoCount > 0 && (
                <span className={styles.milestonePhotos}>
                  {milestone.photoCount} {t("construction.photos")}
                </span>
              )}
              <div className={styles.milestoneStatus}>
                <button
                  type="button"
                  className={shared.chip}
                  style={{
                    background: `color-mix(in srgb, ${STATUS_COLORS[milestone.status]} 13%, transparent)`,
                    color: STATUS_COLORS[milestone.status],
                    cursor: "pointer",
                    border: "none",
                  }}
                  onClick={() =>
                    handleMilestoneToggle(milestone.id, milestone.status)
                  }
                >
                  {milestone.status === "completed"
                    ? "✓"
                    : milestone.status === "in_progress"
                      ? "●"
                      : "○"}{" "}
                  {milestone.status.replace("_", " ")}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quality Control */}
      <div className={shared.card}>
        <div className={shared.sectionHeader}>
          <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
            {t("construction.qualityControl")}
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setShowQcForm(!showQcForm)}
          >
            + {t("construction.addQc")}
          </button>
        </div>

        {showQcForm && (
          <div className={styles.inlineForm}>
            <div className={styles.inlineField}>
              <label>{t("construction.qcName")}</label>
              <input
                value={qcName}
                onChange={(e) => setQcName(e.target.value)}
                placeholder="e.g. Blower Door Test"
              />
            </div>
            <div className={styles.inlineField}>
              <label>{t("construction.qcDetail")}</label>
              <input
                value={qcDetail}
                onChange={(e) => setQcDetail(e.target.value)}
                placeholder="e.g. Objetivo < 0.6 ACH@50Pa"
              />
            </div>
            <button type="button" className={styles.btnPrimary} onClick={handleAddQc}>
              {t("actions.create")}
            </button>
            <button
              type="button"
              className={styles.btnSmall}
              onClick={() => setShowQcForm(false)}
            >
              {t("actions.cancel")}
            </button>
          </div>
        )}

        {project.qualityChecks.map((qc) => (
          <div
            key={qc.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 0",
              borderBottom: "1px solid var(--admin-separator)",
              fontSize: 12,
            }}
          >
            <span
              className={shared.chip}
              style={{
                background: `color-mix(in srgb, ${QC_COLORS[qc.result]} 13%, transparent)`,
                color: QC_COLORS[qc.result],
              }}
            >
              {qc.result}
            </span>
            <span style={{ fontWeight: 600, flex: 1 }}>{qc.name}</span>
            <span className={shared.muted}>{qc.detail}</span>
            {qc.measuredValue && (
              <span style={{ fontWeight: 600 }}>{qc.measuredValue}</span>
            )}
            {qc.result === "pending" && (
              <>
                <button
                  type="button"
                  className={styles.btnSmall}
                  style={{ color: "var(--status-green)" }}
                  onClick={() => handleQcResult(qc.id, "pass")}
                >
                  Pass
                </button>
                <button
                  type="button"
                  className={styles.btnSmall}
                  style={{ color: "var(--error)" }}
                  onClick={() => handleQcResult(qc.id, "fail")}
                >
                  Fail
                </button>
              </>
            )}
            <button
              type="button"
              className={styles.btnSmall}
              style={{ color: "var(--error)", fontSize: 10 }}
              onClick={() => handleDeleteQc(qc.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
