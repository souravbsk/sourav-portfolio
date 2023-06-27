import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import bVLogo from "../../assets/Image/wordpress.png";
import SectionTitle from "../Shared/SectionTitle";
import { FaReact, FaWordpress } from "react-icons/fa";
const Experience = () => {
  return (
    <div id="experience" className="container pt-16 md:pt-32">
      <div className="mb-6 md:mb-12">

      <SectionTitle title="Experience"></SectionTitle>
      </div>

      <VerticalTimeline   className="py-0">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#020F22", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #B492FC" }}
          date="2022 - present"
          iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={
           
                <FaWordpress className="text-5xl animate-bounce"></FaWordpress>
          
          }
        >
          <h3 className="text-3xl font-semibold bg-gradient-to-l from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">Junior Web Developer</h3>
          <h4 className="vertical-timeline-element-subtitle">Brand & Visual</h4>
          <p>
           Wordpress Developer, Woocomerece, CPanel Management, User Experience, Bug Fixing
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
        iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={
            <FaReact className="text-5xl animate-spin"></FaReact>
          }
        />
      </VerticalTimeline>
    </div>
  );
};

export default Experience;
