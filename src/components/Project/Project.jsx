import React from "react";
import { FaArrowRight } from "react-icons/fa";

const Project = ({ project }) => {
  console.log(project);
  const { title, image } = project;
  return (
    <div className="flex cursor-pointer flex-col-reverse relative duration-300 md:flex-row group rounded-lg border border-secondary px-10 py-8 gap-10 items-center justify-between">
      <h2
        className='text-lg md:text-4xl font-semibold bg-gradient-to-r from-cyan-300 "
            text-transparent  bg-clip-text  to-purple-400 
            '
      >
        {title}
      </h2>
      <figure className="shrink-0 rotate-0">
        <img className="max-w-full w-60 h-36 duration-300 rounded-xl  group-hover:shadow-lg group-hover:shadow-secondary
        " src={image} alt="" />
      </figure>
        <FaArrowRight className="text-3xl hidden duration-300 group-hover:block absolute top-2/4 -translate-y-1/2 right-6 bg-secondary-300 rounded-md"></FaArrowRight>
    </div>
  );
};

export default Project;
