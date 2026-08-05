import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllProjects, getProjectContent } from "@/app/lib/projects";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllProjects()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectContent((await params).slug);
  return project ? { title: project.meta.name, description: project.meta.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const project = await getProjectContent((await params).slug);
  if (!project) notFound();

  return (
    <main className="detail-shell">
      <Link href="/#projects" className="back-link"><ArrowLeft size={16} /> Home</Link>
      <header className="article-header project-header">
        <div className="tag-row">{project.meta.tech.map((tech) => <span key={tech}>{tech}</span>)}</div>
        <h1>{project.meta.name}</h1>
        <p>{project.meta.summary}</p>
        <a className="source-link" href={project.meta.githubUrl} target="_blank" rel="noreferrer">
          <Github size={17} /> Source
        </a>
      </header>
      <article className="prose"><MDXRemote source={project.content} /></article>
    </main>
  );
}
