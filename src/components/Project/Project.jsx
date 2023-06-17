import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

const Project = ({ project }) => {
  console.log(project);
  const { title, image, description, technology, gitLink, liveLink } = project;
  return (
    <div className="flex cursor-pointer overflow-hidden flex-col-reverse relative duration-300 md:flex-row group rounded-lg border border-[#aafaff] px-10 py-8 gap-10 items-center justify-between">
      <h2
        className="text-lg md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400 
            "
      >
        {title}
      </h2>
      <figure className="shrink-0 rotate-0">
        <img
          className="max-w-full w-60 h-36 duration-300 rounded-xl  group-hover:shadow-lg group-hover:shadow-[#b5acff]
        "
          src={image}
          alt=""
        />
      </figure>
      <Link
        className="text-3xl z-50 hidden duration-300 group-hover:block absolute top-2/4 -translate-y-1/2 right-6 text-[#02132B] bg-[#aafaff] rounded-md"
        to={liveLink}
      >
        <button className=" border-2 px-2 py-2 text-lg hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
        <FaArrowRight className="text-[#02132B]"></FaArrowRight>
            </button>
      </Link>
      <div className="absolute group-hover:translate-y-0  translate-y-96 duration-300  flex flex-col justify-between py-4 bg-transparent backdrop-blur-xl left-0 top-0 right-0 bottom-0 px-5">
        <div>
          <p>{description}</p>
          <ul className="mt-3">
            {technology.map((item, i) => (
              <span
                key={i}
                className="badge text-white font-medium px-3 py-3 border-white mr-2  bg-[#02132B]"
              >
                {item}
              </span>
            ))}
          </ul>
        </div>
        <div>
        <Link to={gitLink}><button className=" border-2 px-2 py-2 text-lg hover:border-[#aafaff] border-[#aafaff]  rounded-md  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]">
           client side code
            </button></Link>
        </div>
      </div>
    </div>
  );
};

export default Project;
