import React from "react";
import heroImg from "../../assets/Image/heroImg.png";
import Typewriter from "typewriter-effect";
import { FaDownload, FaEye, FaFacebook, FaGithub, FaLinkedin, FaStackOverflow } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { Tilt } from "react-tilt";
import CircleAnimation from "../CircleAnimation/CircleAnimation";
import { Link } from "react-router-dom";
// import resumePdf from "../../assets/Resume-pdf/React Js Developer Resume of sourav basak.pdf"

const HeroSection = () => {



  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/Full Stack Developer Resume of sourav basak.pdf";
    downloadLink.download = "Full Stack Developer Resume of sourav basak.pdf";
    downloadLink.click();
  };


  return (
    <section className="container" id="home">
      <div>
        <div className="pt-5 md:pt-20">
          <div className="flex gap-14 flex-col md:flex-row justify-between md:items-center w-full">
            <div className="text-white flex-1 space-y-3">
              <h6 className="text-xl md:text-3xl font-semibold">
                Hey There <span className="animate-spin">👋🏻</span>
              </h6>
              <h1 className="text-3xl md:text-5xl mb-5">
                Iam,{" "}
                <span className="text-3xl md:text-5xl font-bold text-white drop-shadow-lg shadow-secondary ">
                  Sourav
                </span>
              </h1>

              <h4 className="text-2xl md:text-4xl font-semibold text-[#31B6E7]">
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

              <div className="flex  pt-5 md:pt-10 gap-3 flex-col md:flex-row">
            
                <button  onClick={handleDownload} className=" rounded-3xl border-2 text-md hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]   flex items-center gap-3" to="https://drive.google.com/u/0/uc?id=1JsGK4WrN9lDECmJPrvJTtTUdryI3Jltd&export=download" >
                  <FaDownload className="animate-bounce text-[#b5acff]"></FaDownload>DownLoad Resume
               </button>
                <Link to='https://drive.google.com/file/d/1JsGK4WrN9lDECmJPrvJTtTUdryI3Jltd/view?usp=sharing' target="_blank">
                <button className=" border-2 text-md hover:border-[#aafaff] border-[#aafaff] btn rounded-3xl  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff] flex items-center gap-3">
                  <FaEye className="text-[#b5acff]"></FaEye>View Resume
                </button>
                </Link>
 
              </div>
              <div>
                <ul className="flex items-center mt-6 md:mt-12 gap-6">
                  <li className="hover:-mt-5 duration-300"><Link to="https://github.com/souravbsk" target="_blank" className="text-3xl text-[#d3ceff]"><FaGithub></FaGithub></Link></li>
                  <li className="hover:-mt-5 duration-300"><Link to="https://www.linkedin.com/in/souravbsk/" target="_blank" className="text-3xl text-[#d3ceff]"><FaLinkedin></FaLinkedin></Link></li>
                  <li className="hover:-mt-5 duration-300"><Link to="https://www.facebook.com/sourav.Alien" target="_blank" className="text-3xl text-[#d3ceff]"><FaFacebook></FaFacebook></Link></li>
                  <li className="hover:-mt-5 duration-300"><Link to="https://stackoverflow.com/users/21434261/sourav-basak" target="_blank" className="text-3xl text-[#d3ceff]"><FaStackOverflow></FaStackOverflow></Link></li>
                  <li className="hover:-mt-5 duration-300"><Link to="https://stackoverflow.com/users/21434261/sourav-basak" target="_blank" className="text-3xl text-[#d3ceff]"><FiMail></FiMail></Link></li>
                </ul>
              </div>
              
            </div>
            <div data-aos="zoom-in-up" className="flex-1 relative">
               <div className="box"></div>
               <div className=" rounded-2xl text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff] absolute -bottom-6 px-3 md:px-8 py-3  md:left-20 md:text-xl border-2 text-md border-[#aafaff] font-bold  backdrop-blur-2xl">
                <span className="text-2xl md:text-5xl">2+</span> Year
                <br />
                Experience
               </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
