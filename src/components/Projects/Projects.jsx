import React from "react";
import ProjectDataLoader from "../../Utilities/ProjectDataLoader";
import Project from "../Project/Project";
import SectionTitle from "../Shared/SectionTitle";
import { Link } from "react-router-dom";

const Projects = () => {
  const projects = ProjectDataLoader();
  console.log(projects);
  return (
    <div id="projects" className="container pt-16 md:pt-32">
     <SectionTitle title="My Projects"></SectionTitle>
      <div className="grid md:grid-cols-2 gap-7 mt-12">
        {projects?.slice(0, 4)?.map((project) => (
          <Project key={project.id} project={project}></Project>
        ))}
      </div>
      <div className="text-center mt-12">
     <Link to="/projects"> <button className=" border-2 text-lg hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
      Explore More Projects
                </button></Link>
      </div>
    </div>
  );
};

export default Projects;
