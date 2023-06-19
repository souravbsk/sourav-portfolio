import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";

const Header = () => {
  const [navBarShow, setNavbarShow] = useState(false);

  return (
    <header className="fixed z-50 right-0 left-0 backdrop-blur-lg top-0 text-white shadow-lg shadow-[#9CACFB] rounded-b">
      <div className="container mx-auto flex items-center justify-between py-6">
        <h1 className="text-lg md:text-3xl font-semibold  bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">
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
              navBarShow ? "left-0" : "-left-56"
            } `}
          >
            <li>
              <Link to="/" className="font-semibold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">
                Home
              </Link>
            </li>
            <li>
              <Link to="/" className="font-semibold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">
                About
              </Link>
            </li>
            <li>
              <Link to="/" className="font-semibold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">
                Project
              </Link>
            </li>
            <li>
              <Link to="/" className="font-semibold text-xl bg-gradient-to-r from-cyan-300 
            text-transparent  bg-clip-text  to-purple-400">
                Contact
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
