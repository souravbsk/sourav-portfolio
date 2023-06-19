import React from "react";
import skillDataLoader from "../../Utilities/SkillDataLoader";
import Skill from "../Skill/Skill";
import SectionTitle from "../Shared/SectionTitle";

const Skilles = () => {
const [skills,setSkills] = skillDataLoader();
console.log(skills);
    
  return (
    <div  className="container  pt-32">
      <SectionTitle title="My Skills"></SectionTitle>
      <div data-aos="flip-up" className="grid grid-cols-1 md:grid-cols-4 gap-12 mt-14">
        {
          skills.map(skill => <Skill key={skill.id} skill={skill}></Skill>)
        }
      </div>
    </div>
  );
};

export default Skilles;
