import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaDownload } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import AnchorLink from "react-anchor-link-smooth-scroll";

const Header = () => {
  const [navBarShow, setNavbarShow] = useState(false);
  const handleDownload = () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = "/Full Stack Developer Resume of sourav basak.pdf";
    downloadLink.download = "Full Stack Developer Resume of sourav basak.pdf";
    downloadLink.click();
  };

  return (
    <header className="fixed border-b border-slate-600 z-50 right-0 left-0 backdrop-blur-lg top-0 text-white shadow-lg rounded-b-3xl">
      <div className="container mx-auto flex items-center justify-between py-6">
        <h1
          className="text-lg md:text-3xl font-semibold  bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
        >
          Sourav Basak
        </h1>
        <nav className="space-x-4">
          <div className="block md:hidden">
            
            <button
              className="text-xl bg-purple-400 px-2 rounded-md py-2"
              onClick={() => setNavbarShow(!navBarShow)}
            >
              {navBarShow ? <RxCross1></RxCross1> : <FaBars></FaBars>}
            </button>
          </div>
          <ul
            style={{ margin: "0" }}
            className={`flex md:static absolute h-screen md:h-auto shadow-lg md:shadow-none shadow-[#9CACFB] md:shadow-transparent px-16 py-10 md:py-0 md:px-0 md:bg-transparent bg-[#02132B] backdrop-blur-md flex-col md:flex-row items-center top-20 duration-300 md:gap-8 gap-6 ${
              navBarShow ? "left-0" : "-left-96"
            } `}
          >
            <li>
              <AnchorLink
                href="#home"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                Home
              </AnchorLink>
            </li>
            <li>
              <AnchorLink
                href="#about"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                About
              </AnchorLink>
            </li>
            <li>
              <AnchorLink
                href="#skills"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                Skills
              </AnchorLink>
            </li>
            <li>
              <AnchorLink
                href="#projects"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                Projects
              </AnchorLink>
            </li>
            <li>
              <AnchorLink
                href="#experience"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                Experience
              </AnchorLink>
            </li>
            <li>
              <AnchorLink
                href="#contact"
                className="font-bold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400"
              >
                Contact
              </AnchorLink>
            </li>
           <li className="hidden md:block">
           <button  onClick={handleDownload} className=" rounded-3xl border-2 text-md hover:border-[#aafaff] border-[#aafaff] btn  primary-btn font-bold text-transparent  bg-clip-text bg-gradient-to-r from-[#aafaff] to-[#b5acff]   flex items-center gap-3" to="https://drive.google.com/u/0/uc?id=1JsGK4WrN9lDECmJPrvJTtTUdryI3Jltd&export=download" >
                  <FaDownload className="animate-bounce text-[#b5acff]"></FaDownload>Resume
               </button>
           </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
