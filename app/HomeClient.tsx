"use client";

import { type ProjectMeta } from "./lib/projects";
import Link from "next/link";
import ModeToggle from "./components/ModeToggle";

const experiences = [
    { company: "'Sup", title: "Full Stack Intern" },
    { company: "UT Dallas", title: "LLM Research" },
    { company: "XNode.AI", title: "AI Intern" },
];

interface Props {
    projects: ProjectMeta[];
}

export default function HomeClient({ projects }: Props) {
    return (
        <>
            <ModeToggle />

            <div className="page-container">
                {/* Header Section */}
                <header className="header-section animate-in">
                    <div className="profile-picture">
                        {/* Placeholder for profile picture */}
                    </div>
                    <div className="header-info">
                        <h1 className="header-name">Abhinav Malkoochi</h1>
                        <div className="header-links">
                            <a
                                href="https://github.com/AbhinavMalkoochi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="header-link"
                            >
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                GitHub
                            </a>
                            <a
                                href="mailto:abhinav.malkoochi@gmail.com"
                                className="header-link"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email
                            </a>
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                className="header-link"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                </svg>
                                Resume
                            </a>
                        </div>
                    </div>
                </header>

                {/* About Section */}
                <section className="about-section animate-in delay-1">
                    <p className="about-text">
                        CS graduate from UT Dallas. Building AI infrastructure—LLM tooling,
                        browser automation, and developer productivity systems.
                    </p>
                </section>

                {/* Experience Section */}
                <section className="experience-section animate-in delay-2">
                    <h2 className="section-title">Experience</h2>
                    <div className="experience-list">
                        {experiences.map((exp) => (
                            <div key={exp.company} className="experience-item">
                                <span className="experience-company">{exp.company}</span>
                                <span className="experience-title">{exp.title}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Projects Section - Compact Rows */}
                <section className="projects-section animate-in delay-3">
                    <h2 className="section-title">Projects</h2>
                    <div className="projects-list">
                        {projects.map((project) => (
                            <div key={project.slug} className="group relative flex items-center pr-4 border-b border-border last:border-0 hover:bg-black/5 transition-colors rounded-lg -mx-2 px-2">
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="flex-grow py-5 pr-8 flex justify-between items-center group cursor-pointer"
                                >
                                    <div className="flex flex-col gap-1">
                                        <span className="text-base font-medium text-foreground">{project.name}</span>
                                        <span className="text-sm text-muted">{project.summary}</span>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {project.tech.map(t => (
                                            <span key={t} className="tag">{t}</span>
                                        ))}
                                    </div>
                                </Link>

                                {/* GitHub Link - Stays on right, doesn't block text */}
                                <a
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-muted hover:text-black hover:bg-black/10 rounded-full transition-all opacity-0 group-hover:opacity-100 flex-shrink-0"
                                    title="View Source"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                    </svg>
                                </a>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
