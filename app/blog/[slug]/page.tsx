import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllBlogs, getBlog } from "@/app/lib/blogs";

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return (await getAllBlogs()).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlog((await params).slug);
  return post ? { title: post.meta.title, description: post.meta.summary } : {};
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlog((await params).slug);
  if (!post) notFound();

  return (
    <main className="detail-shell">
      <Link href="/#blog" className="back-link"><ArrowLeft size={16} /> Home</Link>
      <header className="article-header">
        <time dateTime={post.meta.date}>{post.meta.dateLabel}</time>
        <h1>{post.meta.title}</h1>
        <p>{post.meta.summary}</p>
      </header>
      <article className="prose"><MDXRemote source={post.content} /></article>
    </main>
  );
}
