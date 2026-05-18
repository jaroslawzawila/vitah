"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./Sidebar.module.css";

const NAV_ITEMS = [
  { key: "dashboard", href: "/dashboard", icon: "\u229E" },
  { key: "showroom", href: "/dashboard/showroom", icon: "\u2302" },
  { key: "projects", href: "/dashboard/projects", icon: "\u25EB" },
  { key: "technical", href: "/dashboard/technical", icon: "\u2699" },
  { key: "logistics", href: "/dashboard/logistics", icon: "\u25C8" },
  { key: "construction", href: "/dashboard/construction", icon: "\u25E7" },
  { key: "clientApp", href: "/dashboard/client-app", icon: "\u25A3" },
  { key: "finance", href: "/dashboard/finance", icon: "\u25C9" },
  { key: "certifications", href: "/dashboard/certifications", icon: "\u25C6" },
  { key: "users", href: "/dashboard/users", icon: "\u25D0" },
] as const;

export default function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations("sidebar");

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoMark}>V</div>
        <div>
          <div className={styles.logoBrand}>ViTAH</div>
          <div className={styles.logoSub}>OS Platform</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.key}
              href={item.href}
              className={isActive ? styles.navItemActive : styles.navItem}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className={styles.userArea}>
        <div className={styles.avatar}>A</div>
        <div>
          <div className={styles.userName}>Admin ViTAH</div>
          <div className={styles.userLocation}>Santander · HQ</div>
        </div>
      </div>
    </aside>
  );
}
