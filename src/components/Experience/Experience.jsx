import React from "react";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import bVLogo from "../../assets/Image/wordpress.png";
import SectionTitle from "../Shared/SectionTitle";
import { FaDatabase, FaReact, FaWordpress } from "react-icons/fa";
const Experience = () => {
  return (
    <div id="experience" className="container pt-16 md:pt-32">
      <div className="mb-6 md:mb-12">
        <SectionTitle title="Experience"></SectionTitle>
      </div>

      <VerticalTimeline className="py-0">
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#020F22", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #B492FC" }}
          date="2022 - present"
          iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={<FaWordpress className="text-5xl animate-bounce"></FaWordpress>}
        >
          <h3
            className="text-2xl font-semibold bg-gradient-to-l from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
          >
            Junior Web Developer
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Brand & Visual</h4>
          <p>
            Wordpress Developer, Woocomerece, CPanel Management, User
            Experience, Bug Fixing
          </p>
        </VerticalTimelineElement>

        {/* _________________________________ */}

        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#020F22", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #B492FC" }}
          date="Jun 2023 - Aug 2023"
          iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={<FaReact className="text-5xl animate-spin"></FaReact>}
        >
          <h3
            className="text-2xl font-semibold bg-gradient-to-l from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
          >
            MERN Stack Developer (intern)
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Stackkaroo.com</h4>
          <p>
            React, next js, redux-toolkit, api instigation , Bug Fixing, convert
            figma to react, decision making
          </p>
        </VerticalTimelineElement>
        <VerticalTimelineElement
          className="vertical-timeline-element--work"
          contentStyle={{ background: "#020F22", color: "#fff" }}
          contentArrowStyle={{ borderRight: "7px solid  #B492FC" }}
          date="Aug 2023 - Jan 2024"
          iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={<FaDatabase className="text-5xl animate-pulse"></FaDatabase>}
        >
          <h3
            className="text-2xl font-semibold bg-gradient-to-l from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
          >
            Software Developer
          </h3>
          <h4 className="vertical-timeline-element-subtitle">Apna Byte</h4>
          <p>
            React, redux-toolkit, SQL, Node, Express api instigation , Bug
            Fixing, decision making, Team Lead, Trainer,
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          iconStyle={{ background: "#020F22", color: "#fff" }}
          icon={<FaReact className="text-5xl animate-spin"></FaReact>}
        />
      </VerticalTimeline>
    </div>
  );
};

export default Experience;
