"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import type { ProjectWithRelations } from "../../../../actions/projects";
import { createDocument, deleteDocument } from "../../../../actions/projects";
import shared from "../../../shared.module.css";
import styles from "../page.module.css";

const CATEGORIES = [
  "basic_project",
  "construction_plans",
  "licenses",
  "quality_control",
  "photos",
  "certifications",
  "warranties",
  "building_book",
  "insurance",
] as const;

export default function DocumentsTab({
  project,
}: {
  project: ProjectWithRelations;
}) {
  const t = useTranslations("projectDetailPage");
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ fileName: "", fileUrl: "" });

  // Group documents by category
  const docsByCategory = new Map<string, typeof project.documents>();
  for (const cat of CATEGORIES) {
    docsByCategory.set(cat, []);
  }
  for (const doc of project.documents) {
    const existing = docsByCategory.get(doc.category) ?? [];
    existing.push(doc);
    docsByCategory.set(doc.category, existing);
  }

  async function handleCreate() {
    if (!form.fileName || !form.fileUrl || !activeCategory) return;
    await createDocument(project.id, {
      category: activeCategory,
      fileName: form.fileName,
      fileUrl: form.fileUrl,
    });
    setForm({ fileName: "", fileUrl: "" });
    setShowForm(false);
    router.refresh();
  }

  async function handleDeleteDoc(docId: string) {
    await deleteDocument(docId);
    router.refresh();
  }

  const activeDocs = activeCategory ? (docsByCategory.get(activeCategory) ?? []) : [];

  return (
    <>
      <div className={shared.cardTitle}>{t("documents.title")}</div>

      {/* Folder grid */}
      <div className={`${styles.folderGrid} ${shared.mb16}`}>
        {CATEGORIES.map((cat) => {
          const docs = docsByCategory.get(cat) ?? [];
          return (
            <button
              key={cat}
              type="button"
              className={activeCategory === cat ? styles.folderActive : styles.folder}
              onClick={() => {
                setActiveCategory(activeCategory === cat ? null : cat);
                setShowForm(false);
              }}
            >
              <div className={styles.folderName}>{t(`documents.categories.${cat}`)}</div>
              <div className={styles.folderCount}>{docs.length} docs</div>
            </button>
          );
        })}
      </div>

      {/* Active category documents */}
      {activeCategory && (
        <div className={shared.card}>
          <div className={shared.sectionHeader}>
            <div className={shared.cardTitle} style={{ marginBottom: 0 }}>
              {t(`documents.categories.${activeCategory}`)}
            </div>
            <button
              type="button"
              className={styles.btnPrimary}
              onClick={() => setShowForm(!showForm)}
            >
              + {t("documents.addDocument")}
            </button>
          </div>

          {showForm && (
            <div className={styles.inlineForm}>
              <div className={styles.inlineField} style={{ flex: 2 }}>
                <label>{t("documents.fileName")}</label>
                <input
                  value={form.fileName}
                  onChange={(e) => setForm({ ...form, fileName: e.target.value })}
                  placeholder="e.g. Planos_Estructura.pdf"
                />
              </div>
              <div className={styles.inlineField} style={{ flex: 2 }}>
                <label>{t("documents.fileUrl")}</label>
                <input
                  value={form.fileUrl}
                  onChange={(e) => setForm({ ...form, fileUrl: e.target.value })}
                  placeholder="e.g. /docs/file.pdf"
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

          {activeDocs.length === 0 ? (
            <div className={shared.muted}>{t("documents.noDocuments")}</div>
          ) : (
            activeDocs.map((doc) => (
              <div
                key={doc.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "8px 0",
                  borderBottom: "1px solid var(--admin-separator)",
                  fontSize: 12,
                }}
              >
                <span style={{ fontWeight: 500, flex: 1 }}>{doc.fileName}</span>
                {doc.fileSizeBytes && (
                  <span className={shared.muted}>
                    {(doc.fileSizeBytes / 1024 / 1024).toFixed(1)} MB
                  </span>
                )}
                <span className={shared.muted}>
                  {doc.createdAt.toLocaleDateString("es-ES")}
                </span>
                <button
                  type="button"
                  className={styles.btnSmall}
                  style={{ fontSize: 10, color: "var(--error)" }}
                  onClick={() => handleDeleteDoc(doc.id)}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}
