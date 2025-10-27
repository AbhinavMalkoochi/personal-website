import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import matter from 'gray-matter';

interface BlogPost {
    slug: string;
    title: string;
    date: string;
    description?: string;
}

function getBlogPosts(): BlogPost[] {
    const blogDir = path.join(process.cwd(), 'content/blogs');
    const files = fs.readdirSync(blogDir);

    const posts = files
        .filter(file => file.endsWith('.mdx'))
        .map(file => {
            const slug = file.replace('.mdx', '');
            const filePath = path.join(blogDir, file);
            const fileContents = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(fileContents);

            return {
                slug,
                title: data.title || slug,
                date: data.date || new Date().toISOString(),
                description: data.description,
            };
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return posts;
}

export default function BlogPage() {
    const posts = getBlogPosts();

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
                Blog
            </h1>

            {posts.length === 0 ? (
                <p className="text-zinc-600 dark:text-zinc-400">
                    No blog posts yet.
                </p>
            ) : (
                <div className="space-y-8">
                    {posts.map(post => (
                        <Link
                            key={post.slug}
                            href={`/blog/${post.slug}`}
                            className="block group"
                        >
                            <article className="space-y-2">
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-zinc-600 dark:group-hover:text-zinc-400 transition-colors">
                                    {post.title}
                                </h2>
                                <time className="text-sm text-zinc-500 dark:text-zinc-500">
                                    {new Date(post.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </time>
                                {post.description && (
                                    <p className="text-zinc-600 dark:text-zinc-400">
                                        {post.description}
                                    </p>
                                )}
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

