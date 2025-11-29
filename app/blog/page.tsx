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
    
    if (!fs.existsSync(blogDir)) {
        return [];
    }
    
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
        <div className="notion-content">
            <div className="animate-in">
                <h1 className="notion-title">Writing</h1>
                <p className="notion-subtitle">
                    Notes, thoughts, and technical writing.
                </p>
            </div>

            <div className="animate-in delay-1">
                {posts.length === 0 ? (
                    <p className="text-muted">
                        No posts yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {posts.map(post => (
                            <Link
                                key={post.slug}
                                href={`/blog/${post.slug}`}
                                className="notion-card"
                            >
                                <div className="flex justify-between items-baseline gap-4">
                                    <div className="notion-card-title">{post.title}</div>
                                    <time className="text-xs text-muted flex-shrink-0">
                                        {new Date(post.date).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric',
                                        })}
                                    </time>
                                </div>
                                {post.description && (
                                    <p className="notion-card-desc mt-1">
                                        {post.description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
