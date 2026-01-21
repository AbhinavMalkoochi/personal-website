export default function AboutPage() {
    return (
        <div className="section-wrapper min-h-[80vh] flex items-center justify-center">
            <div className="painting-frame animate-reveal max-w-3xl w-full text-center">
                <h1 className="gallery-title mb-8">About</h1>

                <div className="prose prose-invert prose-lg mx-auto leading-loose text-neutral-300 font-serif italic">
                    <p>
                        I am Abhinav Malkoochi, a Computer Science graduate from UT Dallas.
                    </p>
                    <p>
                        My work focuses on building autonomous agents, efficient AI infrastructure, and systems that scale.
                    </p>
                    <p>
                        I enjoy solving complex problems at the intersection of mathematics and engineering.
                    </p>
                </div>

                <div className="mt-12 pt-12 border-t border-white/10 flex justify-center gap-8 font-sans text-sm uppercase tracking-widest text-neutral-500">
                    <a href="mailto:abhinav.malkoochi@gmail.com" className="hover:text-amber-400 transition-colors">Email</a>
                    <a href="https://github.com/AbhinavMalkoochi" className="hover:text-amber-400 transition-colors">GitHub</a>
                    <a href="https://linkedin.com/in/abhinav-malkoochi" className="hover:text-amber-400 transition-colors">LinkedIn</a>
                </div>
            </div>
        </div>
    );
}
