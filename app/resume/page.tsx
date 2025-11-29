export default function ResumePage() {
  return (
    <div className="notion-content">
      <div className="animate-in">
        <h1 className="notion-title">Resume</h1>
        <p className="notion-subtitle">
          Experience, education, and skills.
        </p>
      </div>

      <div className="prose-custom animate-in delay-1">
        <h2>Experience</h2>
        
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-base font-medium text-foreground m-0">Founding Engineer</h3>
            <span className="text-sm text-muted">2023 — Present</span>
          </div>
          <p className="text-sm text-muted mt-1 mb-2">Startup #2</p>
          <p>
            Building core infrastructure and product features. Working across the full 
            stack from system design to user-facing implementation.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-base font-medium text-foreground m-0">Founding Engineer</h3>
            <span className="text-sm text-muted">2022 — 2023</span>
          </div>
          <p className="text-sm text-muted mt-1 mb-2">Startup #1</p>
          <p>
            Early-stage engineering work including architecture decisions, feature 
            development, and establishing engineering practices.
          </p>
        </div>

        <h2>Education</h2>
        
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-1">
            <h3 className="text-base font-medium text-foreground m-0">B.S. Computer Science</h3>
            <span className="text-sm text-muted">Dec 2025</span>
          </div>
          <p className="text-sm text-muted mt-1 mb-2">University of Texas at Dallas</p>
        </div>

        <h2>Skills</h2>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {[
            "TypeScript",
            "Python",
            "React",
            "Next.js",
            "Node.js",
            "PostgreSQL",
            "Redis",
            "AWS",
            "Docker",
            "Git",
          ].map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </div>

        <h2 className="mt-12">Contact</h2>
        <p>
          <a href="mailto:abhinav@example.com">abhinav@example.com</a>
        </p>
      </div>
    </div>
  );
}

