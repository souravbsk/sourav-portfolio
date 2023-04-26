import React from "react";
import skillDataLoader from "../../Utilities/SkillDataLoader";
import Skill from "../Skill/Skill";

const Skilles = () => {
const [skills,setSkills] = skillDataLoader();
console.log(skills);
    
  return (
    <div  className="container  py-24">
      <div className="text-center">
        <h2 className="text-5xl font-bold">My Skills</h2>
      </div>
      <div data-aos="flip-up" className="grid grid-cols-1 md:grid-cols-5 gap-12 mt-14">
        {
          skills.map(skill => <Skill key={skill.id} skill={skill}></Skill>)
        }
      </div>
    </div>
  );
};

export default Skilles;
