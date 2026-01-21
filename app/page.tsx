import Link from "next/link";

export default function Home() {
    return (
        <div className="section-wrapper flex flex-col items-center justify-center text-center">
            <div className="animate-in">
                <h1 className="hero-title">Abhinav Malkoochi</h1>
                <p className="text-body text-lg mt-4 max-w-md">
                    Computer Science Graduate. Building in the AI space.
                </p>

                <div className="flex gap-4 justify-center mt-10">
                    <Link href="/projects" className="btn-primary">
                        View Work
                    </Link>
                    <Link href="/resume" className="btn-secondary">
                        Resume
                    </Link>
                </div>
            </div>
        </div>
    );
}
