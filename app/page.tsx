export default function Home() {
  return (
    <div className="section-wrapper items-center justify-center min-h-[80vh]">
      <div className="painting-frame flex flex-col items-center justify-center text-center animate-reveal">
        <h1 className="gallery-title mb-6">
          Abhinav Malkoochi
        </h1>

        <div className="w-16 h-1 bg-amber-400 mb-8 mx-auto" />

        <p className="text-xl text-neutral-300 font-serif italic tracking-wide mb-2">
          Computer Science Graduate
        </p>
        <p className="text-sm text-neutral-500 uppercase tracking-[0.2em] mb-12">
          Artificial Intelligence • Systems
        </p>

        <p className="text-neutral-400 max-w-md mx-auto leading-loose italic">
          "Building at the intersection of elegant code and chaotic systems."
        </p>
      </div>
    </div>
  );
}
