import React from "react";
import Project from "../Project/Project";
import { PushSpinner } from "react-spinners-kit";
const ProjectContainer = ({ projects, loading }) => {
  console.log(projects, loading);
  return (
    <>
      {loading ? (
        <div className="flex mt-12 justify-center">
          <PushSpinner size={30} color="#686769" loading={loading} />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-7 mt-12">
          {projects?.map((project) => (
            <Project key={project.id} project={project}></Project>
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectContainer;
