import { auth, signOut } from "../../auth";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./page.module.css";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/");

  return <DashboardContent email={session.user.email ?? ""} />;
}

function DashboardContent({ email }: { email: string }) {
  const t = useTranslations("dashboard");

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.wordmark}>ViTAH</h1>
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button type="submit" className={styles.signOutBtn}>
            {t("signOut")}
          </button>
        </form>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{t("welcome")}</h2>
        <p className={styles.greeting}>{t("greeting", { email })}</p>
      </div>
    </main>
  );
}
