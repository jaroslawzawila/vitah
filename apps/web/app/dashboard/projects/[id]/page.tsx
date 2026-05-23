import { redirect } from "next/navigation";
import { getProject } from "../../../actions/projects";
import ProjectDetailClient from "./ProjectDetailClient";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    redirect("/dashboard/projects");
  }

  return <ProjectDetailClient project={project} />;
}
