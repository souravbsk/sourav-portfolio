import React from "react";
import Lottie from "lottie-react";
import codingImg from "../../assets/Image/about.json";
import { Tilt } from "react-tilt";
import SectionTitle from "../Shared/SectionTitle";

const About = () => {
  return (
    <div id="about" className="container pt-16  md:pt-32">
      <SectionTitle title="About Me"></SectionTitle>
      <div className="flex gap-8 flex-col md:flex-row justify-between items-center">
        <div data-aos="fade-right">
          <Tilt>
            <Lottie
              className="flex-shrink md:w-10/12"
              animationData={codingImg}
              loop={true}
            />
          </Tilt>
        </div>
        <div data-aos="fade-left" className="flex-1 text-white">
          <p className="text-base font-light">
            I am a skilled web developer proficient in HTML, CSS, Bootstrap,
            Tailwind, JavaScript, React, React Router, Firebase, Express,
            MongoDB, Node.js, and WordPress. With expertise in JavaScript, React
            JS, and Express, I create visually appealing, responsive, and
            user-friendly websites. I specialize in building dynamic websites
            using MERN stack technologies. also, I have experience designing
            websites using WordPress and Elementor. Take a look at my portfolio
            for examples of my work. If you are in need of a reliable and
            skilled web developer, I am here to discuss your requirements and
            deliver high-quality websites tailored to your goals. Contact me for
            a comprehensive solution for your next project.
            <br />
            Please feel free to reach out to me, and I will be glad to provide
            you with a comprehensive solution tailored to your specific goals
            and objectives.
          </p>
          <div className="flex items-center flex-wrap gap-8 mt-8">
            <div
              data-aos="fade-right"
              className=" rounded-2xl text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]  px-3 md:px-8 py-4  md:left-20 md:text-xl border-2 text-md border-[#aafaff] font-bold  backdrop-blur-2xl"
            >
              <span className="text-2xl md:text-3xl">10+</span> Project
              <br />
              Completed
            </div>
            <div
              data-aos="fade-right"
              className=" rounded-2xl text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]  px-3 md:px-8 py-4  md:left-20 md:text-xl border-2 text-md border-[#aafaff] font-bold  backdrop-blur-2xl"
            >
              <span className="text-2xl md:text-3xl">24/7</span> Online
              <br />
              Support
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
