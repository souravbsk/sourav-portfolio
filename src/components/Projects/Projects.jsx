import React, { useEffect, useState } from "react";
import SectionTitle from "../Shared/SectionTitle";
import Project from "../Project/Project";
import { Link } from "react-router-dom";
import ProjectDataLoader from "../../Utilities/ProjectDataLoader";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import ProjectDetailsModal from "../ProjectDetailsModal/ProjectDetailsModal";

const Projects = () => {
  const [tabValue, setTabValue] = useState("");
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    fetch(
      `https://sourav-portfolio-server.vercel.app/projects?tabValue=${tabValue}`
    )
      .then((res) => res.json())
      .then((data) => setProjects(data));
  }, [tabValue]);

  console.log(projects);

  return (
    <div id="projects" className="container pt-8 md:mt-32">
      <SectionTitle title="My Projects"></SectionTitle>
     

      <Tabs>
        <TabList className="grid max-w-full md:w-9/12 mx-auto grid-cols-2 md:grid-cols-5 gap-5 items-center mt-8 md:mt-12 justify-center">
          <Tab
            onClick={() => setTabValue("")}
            className=" border-2 text-base md:px-4 px-0 hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]"
          >
            All
          </Tab>
          <Tab
            onClick={() => setTabValue("frontend")}
            className=" border-2 text-base md:px-4 px-0 hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]"
          >
            Front-End
          </Tab>
          <Tab
            onClick={() => setTabValue("fullstack")}
            className=" border-2 text-base md:px-4 px-0 hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]"
          >
            Full Stack
          </Tab>
          <Tab
            onClick={() => setTabValue("wordpress")}
            className=" border-2 text-base md:px-4 px-0 hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]"
          >
            Wordpress
          </Tab>
          <Tab
            onClick={() => setTabValue("nextjs")}
            className=" border-2 text-base md:px-4 px-0 hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]"
          >
            NEXT Js
          </Tab>
        </TabList>

        <TabPanel>
          <div className="grid md:grid-cols-2 gap-7 mt-12">
            {projects?.map((project) => (
              <Project key={project.id} project={project}></Project>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-7 mt-12">
            {projects?.map((project) => (
              <Project key={project.id} project={project}></Project>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-7 mt-12">
            {projects?.map((project) => (
              <Project key={project.id} project={project}></Project>
            ))}
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-7 mt-12">
            {projects?.map((project) => (
              <Project key={project.id} project={project}></Project>
            ))}
          </div>
        </TabPanel>
      </Tabs>

      <ProjectDetailsModal></ProjectDetailsModal>
    </div>
  );
};

export default Projects;
