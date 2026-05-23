import Link from "next/link";
import { getProjects } from "../../actions/projects";
import ProjectsListClient from "./ProjectsListClient";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return <ProjectsListClient projects={projects} />;
}
