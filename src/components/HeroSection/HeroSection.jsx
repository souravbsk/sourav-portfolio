import React from "react";
import heroImg from "../../assets/Image/heroImg.png";
import Typewriter from "typewriter-effect";
import { FaDownload } from "react-icons/fa";
import { Tilt } from "react-tilt";

const HeroSection = () => {
  return (
    <section className="container">
      <div>
        <div className="py-24">
          <div className="flex gap-8 flex-col md:flex-row justify-between items-center w-full">
            <div className="text-white flex-1 space-y-3">
              <h6 className="text-3xl font-semibold">
                Hey There <span className="animate-spin">👋🏻</span>
              </h6>
              <h1 className="text-5xl mb-5">
                Iam,{" "}
                <span className="text-5xl font-bold text-white drop-shadow-lg shadow-secondary ">
                  Sourav
                </span>
              </h1>

              <h4 className="text-4xl font-semibold text-[#31B6E7]">
                <Typewriter
                  options={{
                    strings: [
                      "React Developer",
                      "Front End Designer ",
                      "Web Developer",
                      "MERN Stack Developer",
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                  }}
                />
              </h4>

              <div>
                <button className=" border-2 text-lg hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]  mt-10 flex items-center gap-3">
                  <FaDownload className="text-[#b5acff]"></FaDownload>DownLoad Cv
                </button>
 
              </div>
              
            </div>
            <div className="flex-1">
              <Tilt>
                <img
                  src={heroImg}
                  className="max-w-md shadow-[#b5acff] border-4 border-[#aafaff] w-full mx-auto flex-1 rounded-bl-[8rem] rounded-tr-[8rem] shadow-md"
                />
              </Tilt>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
