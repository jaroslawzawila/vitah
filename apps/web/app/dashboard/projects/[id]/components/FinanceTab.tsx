"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProjectWithRelations } from "../../../../actions/projects";
import { createInvoice, updateInvoice, deleteInvoice } from "../../../../actions/projects";
import shared from "../../../shared.module.css";
import styles from "../page.module.css";

const INVOICE_STATUS_COLORS: Record<string, string> = {
  draft: "var(--admin-muted)",
  issued: "var(--status-blue)",
  due_soon: "var(--status-orange)",
  paid: "var(--status-green)",
  overdue: "var(--error)",
};

const INVOICE_STATUSES = ["draft", "issued", "due_soon", "paid", "overdue"] as const;

export default function FinanceTab({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const t = useTranslations("projectDetailPage");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ amount: "", description: "", dueDate: "" });

  const budgetTotal = project.budgetTotal / 100;
  const totalPaid = project.invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.amount, 0) / 100;
  const remaining = budgetTotal - totalPaid;
  const consumedPct = budgetTotal > 0 ? Math.round((totalPaid / budgetTotal) * 100) : 0;

  async function handleCreate() {
    if (!form.amount || !form.dueDate) return;
    await createInvoice(project.id, {
      amount: parseFloat(form.amount),
      description: form.description || undefined,
      dueDate: form.dueDate,
    });
    setForm({ amount: "", description: "", dueDate: "" });
    setShowForm(false);
    router.refresh();
  }

  async function handleMarkPaid(invoiceId: string) {
    await updateInvoice(invoiceId, { status: "paid" });
    router.refresh();
  }

  async function handleStatusChange(invoiceId: string, status: (typeof INVOICE_STATUSES)[number]) {
    await updateInvoice(invoiceId, { status });
    router.refresh();
  }

  async function handleDeleteInvoice(invoiceId: string) {
    await deleteInvoice(invoiceId);
    router.refresh();
  }

  return (
    <>
      {/* Budget overview */}
      <div className={`${shared.card} ${shared.mb16}`}>
        <div className={shared.cardTitle}>{t("finance.budgetOverview")}</div>
        <div className={shared.grid3}>
          <div>
            <div className={shared.muted}>{t("finance.total")}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--admin-foreground)" }}>
              €{budgetTotal.toLocaleString("es-ES")}
            </div>
          </div>
          <div>
            <div className={shared.muted}>{t("finance.spent")}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "var(--verde-oliva)" }}>
              €{totalPaid.toLocaleString("es-ES")}
            </div>
          </div>
          <div>
            <div className={shared.muted}>{t("finance.remaining")}</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: remaining < 0 ? "var(--error)" : "var(--admin-foreground)" }}>
              €{remaining.toLocaleString("es-ES")}
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12 }}>
          <div className={shared.progressWrap} style={{ height: 8 }}>
            <div
              className={shared.progressFill}
              style={{
                width: `${Math.min(consumedPct, 100)}%`,
                background: consumedPct > 90 ? "var(--error)" : "var(--verde-oliva)",
              }}
            />
          </div>
          <div className={shared.muted} style={{ marginTop: 4 }}>
            {consumedPct}% {t("finance.consumed")}
          </div>
        </div>
      </div>

      {/* Invoices */}
      <div className={shared.card}>
        <div className={shared.sectionHeader}>
          <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
            {t("finance.invoices")}
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setShowForm(!showForm)}
          >
            + {t("finance.addInvoice")}
          </button>
        </div>

        {showForm && (
          <div className={styles.inlineForm}>
            <div className={styles.inlineField}>
              <label>{t("finance.amount")} (€)</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>
            <div className={styles.inlineField} style={{ flex: 2 }}>
              <label>{t("finance.description")}</label>
              <input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className={styles.inlineField}>
              <label>{t("finance.dueDate")}</label>
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

        {project.invoices.length === 0 ? (
          <div className={shared.muted}>{t("finance.noInvoices")}</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>{t("finance.description")}</th>
                <th>{t("finance.amount")}</th>
                <th>{t("finance.dueDate")}</th>
                <th>{t("finance.status")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {project.invoices.map((inv) => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 500 }}>{inv.description ?? "—"}</td>
                  <td style={{ fontWeight: 600 }}>
                    €{(inv.amount / 100).toLocaleString("es-ES")}
                  </td>
                  <td className={shared.muted}>
                    {inv.dueDate.toLocaleDateString("es-ES")}
                  </td>
                  <td>
                    <select
                      value={inv.status}
                      onChange={(e) =>
                        handleStatusChange(inv.id, e.target.value as (typeof INVOICE_STATUSES)[number])
                      }
                      style={{
                        fontSize: 11,
                        padding: "2px 4px",
                        border: `1px solid ${INVOICE_STATUS_COLORS[inv.status]}`,
                        borderRadius: 4,
                        background: `color-mix(in srgb, ${INVOICE_STATUS_COLORS[inv.status]} 8%, transparent)`,
                        color: INVOICE_STATUS_COLORS[inv.status],
                        cursor: "pointer",
                      }}
                    >
                      {INVOICE_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`finance.statuses.${s}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      {inv.status !== "paid" && (
                        <button
                          type="button"
                          className={styles.btnSmall}
                          style={{ color: "var(--status-green)", fontSize: 10 }}
                          onClick={() => handleMarkPaid(inv.id)}
                        >
                          {t("finance.markPaid")}
                        </button>
                      )}
                      <button
                        type="button"
                        className={styles.btnSmall}
                        style={{ fontSize: 10, color: "var(--error)" }}
                        onClick={() => handleDeleteInvoice(inv.id)}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
