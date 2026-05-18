import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      {/* ── Nav ── */}
      <nav className={styles.nav}>
        <div className={styles.logo}>
          vita<span className={styles.logoAccent}>h</span>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <a href="#features" className={styles.navLink}>
              Features
            </a>
          </li>
          <li>
            <a href="#how-it-works" className={styles.navLink}>
              How It Works
            </a>
          </li>
          <li>
            <a href="#get-started" className={styles.navCta}>
              Get Started
            </a>
          </li>
        </ul>
      </nav>

      {/* ── Hero ── */}
      <section className={styles.hero}>
        <span className={styles.badge}>Now in early access</span>
        <h1 className={styles.heroTitle}>
          Your health,{" "}
          <span className={styles.heroHighlight}>simplified</span>
        </h1>
        <p className={styles.heroSub}>
          Vitah brings together personalized insights, daily tracking, and
          actionable guidance so you can make better health decisions — without
          the overwhelm.
        </p>
        <div className={styles.heroCtas}>
          <a href="#get-started" className={styles.btnPrimary}>
            Start for free &rarr;
          </a>
          <a href="#features" className={styles.btnSecondary}>
            See how it works
          </a>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className={styles.features}>
        <span className={styles.sectionLabel}>Features</span>
        <h2 className={styles.sectionTitle}>Everything you need in one place</h2>
        <p className={styles.sectionSub}>
          No more switching between apps. Vitah gives you a single, clear view
          of what matters most.
        </p>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\u2764\uFE0F"}
            </div>
            <h3 className={styles.featureTitle}>Health Dashboard</h3>
            <p className={styles.featureDesc}>
              See your vitals, trends, and progress at a glance with a
              beautifully designed personal dashboard.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\uD83D\uDCCA"}
            </div>
            <h3 className={styles.featureTitle}>Smart Insights</h3>
            <p className={styles.featureDesc}>
              AI-powered analysis turns your data into clear, actionable
              recommendations tailored to your goals.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\uD83D\uDD14"}
            </div>
            <h3 className={styles.featureTitle}>Gentle Reminders</h3>
            <p className={styles.featureDesc}>
              Stay on track with timely nudges for hydration, movement, meds,
              and more — customized to your routine.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\uD83E\uDDEC"}
            </div>
            <h3 className={styles.featureTitle}>Lab Integration</h3>
            <p className={styles.featureDesc}>
              Connect your lab results and wearables for a complete picture of
              your health over time.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\uD83D\uDD12"}
            </div>
            <h3 className={styles.featureTitle}>Privacy First</h3>
            <p className={styles.featureDesc}>
              Your data is encrypted end-to-end. We never sell your information
              — your health data belongs to you.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon} aria-hidden="true">
              {"\uD83C\uDF1F"}
            </div>
            <h3 className={styles.featureTitle}>Goal Tracking</h3>
            <p className={styles.featureDesc}>
              Set meaningful health goals and watch your progress with
              motivating streaks and milestones.
            </p>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className={styles.howItWorks}>
        <span className={styles.sectionLabel}>How It Works</span>
        <h2 className={styles.sectionTitle}>Up and running in minutes</h2>
        <p className={styles.sectionSub}>
          Getting started takes less than two minutes — no complex setup
          required.
        </p>

        <div className={styles.steps}>
          <div className={styles.step}>
            <div className={styles.stepNumber}>1</div>
            <h3 className={styles.stepTitle}>Create your profile</h3>
            <p className={styles.stepDesc}>
              Tell us about your health goals and preferences so we can
              personalize your experience.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>2</div>
            <h3 className={styles.stepTitle}>Connect your data</h3>
            <p className={styles.stepDesc}>
              Link wearables, import lab results, or just start logging manually
              — whatever works for you.
            </p>
          </div>

          <div className={styles.step}>
            <div className={styles.stepNumber}>3</div>
            <h3 className={styles.stepTitle}>Get insights</h3>
            <p className={styles.stepDesc}>
              Receive personalized recommendations and track your progress
              toward better health.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section id="get-started" className={styles.cta}>
        <div className={styles.ctaBox}>
          <h2 className={styles.ctaTitle}>Ready to take control?</h2>
          <p className={styles.ctaSub}>
            Join thousands already using Vitah to build healthier habits and
            understand their bodies better.
          </p>
          <a href="#" className={styles.ctaBtn}>
            Get early access &rarr;
          </a>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} Vitah. All rights reserved.</p>
      </footer>
    </>
  );
}
