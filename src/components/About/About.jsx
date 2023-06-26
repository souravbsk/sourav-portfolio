import React from "react";
import Lottie from "lottie-react";
import codingImg from "../../assets/Image/about.json";
import { Tilt } from "react-tilt";
import SectionTitle from "../Shared/SectionTitle";

const About = () => {
  return (
    <div className="container pt-16  md:pt-32">
     <SectionTitle title="About Me"></SectionTitle>
      <div  className="flex gap-8 flex-col md:flex-row justify-between items-center">
        <div  data-aos="fade-right">
        <Tilt>
          <Lottie
            className="flex-shrink md:w-10/12"
            animationData={codingImg}
            loop={true}
          />
        </Tilt>
        </div>
        <div data-aos="fade-left" className="flex-1 text-white">
          <p className="text-sm">
          I am a skilled web developer proficient in HTML, CSS, Bootstrap,
          Tailwind, JavaScript, React, React Router, Firebase, Express, MongoDB,
          Node.js, and WordPress. I create visually appealing, responsive, and
          user-friendly websites optimized for performance across devices. My
          expertise in JavaScript, React JS, and express enables me to build
          dynamic and interactive websites. <br /> With experience in WordPress
          and Elementor, I can design custom websites tailored to specific
          needs. <br />
          To further support my capabilities, I encourage you to explore my
          portfolio, which showcases some of my best work. If you are in need of
          a reliable and skilled web developer for your next project, I would be
          more than happy to discuss your requirements and collaborate with you
          to design and develop high-quality websites that meet the needs of
          businesses and individuals.
          <br />
          Please feel free to reach out to me, and I will be glad to provide you
          with a comprehensive solution tailored to your specific goals and
          objectives.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
