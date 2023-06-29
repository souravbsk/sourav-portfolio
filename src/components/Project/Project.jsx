import React from "react";
import { FaArrowRight, FaLink } from "react-icons/fa";
import { Link } from "react-router-dom";
import ProjectDetailsModal from "../ProjectDetailsModal/ProjectDetailsModal";

const Project = ({ project }) => {
  console.log(project);
  const { title,  PhotoUrl,_id, description, skills,  clientLink, serverLink, liveLink } = project;
  return (
    // to={`/projectDetail/${_id}`}
    <>
    <label htmlFor={`my_modal_${_id}`}>
    <div data-aos="flip-up" className="flex h-80 md:h-72  cursor-pointer hover:shadow-lg hover:shadow-[#b5acff] overflow-hidden flex-col-reverse relative duration-300 md:flex-row group rounded-lg border border-[#aafaff] p-4 md:p-10 gap-8 items-center justify-between">
      <h2
        className="text-2xl md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 
            "
      >
        {title}
      </h2>
      <figure className="shrink-0 border rounded-xl border-[#aafaff]  rotate-0">
        <img
          className="max-w-full object-top  group-hover:opacity-40 object-cover w-60  h-52 md:h-60 duration-300 rounded-xl  group-hover:shadow-lg group-hover:shadow-[#b5acff]
        "
          src={PhotoUrl}
          alt=""
        />
      </figure>
      <Link
        className="text-3xl z-50 hidden duration-300 group-hover:block absolute top-2/4 -translate-y-1/2 right-6 text-[#02132B] bg-[#aafaff] rounded-md"
        to={liveLink}
      >
        <button className=" border-2 px-2 py-2 text-lg hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[rgba(170,249,255,0.5)] to-[#b5acff]">
        <FaLink className="text-[#02132B]"></FaLink>
            </button>
      </Link>
      <div className="absolute group-hover:translate-y-0  translate-y-96 duration-500  flex flex-col justify-between py-4 bg-transparent backdrop-blur-xl left-0 top-0 right-0 bottom-0 px-5">
        <div>
          <p className="text-white text-sm">{description?.length > 200 ? description.slice(0,200) + "..." : description}</p>
          <ul className="mt-1 hidden md:block">
            {skills.map((item, i) => (
              <span
                key={i}
                className="badge text-white font-mono font-extralight px-2 text-sm mb-1 py-2 border-white mr-2  bg-[#46375ab7]"
              >
                {item}
              </span>
            ))}
          </ul>
        </div>
        <div className=" flex flex-wrap items-center gap-3">
        <Link to={clientLink}><button className=" border-2 text-sm px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
           client code
            </button></Link>
        <Link to={serverLink}><button className=" border-2  text-sm px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
           server code
            </button></Link>
            <label htmlFor={`my_modal_${_id}`} className="cursor-pointer border-2 text-sm px-2 py-2 hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">Project Details</label>

        </div>
      </div>
    </div>
    </label>
    <ProjectDetailsModal id={_id} project={project}></ProjectDetailsModal>
    </>
  );
};

export default Project;
