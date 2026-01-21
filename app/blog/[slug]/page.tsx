import fs from 'fs';
import path from 'path';
import Link from 'next/link';
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
    
    if (!fs.existsSync(blogDir)) {
        return [];
    }
    
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
        <div className="blog-content">
            <div className="animate-in">
                <Link
                    href="/blog"
                    className="text-sm text-muted hover:text-foreground transition-colors mb-6 inline-block"
                >
                    ← Writing
                </Link>
                <h1 className="blog-title">{frontmatter.title || slug}</h1>
                {frontmatter.date && (
                    <p className="blog-subtitle">
                        {new Date(frontmatter.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}
                    </p>
                )}
            </div>

            <div className="prose-custom animate-in delay-1">
                <MDXRemote source={content} />
            </div>
        </div>
    );
}
