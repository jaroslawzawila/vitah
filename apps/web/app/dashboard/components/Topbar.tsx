"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./Topbar.module.css";

const ROUTE_TITLE_MAP: Record<string, string> = {
  "/dashboard": "dashboard",
  "/dashboard/showroom": "showroom",
  "/dashboard/projects": "projects",
  "/dashboard/technical": "technical",
  "/dashboard/logistics": "logistics",
  "/dashboard/construction": "construction",
  "/dashboard/client-app": "clientApp",
  "/dashboard/finance": "finance",
  "/dashboard/certifications": "certifications",
  "/dashboard/users": "users",
};

export default function Topbar() {
  const pathname = usePathname();
  const t = useTranslations("topbar");

  const titleKey = ROUTE_TITLE_MAP[pathname] ?? "dashboard";

  return (
    <header className={styles.topbar}>
      <div className={styles.title}>{t(`titles.${titleKey}`)}</div>

      <div className={styles.syncStatus}>
        <div className={styles.syncDot} />
        <span className={styles.syncText}>
          Web · Plataforma · App{" "}
          <strong className={styles.syncHighlight}>{t("synced")}</strong>
        </span>
      </div>

      <div className={styles.actions}>
        <button type="button" className={styles.btnPrimary}>
          + {t("newProject")}
        </button>
        <button type="button" className={styles.btnIcon} aria-label={t("notifications")}>
          🔔
        </button>
        <button type="button" className={styles.btnIcon} aria-label={t("settings")}>
          ⚙
        </button>
      </div>
    </header>
  );
}
