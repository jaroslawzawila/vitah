import { useTranslations } from "next-intl";
import { LoginForm } from "./components/LoginForm";
import styles from "./page.module.css";

export default function LoginPage() {
  const t = useTranslations("login");
  const year = new Date().getFullYear();

  return (
    <main className={styles.container}>
      <div className={styles.brand}>
        <h1 className={styles.wordmark}>ViTAH</h1>
        <p className={styles.descriptor}>{t("descriptor")}</p>
      </div>

      <LoginForm />

      <footer className={styles.footer}>
        <p>{t("footer", { year })}</p>
      </footer>
    </main>
  );
}
