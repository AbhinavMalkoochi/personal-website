import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export interface ProjectMeta {
    slug: string;
    name: string;
    summary: string;
    tech: string[];
    githubUrl: string;
}

const projectsDir = path.join(process.cwd(), "content/projects");

export async function getAllProjects(): Promise<ProjectMeta[]> {
    const files = (await fs.readdir(projectsDir)).filter(f => f.endsWith(".mdx"));
    
    const projects = await Promise.all(
        files.map(async (filename) => {
            const slug = filename.replace(/\.mdx$/, "");
            const filePath = path.join(projectsDir, filename);
            const fileContent = await fs.readFile(filePath, "utf-8");
            const { data } = matter(fileContent);
            
            return {
                slug,
                name: data.name,
                summary: data.summary,
                tech: data.tech || [],
                githubUrl: data.githubUrl,
            };
        })
    );
    
    return projects;
}

export async function getProjectContent(slug: string): Promise<{ meta: ProjectMeta; content: string } | null> {
    const filePath = path.join(projectsDir, `${slug}.mdx`);
    
    try {
        const fileContent = await fs.readFile(filePath, "utf-8");
        const { data, content } = matter(fileContent);
        
        return {
            meta: {
                slug,
                name: data.name,
                summary: data.summary,
                tech: data.tech || [],
                githubUrl: data.githubUrl,
            },
            content,
        };
    } catch {
        return null;
    }
}
