import { getAllProjects } from "./lib/projects";
import HomeClient from "./HomeClient";

export default async function Home() {
    const projects = await getAllProjects();
    return <HomeClient projects={projects} />;
}
