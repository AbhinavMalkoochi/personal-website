import Link from "next/link";

export default function Navigation() {
    return (
        <nav className="flex items-center justify-between w-full max-w-3xl mx-auto px-6 py-8">
            <Link
                href="/"
                className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors"
            >
                Home
            </Link>
            <div className="flex gap-8">
                <Link
                    href="/blog"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    Blog
                </Link>
                <Link
                    href="/projects"
                    className="text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                >
                    Projects
                </Link>
            </div>
        </nav>
    );
}

