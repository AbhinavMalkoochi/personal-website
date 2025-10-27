import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';

interface BlogPostPageProps {
    params: Promise<{
        slug: string;
    }>;
}

async function getBlogPost(slug: string) {
    const filePath = path.join(process.cwd(), 'content/blogs', `${slug}.mdx`);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
        frontmatter: data,
        content,
    };
}

export async function generateStaticParams() {
    const blogDir = path.join(process.cwd(), 'content/blogs');
    const files = fs.readdirSync(blogDir);

    return files
        .filter(file => file.endsWith('.mdx'))
        .map(file => ({
            slug: file.replace('.mdx', ''),
        }));
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params;
    const { frontmatter, content } = await getBlogPost(slug);

    return (
        <article className="space-y-8">
            <header className="space-y-4 border-b border-zinc-200 dark:border-zinc-800 pb-8">
                <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                    {frontmatter.title || slug}
                </h1>
                {frontmatter.date && (
                    <time className="text-sm text-zinc-500 dark:text-zinc-500">
                        {new Date(frontmatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </time>
                )}
                {frontmatter.description && (
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">
                        {frontmatter.description}
                    </p>
                )}
            </header>

            <div className="prose prose-zinc dark:prose-invert max-w-none">
                <MDXRemote source={content} />
            </div>
        </article>
    );
}

