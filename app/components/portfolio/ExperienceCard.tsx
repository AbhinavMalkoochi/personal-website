import Image from "next/image";

interface ExperienceCardProps {
  index: number;
  company: string;
  title: string;
  detail: string;
  image: string;
}

export function ExperienceCard({
  index,
  company,
  title,
  detail,
  image,
}: ExperienceCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article className="experience-card">
      <div className="experience-copy">
        <div className="card-index">{number}</div>
        <h3>{company}</h3>
        <p className="role-title">{title}</p>
        <p>{detail}</p>
      </div>
      <div className="experience-art" aria-hidden="true">
        <Image
          src={image}
          alt=""
          fill
          aria-hidden="true"
          sizes="(max-width: 720px) 100vw, 520px"
        />
      </div>
    </article>
  );
}
