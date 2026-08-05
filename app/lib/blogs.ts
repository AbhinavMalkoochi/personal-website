import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export interface BlogMeta {
  slug: string;
  title: string;
  summary: string;
  date: string;
  dateLabel: string;
}

const blogsDir = path.join(process.cwd(), "content/blogs");

function meta(slug: string, data: Record<string, unknown>): BlogMeta {
  const date = String(data.date);
  return {
    slug,
    title: String(data.title),
    summary: String(data.summary),
    date,
    dateLabel: new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }).format(new Date(`${date}T00:00:00Z`)),
  };
}

export async function getAllBlogs(): Promise<BlogMeta[]> {
  const files = (await fs.readdir(blogsDir)).filter((file) => file.endsWith(".mdx"));
  const posts = await Promise.all(files.map(async (file) => {
    const slug = file.replace(/\.mdx$/, "");
    const source = await fs.readFile(path.join(blogsDir, file), "utf8");
    return meta(slug, matter(source).data);
  }));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getBlog(slug: string) {
  try {
    const source = await fs.readFile(path.join(blogsDir, `${slug}.mdx`), "utf8");
    const parsed = matter(source);
    return { meta: meta(slug, parsed.data), content: parsed.content };
  } catch {
    return null;
  }
}
