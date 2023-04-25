import React from "react";
import heroImg from "../../assets/Image/heroImg.png";
import Typewriter from "typewriter-effect";
import { FaDownload } from "react-icons/fa";

const HeroSection = () => {
  return (
    <section className="container">
      <div>
        <div className="min-h-screen py-32">
          <div className="flex flex-col md:flex-row justify-between items-center w-full">
            <div className="text-white flex-1 space-y-3">
              <h6 className="text-2xl font-semibold">
                Hey There <span className="animate-spin">👋🏻</span>
              </h6>
              <h1 className="text-5xl mb-5">
                Iam,{" "}
                <span className="text-5xl font-bold text-white drop-shadow-lg shadow-secondary">
                  Sourav
                </span>
              </h1>

              <h4 className="text-3xl font-semibold text-purple-500">
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
                <button className="btn btn-primary mt-10 flex items-center gap-3"><FaDownload></FaDownload>DownLoad Cv</button>
              </div>
            </div>
            <div className="flex-1">
              <img
                src={heroImg}
                className="max-w-sm mx-auto flex-1 rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
