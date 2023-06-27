import { useEffect, useState } from "react"

const ProjectDataLoader = () => {
    const [projects,setProjects] = useState([]);
    useEffect(() => {
        fetch("https://sourav-portfolio-server.vercel.app/projects")
        .then(res => res.json())
        .then(data => setProjects(data));
    },[])
    return projects
}

export default ProjectDataLoader