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
              <h1 className="text-6xl mb-5">
                Iam,{" "}
                <span className="text-5xl font-bold text-white drop-shadow-lg shadow-secondary">
                  Sourav
                </span>
              </h1>

              <h4 className="text-4xl font-semibold text-purple-500">
                <Typewriter
                  options={{
                    strings: [
                      "Front End Web Designer ",
                      "Web Developer",
                      "Wordpress Developer",
                      "Freelancer",
                    ],
                    autoStart: true,
                    loop: true,
                    delay: 75,
                  }}
                />
              </h4>

              <div>
                <button className="btn btn-primary mt-10 flex items-center gap-3">
                  <FaDownload></FaDownload>DownLoad Cv
                </button>
              </div>
            </div>
            <div className="flex-1">
              <Tilt>
                <img
                  src={heroImg}
                  className="max-w-md border-4 border-secondary w-full mx-auto flex-1 rounded-bl-[8rem] rounded-tr-[8rem] shadow-2xl"
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
