import { useEffect, useState } from "react"

const ProjectDataLoader = () => {
    const [projects,setProjects] = useState([]);
    useEffect(() => {
        fetch("http://localhost:5000/projects")
        .then(res => res.json())
        .then(data => setProjects(data));
    },[])
    return projects
}

export default ProjectDataLoader