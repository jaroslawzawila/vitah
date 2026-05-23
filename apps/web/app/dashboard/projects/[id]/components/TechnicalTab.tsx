"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProjectWithRelations } from "../../../../actions/projects";
import { createTask, updateTask, deleteTask } from "../../../../actions/projects";
import shared from "../../../shared.module.css";
import styles from "../page.module.css";

const PRIORITY_COLORS: Record<string, string> = {
  high: "var(--error)",
  medium: "var(--status-orange)",
  low: "var(--admin-muted)",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "var(--admin-muted)",
  in_process: "var(--status-blue)",
  in_review: "var(--status-orange)",
  completed: "var(--status-green)",
};

const DEPARTMENTS = ["architecture", "structural", "installations", "documentation", "bim"];
const PRIORITIES = ["low", "medium", "high"] as const;
const STATUSES = ["pending", "in_process", "in_review", "completed"] as const;

export default function TechnicalTab({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const t = useTranslations("projectDetailPage");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    department: "architecture",
    priority: "medium" as (typeof PRIORITIES)[number],
    dueDate: "",
  });

  async function handleCreate() {
    if (!form.title) return;
    await createTask(project.id, {
      title: form.title,
      department: form.department,
      priority: form.priority,
      dueDate: form.dueDate || undefined,
    });
    setForm({ title: "", department: "architecture", priority: "medium", dueDate: "" });
    setShowForm(false);
    router.refresh();
  }

  async function handleStatusChange(taskId: string, status: (typeof STATUSES)[number]) {
    await updateTask(taskId, { status });
    router.refresh();
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId);
    setEditingId(null);
    router.refresh();
  }

  return (
    <div className={shared.card}>
      <div className={shared.sectionHeader}>
        <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
          {t("technical.tasks")}
        </div>
        <button
          type="button"
          className={styles.btnPrimary}
          onClick={() => setShowForm(!showForm)}
        >
          + {t("technical.addTask")}
        </button>
      </div>

      {showForm && (
        <div className={styles.inlineForm}>
          <div className={styles.inlineField} style={{ flex: 2 }}>
            <label>{t("technical.title")}</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>
          <div className={styles.inlineField}>
            <label>{t("technical.department")}</label>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {t(`technical.departments.${d}`)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inlineField}>
            <label>{t("technical.priority")}</label>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as typeof form.priority })}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {t(`technical.priorities.${p}`)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.inlineField}>
            <label>{t("technical.dueDate")}</label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
          <button type="button" className={styles.btnPrimary} onClick={handleCreate}>
            {t("actions.create")}
          </button>
          <button type="button" className={styles.btnSmall} onClick={() => setShowForm(false)}>
            {t("actions.cancel")}
          </button>
        </div>
      )}

      {project.tasks.length === 0 ? (
        <div className={shared.muted}>{t("technical.noTasks")}</div>
      ) : (
        <table className={shared.table}>
          <thead>
            <tr>
              <th>{t("technical.title")}</th>
              <th>{t("technical.department")}</th>
              <th>{t("technical.priority")}</th>
              <th>{t("technical.status")}</th>
              <th>{t("technical.dueDate")}</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {project.tasks.map((task) => (
              <tr key={task.id}>
                <td style={{ fontWeight: 500 }}>{task.title}</td>
                <td>
                  <span className={shared.chip} style={{ background: "var(--admin-muted-bg)", color: "var(--admin-muted)" }}>
                    {t(`technical.departments.${task.department}`)}
                  </span>
                </td>
                <td>
                  <span
                    className={shared.chip}
                    style={{
                      background: `color-mix(in srgb, ${PRIORITY_COLORS[task.priority]} 13%, transparent)`,
                      color: PRIORITY_COLORS[task.priority],
                    }}
                  >
                    {t(`technical.priorities.${task.priority}`)}
                  </span>
                </td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value as (typeof STATUSES)[number])
                    }
                    style={{
                      fontSize: 11,
                      padding: "2px 4px",
                      border: `1px solid ${STATUS_COLORS[task.status]}`,
                      borderRadius: 4,
                      background: `color-mix(in srgb, ${STATUS_COLORS[task.status]} 8%, transparent)`,
                      color: STATUS_COLORS[task.status],
                      cursor: "pointer",
                    }}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {t(`technical.statuses.${s}`)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={shared.muted}>
                  {task.dueDate ? task.dueDate.toLocaleDateString("es-ES") : "—"}
                </td>
                <td>
                  {editingId === task.id ? (
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        type="button"
                        className={styles.btnDanger}
                        onClick={() => handleDelete(task.id)}
                      >
                        {t("actions.delete")}
                      </button>
                      <button
                        type="button"
                        className={styles.btnSmall}
                        onClick={() => setEditingId(null)}
                      >
                        {t("actions.cancel")}
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className={styles.btnSmall}
                      style={{ fontSize: 10 }}
                      onClick={() => setEditingId(task.id)}
                    >
                      ✕
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
