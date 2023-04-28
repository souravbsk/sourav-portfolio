import React from "react";
import ProjectDataLoader from "../../Utilities/ProjectDataLoader";
import Project from "../Project/Project";

const Projects = () => {
  const projects = ProjectDataLoader();
  console.log(projects);
  return (
    <div className="container py-24">
      <div className="text-center">
        <h2 className="text-5xl font-bold">My Projects</h2>
      </div>
      <div className="grid md:grid-cols-2 gap-7 mt-12">
        {projects.slice(0, 4).map((project) => (
          <Project key={project.id} project={project}></Project>
        ))}
      </div>
      <div className="text-center mt-12">
        <button className="btn btn-primary shadow-md shadow-secondary">Explore More Projects</button>
      </div>
    </div>
  );
};

export default Projects;
