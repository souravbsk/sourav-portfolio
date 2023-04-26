import React from "react";

const Skill = ({ skill }) => {
  const { id, icon, title } = skill;
  return (
    <div className="card backdrop-blur-3xl hover:shadow-secondary group hover:scale-110 duration-300 rounded-lg border-2 border-secondary shadow-lg">
      <figure className="px-10 pt-10">
        <img
          src={icon}
          alt="Shoes"
          className=" group-hover:scale-125 duration-300   px-2 py-2 w-24 h-24 object-contain"
        />
      </figure>
      <div className="card-body items-center text-center">
        <h2 className="card-title">{title}</h2>
      </div>
    </div>
  );
};

export default Skill;
