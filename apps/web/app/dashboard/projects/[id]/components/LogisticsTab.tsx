"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProjectWithRelations } from "../../../../actions/projects";
import { createOrder, updateOrder, deleteOrder } from "../../../../actions/projects";
import shared from "../../../shared.module.css";
import styles from "../page.module.css";

const ORDER_STATUS_COLORS: Record<string, string> = {
  pending: "var(--admin-muted)",
  ordered: "var(--status-orange)",
  confirmed: "var(--status-teal)",
  in_transit: "var(--status-blue)",
  delivered: "var(--status-green)",
};

const ORDER_STATUSES = ["pending", "ordered", "confirmed", "in_transit", "delivered"] as const;

export default function LogisticsTab({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const t = useTranslations("projectDetailPage");
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    materialDescription: "",
    supplier: "",
    quantity: "",
    orderDate: "",
    eta: "",
    jitWeek: "",
  });

  async function handleCreate() {
    if (!form.materialDescription || !form.supplier) return;
    await createOrder(project.id, {
      materialDescription: form.materialDescription,
      supplier: form.supplier,
      quantity: form.quantity || undefined,
      orderDate: form.orderDate || undefined,
      eta: form.eta || undefined,
      jitWeek: form.jitWeek || undefined,
    });
    setForm({ materialDescription: "", supplier: "", quantity: "", orderDate: "", eta: "", jitWeek: "" });
    setShowForm(false);
    router.refresh();
  }

  async function handleStatusChange(orderId: string, status: (typeof ORDER_STATUSES)[number]) {
    await updateOrder(orderId, { status });
    router.refresh();
  }

  async function handleDeleteOrder(orderId: string) {
    await deleteOrder(orderId);
    router.refresh();
  }

  // JIT timeline: group orders by jitWeek
  const jitOrders = project.materialOrders
    .filter((o) => o.jitWeek)
    .sort((a, b) => {
      const weekA = parseInt(a.jitWeek?.replace(/\D/g, "") ?? "0", 10);
      const weekB = parseInt(b.jitWeek?.replace(/\D/g, "") ?? "0", 10);
      return weekA - weekB;
    });

  return (
    <>
      {/* Orders table */}
      <div className={`${shared.card} ${shared.mb16}`}>
        <div className={shared.sectionHeader}>
          <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
            {t("logistics.orders")}
          </div>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={() => setShowForm(!showForm)}
          >
            + {t("logistics.addOrder")}
          </button>
        </div>

        {showForm && (
          <div className={styles.inlineForm}>
            <div className={styles.inlineField} style={{ flex: 2 }}>
              <label>{t("logistics.material")}</label>
              <input
                value={form.materialDescription}
                onChange={(e) => setForm({ ...form, materialDescription: e.target.value })}
              />
            </div>
            <div className={styles.inlineField}>
              <label>{t("logistics.supplier")}</label>
              <input
                value={form.supplier}
                onChange={(e) => setForm({ ...form, supplier: e.target.value })}
              />
            </div>
            <div className={styles.inlineField}>
              <label>{t("logistics.quantity")}</label>
              <input
                value={form.quantity}
                onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              />
            </div>
            <div className={styles.inlineField}>
              <label>{t("logistics.jitWeek")}</label>
              <input
                value={form.jitWeek}
                onChange={(e) => setForm({ ...form, jitWeek: e.target.value })}
                placeholder="e.g. Sem 12"
              />
            </div>
            <div className={styles.inlineField}>
              <label>ETA</label>
              <input
                type="date"
                value={form.eta}
                onChange={(e) => setForm({ ...form, eta: e.target.value })}
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

        {project.materialOrders.length === 0 ? (
          <div className={shared.muted}>{t("logistics.noOrders")}</div>
        ) : (
          <table className={shared.table}>
            <thead>
              <tr>
                <th>{t("logistics.material")}</th>
                <th>{t("logistics.supplier")}</th>
                <th>{t("logistics.quantity")}</th>
                <th>{t("logistics.jitWeek")}</th>
                <th>ETA</th>
                <th>{t("logistics.status")}</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {project.materialOrders.map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 500 }}>{order.materialDescription}</td>
                  <td>{order.supplier}</td>
                  <td className={shared.muted}>{order.quantity ?? "—"}</td>
                  <td className={shared.muted}>{order.jitWeek ?? "—"}</td>
                  <td className={shared.muted}>
                    {order.eta ? order.eta.toLocaleDateString("es-ES") : "—"}
                  </td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order.id, e.target.value as (typeof ORDER_STATUSES)[number])
                      }
                      style={{
                        fontSize: 11,
                        padding: "2px 4px",
                        border: `1px solid ${ORDER_STATUS_COLORS[order.status]}`,
                        borderRadius: 4,
                        background: `color-mix(in srgb, ${ORDER_STATUS_COLORS[order.status]} 8%, transparent)`,
                        color: ORDER_STATUS_COLORS[order.status],
                        cursor: "pointer",
                      }}
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {t(`logistics.statuses.${s}`)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={styles.btnSmall}
                      style={{ fontSize: 10, color: "var(--error)" }}
                      onClick={() => handleDeleteOrder(order.id)}
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* JIT Timeline */}
      {jitOrders.length > 0 && (
        <div className={shared.card}>
          <div className={shared.cardTitle}>{t("logistics.jitTimeline")}</div>
          <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
            {jitOrders.map((order, i) => (
              <div
                key={order.id}
                style={{
                  flex: 1,
                  minWidth: 90,
                  textAlign: "center",
                  padding: "8px 4px",
                  borderBottom: `3px solid ${ORDER_STATUS_COLORS[order.status]}`,
                  position: "relative",
                }}
              >
                <div style={{ fontSize: 10, fontWeight: 700, color: ORDER_STATUS_COLORS[order.status] }}>
                  {order.jitWeek}
                </div>
                <div style={{ fontSize: 10, color: "var(--admin-muted)", marginTop: 2 }}>
                  {order.materialDescription.split("(")[0]?.trim().substring(0, 20)}
                </div>
                {i < jitOrders.length - 1 && (
                  <div
                    style={{
                      position: "absolute",
                      right: -4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: 10,
                      color: "var(--admin-muted)",
                    }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
