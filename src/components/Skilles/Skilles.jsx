import React from "react";
import skillDataLoader from "../../Utilities/SkillDataLoader";
import Skill from "../Skill/Skill";
import SectionTitle from "../Shared/SectionTitle";

const Skilles = () => {
const [skills,setSkills] = skillDataLoader();
console.log(skills);
    
  return (
    <div id="skills" className="container pt-16 md:pt-32">
      <SectionTitle title="My Skills"></SectionTitle>
      <div data-aos="flip-up" className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-12 mt-7 md:mt-14">
        {
          skills.map(skill => <Skill key={skill.id} skill={skill}></Skill>)
        }
      </div>
    </div>
  );
};

export default Skilles;
